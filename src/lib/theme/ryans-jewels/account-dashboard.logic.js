/** @param {any} orders @returns {any[]} */
export function dashboardOrderItems(orders) {
	return Array.isArray(orders?.data) ? orders.data : []
}

/** @param {any} orders */
export function deliveredOrderCount(orders) {
	return dashboardOrderItems(orders).filter((order) => String(order.status || '').toLowerCase() === 'delivered').length
}

/** @param {any} orders @param {string} status @param {string} search */
export function filterDashboardOrders(orders, status = 'all', search = '') {
	const query = search.trim().toLowerCase()
	return dashboardOrderItems(orders).filter((order) => {
		const matchesStatus = status === 'all' || String(order.status || '').toLowerCase() === status
		const searchable = [order.orderNo, order.parentOrderNo, ...(/** @type {any[]} */ (order.lineItems || [])).map((item) => item.title)].filter(Boolean).join(' ').toLowerCase()
		return matchesStatus && (!query || searchable.includes(query))
	})
}

/** @param {any} orders @param {string} status @param {string} search */
export function dashboardOrderRows(orders, status = 'all', search = '') {
	return filterDashboardOrders(orders, status, search).flatMap((order) => {
		const items = /** @type {any[]} */ (Array.isArray(order.lineItems) && order.lineItems.length ? order.lineItems : [{}])
		return items.map((item, index) => ({ key: `${order.id || order.orderNo || 'order'}-${item.id || item.orderItemId || index}`, order, item }))
	})
}

/** @param {unknown} status */
export function dashboardOrderStatus(status) {
	const value = String(status || 'processing').toLowerCase()
	if (value.includes('cancel')) return 'cancelled'
	if (value.includes('deliver')) return 'delivered'
	if (value.includes('ship')) return 'shipped'
	return 'processing'
}

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('account-dashboard.logic.js')) {
	const orders = { data: [{ orderNo: 'RJ-1', status: 'Delivered', lineItems: [{ title: 'Diamond Ring' }] }, { orderNo: 'RJ-2', status: 'Processing', lineItems: [] }] }
	console.assert(deliveredOrderCount(orders) === 1)
	console.assert(filterDashboardOrders(orders, 'delivered', 'ring').length === 1)
	console.assert(filterDashboardOrders(orders, 'processing', 'ring').length === 0)
	console.assert(dashboardOrderRows(orders).length === 2)
	console.assert(dashboardOrderStatus('Canceled') === 'cancelled')
	console.log('account dashboard logic: ok')
}
