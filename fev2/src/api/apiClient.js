import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8017/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true 
})

export default apiClient
