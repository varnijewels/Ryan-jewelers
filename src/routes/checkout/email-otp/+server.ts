import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'
import nodemailer from 'nodemailer'
import type { RequestHandler } from './$types.js'

const COOKIE = 'rj_checkout_email_otp'
const OTP_LIFETIME_SECONDS = 300
const RESEND_SECONDS = 30
const MAX_ATTEMPTS = 5
const developmentSecret = randomBytes(32).toString('hex')
const resendAfter = new Map<string, number>() // ponytail: per-instance throttle; move to Redis when checkout runs on multiple servers.

type OtpState = {
	email: string
	digest: string
	nonce: string
	expiresAt: number
	attempts: number
}

function normalizeEmail(value: unknown) {
	return String(value || '').trim().toLowerCase()
}

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

function secret() {
	if (env.CHECKOUT_OTP_SECRET) return env.CHECKOUT_OTP_SECRET
	if (dev) return developmentSecret
	throw new Error('CHECKOUT_OTP_SECRET is not configured')
}

function sign(value: string, key: string) {
	return createHmac('sha256', key).update(value).digest('base64url')
}

function encodeState(state: OtpState, key: string) {
	const payload = Buffer.from(JSON.stringify(state)).toString('base64url')
	return `${payload}.${sign(payload, key)}`
}

function decodeState(value: string | undefined, key: string): OtpState | null {
	if (!value) return null
	const [payload, signature] = value.split('.')
	if (!payload || !signature) return null
	const expected = Buffer.from(sign(payload, key))
	const received = Buffer.from(signature)
	if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
	try {
		return JSON.parse(Buffer.from(payload, 'base64url').toString()) as OtpState
	} catch {
		return null
	}
}

function otpDigest(email: string, otp: string, nonce: string, key: string) {
	return createHmac('sha256', key).update(`${email}:${otp}:${nonce}`).digest('hex')
}

async function deliverEmail(email: string, otp: string, logoUrl: string) {
	const configured = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM
	if (!configured) {
		if (dev) return false
		throw new Error('SMTP email delivery is not configured')
	}

	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: Number(env.SMTP_PORT || 465),
		secure: env.SMTP_SECURE !== 'false',
		auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
	})
	await transporter.sendMail({
		from: env.SMTP_FROM,
		to: email,
		subject: `${otp} is your Ryan Jewels verification code`,
		text: `Your Ryan Jewels verification code is ${otp}. It expires in 5 minutes. Do not share this code.`,
		html: `<div style="max-width:520px;margin:auto;padding:32px;border:1px solid #eee;font-family:Arial,sans-serif;color:#303030"><img src="${logoUrl}" width="110" alt="Ryan Jewels" style="display:block;margin:0 auto 24px"><h1 style="font-size:22px;text-align:center">Verify your email</h1><p style="text-align:center">Use this code to continue your Ryan Jewels checkout:</p><p style="margin:28px 0;text-align:center;font-size:34px;font-weight:700;letter-spacing:10px;color:#a80139">${otp}</p><p style="text-align:center;color:#707070">This code expires in 5 minutes. Do not share it with anyone.</p></div>`
	})
	return true
}

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	try {
		const body = await request.json()
		const action = String(body?.action || '')
		const email = normalizeEmail(body?.email)
		if (!isEmail(email)) return json({ message: 'Enter a valid email address' }, { status: 400 })
		const key = secret()

		if (action === 'send') {
			const now = Date.now()
			const wait = Math.ceil(((resendAfter.get(email) || 0) - now) / 1000)
			if (wait > 0) return json({ message: `Please wait ${wait} seconds before requesting another code` }, { status: 429 })

			const otp = String(randomInt(100000, 1_000_000))
			const nonce = randomBytes(16).toString('hex')
			const delivered = await deliverEmail(email, otp, `${url.origin}/ryans-jewels/logo.png`)
			const state: OtpState = { email, nonce, digest: otpDigest(email, otp, nonce, key), expiresAt: now + OTP_LIFETIME_SECONDS * 1000, attempts: 0 }
			cookies.set(COOKIE, encodeState(state, key), { path: '/checkout', httpOnly: true, sameSite: 'strict', secure: !dev, maxAge: OTP_LIFETIME_SECONDS })
			resendAfter.set(email, now + RESEND_SECONDS * 1000)
			return json({ success: true, cooldownSeconds: RESEND_SECONDS, ...(dev && !delivered ? { devOtp: otp } : {}) })
		}

		if (action === 'verify') {
			const otp = String(body?.otp || '').trim()
			if (!/^\d{6}$/.test(otp)) return json({ message: 'Enter the 6-digit verification code' }, { status: 400 })
			const state = decodeState(cookies.get(COOKIE), key)
			if (!state || state.email !== email || state.expiresAt < Date.now()) {
				cookies.delete(COOKIE, { path: '/checkout' })
				return json({ message: 'Verification code has expired. Request a new code.' }, { status: 400 })
			}
			if (state.attempts >= MAX_ATTEMPTS) {
				cookies.delete(COOKIE, { path: '/checkout' })
				return json({ message: 'Too many attempts. Request a new code.' }, { status: 429 })
			}

			const expected = Buffer.from(state.digest)
			const received = Buffer.from(otpDigest(email, otp, state.nonce, key))
			if (!timingSafeEqual(expected, received)) {
				state.attempts += 1
				cookies.set(COOKIE, encodeState(state, key), { path: '/checkout', httpOnly: true, sameSite: 'strict', secure: !dev, maxAge: Math.max(1, Math.ceil((state.expiresAt - Date.now()) / 1000)) })
				return json({ message: 'Incorrect verification code' }, { status: 400 })
			}

			cookies.delete(COOKIE, { path: '/checkout' })
			return json({ success: true })
		}

		return json({ message: 'Unsupported OTP action' }, { status: 400 })
	} catch (error) {
		console.error('Checkout email OTP failed', error)
		return json({ message: error instanceof Error ? error.message : 'Unable to process verification code' }, { status: 500 })
	}
}
