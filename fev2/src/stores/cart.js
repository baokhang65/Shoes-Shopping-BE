import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'

export const useCartStore = defineStore('cart', {
  state: () => ({
    count: 0,
    items: []
  }),
  actions: {
    async fetchCartFromServer() {
      try {
        const res = await apiClient.get('/cart')
        this.items = res.data?.items || []
        this.count = this.items.reduce((acc, item) => acc + item.quantity, 0)
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    },

    async add(item) {
      try {
        await apiClient.post('/cart', item)
        await this.fetchCartFromServer()
      } catch (error) {
        console.error('Error adding to cart:', error)
      }
    },

    async updateQuantity(productId, size, quantity) {
      try {
        await apiClient.put('/cart/items', { productId, size, quantity })
        await this.fetchCartFromServer()
      } catch (error) {
        console.error('Error updating quantity:', error)
      }
    },

    async remove(productId, size) {
      try {
        await apiClient.delete('/cart/items', {
          data: { productId, size }
        })
        await this.fetchCartFromServer()
      } catch (error) {
        console.error('Error removing item from cart:', error)
      }
    },

    async clear() {
      try {
        await apiClient.delete('/cart/clear')
        this.items = []
        this.count = 0
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    },

    async transferGuestCart(guestItems) {
      try {
        await apiClient.post('/cart/transfer', { items: guestItems })
        await this.fetchCartFromServer()
      } catch (error) {
        console.error('Error transferring guest cart:', error)
      }
    }
  }
})
