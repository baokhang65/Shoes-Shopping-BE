import apiClient from './apiClient'

export function getUserOrders() {
  return apiClient.get('/orders')
}

export function createOrder({ userId, shippingAddress }) {
  return apiClient.post('/orders', { userId, shippingAddress })
}

export function getOrderById(orderId) {
  return apiClient.get(`/orders/${orderId}`)
}

export function updateOrderStatus(orderId, status) {
  return apiClient.patch(`/orders/${orderId}`, { status })
}
