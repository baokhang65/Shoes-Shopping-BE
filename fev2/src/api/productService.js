import apiClient from './apiClient'

export function getProducts(params) {
  return apiClient.get('/products', { params })
}

export function getProductById(id) {
  return apiClient.get(`/products/${id}`)
}

export function searchProducts(keyword) {
  return apiClient.get('/products/search', { params: { keyword } })
}

export function getProductsByBrand(brandId) {
  return apiClient.get(`/products/brand/${brandId}`)
}
