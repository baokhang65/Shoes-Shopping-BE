import { reactive } from 'vue'
import axios from '@/api/apiClient'

export const userStore = reactive({
  user: null,
  isAuthenticated: false,

  async fetchProfile() {
    try {
      const res = await axios.get('/users/profile', { withCredentials: true })
      this.user = res.data
      this.isAuthenticated = true
    } catch {
      this.user = null
      this.isAuthenticated = false
    }
  },

  async logout() {
    await axios.delete('/users/logout', { withCredentials: true })
    this.user = null
    this.isAuthenticated = false
    window.location.reload()
  }
})
