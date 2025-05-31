import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    id: '',
    date: '',
    estimatedDelivery: '',
    items: [],        
    payment: { method: '', brand: '' },
    delivery: {
      addressLine1: '',
      addressLine2: '',
      phone: '',
      method: ''
    }
  }),
  actions: {
    setOrder(payload) {
      Object.assign(this, payload)
    },
    clear() {
      this.$reset()
    }
  }
})
