<template>
  <v-app>
    <NavBar />
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8" style="max-width: 900px">
        <v-breadcrumbs :items="breadcrumbs" class="mb-4">
          <template #divider>
            <v-icon size="16" color="grey-darken-2">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>

        <v-card rounded="lg" class="px-8 py-6">
          <v-row>
            <v-col cols="12" md="6">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Shipping Information</h2>
              <v-form ref="form" lazy-validation>
                <v-text-field v-model="order.fullName" label="Full Name" variant="outlined" class="mb-4" />
                <v-text-field v-model="order.phone" label="Phone Number" variant="outlined" class="mb-4" />
                <v-text-field v-model="order.address" label="Address" variant="outlined" class="mb-6" />

                <h3 class="text-subtitle-1 font-weight-bold mb-3">Payment</h3>
                <v-radio-group v-model="paymentMethod" hide-details>
                  <v-radio label="Thanh toán khi giao hàng (COD)" value="cod" />
                </v-radio-group>

                <v-btn class="place-order-btn" color="black" @click="placeOrder" style="margin-bottom: 12px;">
                  Place Order
                </v-btn>
                <v-btn class="back-to-cart-btn" @click="backToCart">Back to Cart</v-btn>
              </v-form>
            </v-col>

            <v-col cols="12" md="6">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Order Summary</h2>
              <div v-for="item in displayedItems" :key="item.productId + '-' + item.size"
                class="d-flex align-start mb-6">
                <v-avatar size="64" class="mr-4" rounded="lg">
                  <v-img :src="item.productImage" />
                </v-avatar>
                <div class="flex-grow-1 pr-4">
                  <div class="font-weight-medium mb-1 text-body-1">{{ item.productName }}</div>
                  <div class="text-body-2 text-grey-darken-1">Size: {{ item.size }}</div>
                  <div class="text-body-2 text-grey-darken-1">Qty: {{ item.quantity }}</div>
                </div>
                <div style="min-width: 100px" class="text-right font-weight-medium">
                  {{ formatPrice(item.price * item.quantity) }}₫
                </div>
              </div>
              <v-divider class="my-4" />
              <div class="d-flex justify-space-between mb-2">
                <span>Subtotal</span>
                <span>{{ formatPrice(subtotal) }}₫</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Delivery</span>
                <span>{{ deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) + '₫' }}</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between font-weight-bold text-body-1 mb-4">
                <span>Total</span>
                <span>{{ formatPrice(total) }}₫</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import apiClient from '@/api/apiClient'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const order = ref({ fullName: '', phone: '', address: '' })
const paymentMethod = ref('cod')
const loading = ref(false)
const error = ref('')

const breadcrumbs = [
  { title: 'Home', to: '/' },
  { title: 'Cart', to: '/cart' },
  { title: 'Checkout', disabled: true },
]

const isTempOrder = route.query.temp === 'true'
const tempOrderItems = ref([])

// Lấy danh sách sản phẩm hiển thị trong checkout
const displayedItems = computed(() => {
  return isTempOrder && tempOrderItems.value.length > 0
    ? tempOrderItems.value
    : cartStore.items
})

const subtotal = computed(() =>
  displayedItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
const deliveryFee = 0
const total = computed(() => subtotal.value + deliveryFee)

onMounted(async () => {
  if (isTempOrder) {
    // Lấy đơn hàng tạm từ localStorage (bạn có thể lưu khi thêm sản phẩm ở ProductDetails.vue)
    const saved = localStorage.getItem('tempOrder')
    if (saved) {
      tempOrderItems.value = JSON.parse(saved)
    }
  } else {
    await cartStore.fetchCart()
  }
})

const placeOrder = async () => {
  if (!order.value.fullName || !order.value.phone || !order.value.address) {
    alert('Vui lòng điền đủ thông tin giao hàng')
    return
  }
  loading.value = true
  error.value = ''
  try {
    await apiClient.post(
      '/orders/checkout',
      {
        fullName: order.value.fullName,
        phone: order.value.phone,
        address: order.value.address,
        paymentMethod: paymentMethod.value,
        items: displayedItems.value,
      },
      { withCredentials: true }
    )
    await cartStore.fetchCart()
    localStorage.removeItem('tempOrder')
    router.push('/order')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Checkout thất bại'
  } finally {
    loading.value = false
  }
}

const backToCart = () => {
  router.push('/cart')
}

const formatPrice = (price) => {
  if (!price) return ''
  return price.toLocaleString('vi-VN')
}
</script>

<style scoped>
.place-order-btn,
.back-to-cart-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-size: 17px;
}
</style>
