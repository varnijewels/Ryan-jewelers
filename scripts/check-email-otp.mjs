import assert from 'node:assert/strict'

const email = `checkout-${Date.now()}@example.com`
const endpoint = 'http://127.0.0.1:3000/checkout/email-otp'
const sent = await fetch(endpoint, {
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify({ action: 'send', email })
})
const sendResult = await sent.json()
assert.equal(sent.status, 200, sendResult.message)
assert.match(sendResult.devOtp, /^\d{6}$/, 'Run this check in development without SMTP configured')
const otpCookie = sent.headers.get('set-cookie')?.match(/rj_checkout_email_otp=[^;]+/)?.[0]
assert.ok(otpCookie, 'OTP cookie was not set')

const rejected = await fetch(endpoint, {
	method: 'POST',
	headers: { 'content-type': 'application/json', cookie: otpCookie },
	body: JSON.stringify({ action: 'verify', email, otp: '000000' })
})
const rejectResult = await rejected.json()
assert.equal(rejected.status, 400)
assert.equal(rejectResult.message, 'Incorrect verification code')
const retryCookie = rejected.headers.get('set-cookie')?.match(/rj_checkout_email_otp=[^;]+/)?.[0]
assert.ok(retryCookie, 'Retry OTP cookie was not set')

const verified = await fetch(endpoint, {
	method: 'POST',
	headers: { 'content-type': 'application/json', cookie: retryCookie },
	body: JSON.stringify({ action: 'verify', email, otp: sendResult.devOtp })
})
assert.equal(verified.status, 200, (await verified.json()).message)
console.log('checkout email OTP: ok')
