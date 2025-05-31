import apiClient from './apiClient'

export function getCart() {
  return apiClient.get('/cart')
}

export function addToCart({ productId, size, quantity }) {
  return apiClient.post('/cart', { productId, size, quantity })
}

export function updateCartItem({ productId, size, quantity }) {
  return apiClient.put('/cart/items', { productId, size, quantity })
}

export function deleteCartItem({ productId, size }) {
  return apiClient.delete('/cart/items', { data: { productId, size } })
}

export function clearCart() {
  return apiClient.delete('/cart/clear')
}
