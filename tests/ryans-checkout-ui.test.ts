import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte'
const mocks = vi.hoisted(() => ({ goto: vi.fn().mockResolvedValue(undefined), auth: vi.fn(), cart: { cart: { id: 'c1', qty: 1, subtotal: 125, total: 125, lineItems: [{ id: 'l1', productId: 'p1', variantId: 'v1', slug: 'ring', title: 'Oval halo ring', thumbnail: '/ring.webp', qty: 1, price: 125 }] }, hasLoaded: Promise.resolve(), isUpdatingCart: false, updatingItem: {}, isOpen: true, update: vi.fn(), remove: vi.fn() } }))
vi.mock('$app/state', () => ({ page: { data: { store: { currency: { code: 'USD' }, plugins: { isGuestCheckout: { active: true } }, country: { code: 'US' } } }, url: new URL('http://localhost:3000/checkout/cart') } }))
vi.mock('$app/navigation', () => ({ goto: mocks.goto }))
vi.mock('$lib/core/stores/index.js', () => ({ getCartState: () => mocks.cart, getUserState: () => ({ user: null, hasLoaded: Promise.resolve() }) }))
vi.mock('$lib/core/utils/index.js', () => ({ formatPrice: (v: number) => '$' + v.toFixed(2), fireGTagEvent: vi.fn() }))
vi.mock('$lib/core/components/index.js', () => ({ showAuthModal: mocks.auth }))
import Cart from '../src/lib/theme/ryans-jewels/RyansJewelsCartPage.svelte'
import Drawer from '../src/lib/theme/ryans-jewels/RjCartDrawer.svelte'
import Address from '../src/lib/theme/ryans-jewels/RjCheckoutAddress.svelte'
beforeEach(() => { vi.clearAllMocks(); HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open','') } })
describe('Checkout customer interactions', () => {
 it('offers guest checkout without opening an auth modal', async () => {
  render(Cart, { cartState: mocks.cart, cartModule: {} })
  await fireEvent.click(await screen.findByRole('button', { name: 'Checkout as guest' }))
  expect(mocks.goto).toHaveBeenCalledWith('/checkout/address')
  expect(mocks.auth).not.toHaveBeenCalled()
 })
 it('keeps sign-in optional with a checkout return destination', async () => {
  render(Cart, { cartState: mocks.cart, cartModule: {} })
  await fireEvent.click(await screen.findByRole('button', { name: 'Sign in', exact: true }))
  expect(mocks.auth).toHaveBeenCalledWith('login', { redirect: '/checkout/address' })
 })
 it('shows the selected cart item and routes its drawer checkout to the cart review', async () => {
  render(Drawer)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: 'Oval halo ring', exact: true })[0]).toHaveAttribute('href','/products/ring?variant_id=v1')
  await fireEvent.click(screen.getByRole('button', { name: 'Checkout', exact: true }))
  expect(mocks.goto).toHaveBeenCalledWith('/checkout/cart')
 })
 it('saves guest delivery details before moving to payment', async () => {
  const cart: any = { ...mocks.cart, cart: { ...mocks.cart.cart }, updateEmail: vi.fn(), updateShippingAddress: vi.fn() }
  cart.updateEmail.mockImplementation(async (contact: any) => Object.assign(cart.cart, contact))
  cart.updateShippingAddress.mockImplementation(async (value: any) => Object.assign(cart.cart, value, { shippingAddressId: 'address1' }))
  render(Address, { cartState: cart, addressModule: { userState: { user: null, hasLoaded: Promise.resolve() }, addresses: [] } })
  await screen.findByLabelText(/Email address/)
  for (const [label, value] of [['Email address','guest@example.com'],['First name','Test'],['Last name','Customer'],['Street address','123 Test Street'],['City','Salisbury'],['State / province','MD'],['ZIP / postal code','21801']]) await fireEvent.input(screen.getByLabelText(new RegExp('^' + label)), { target: { value } })
  expect(screen.queryByText(/verification code/i)).not.toBeInTheDocument()
  await fireEvent.submit(screen.getByRole('button', { name: 'Continue to payment' }).closest('form')!)
  await waitFor(() => expect(mocks.goto).toHaveBeenCalledWith('/checkout/payment'))
  expect(cart.updateShippingAddress).toHaveBeenCalledWith(expect.objectContaining({ shippingAddress: expect.objectContaining({ address_1:'123 Test Street', countryCode:'US' }), isBillingAddressSameAsShipping:true }))
 })
})
