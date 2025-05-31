import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/userStore'

// Import tĩnh các view quan trọng
import DefaultLayout from '@/layouts/default/Default.vue'
import Home from '@/views/Home.vue'
import Adidas from '@/views/Category/Adidas.vue'
import Nike from '@/views/Category/Nike.vue'
import Vans from '@/views/Category/Vans.vue'
import ProductDetails from '@/views/ProductDetails.vue'
import Cart from '@/views/Cart.vue'
import Order from '@/views/Order.vue'
import Checkout from '@/views/Checkout.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const requireAuth = async (to, from, next) => {
  if (!userStore.user) {
    try {
      await userStore.fetchProfile()
    } catch {
      return next('/login')
    }
  }
  next()
}

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'adidas', name: 'Adidas', component: Adidas },
      { path: 'nike', name: 'Nike', component: Nike },
      { path: 'vans', name: 'Vans', component: Vans },
      { path: ':brand/:id', name: 'ProductDetails', component: ProductDetails },
      { path: 'cart', name: 'Cart', component: Cart, beforeEnter: requireAuth },
      { path: 'order', name: 'Order', component: Order, beforeEnter: requireAuth },
      { path: 'checkout', name: 'Checkout', component: Checkout, beforeEnter: requireAuth },
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
