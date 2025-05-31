<template>
  <v-app>
    <NavBar />
    <v-main class="custom-main">
      <v-row no-gutters align="center" justify="center" class="custom-row">
        <v-col class="col-left d-flex flex-column justify-center px-4">
          <h2>{{ product?.name }}</h2>
          <h3>{{ formatPrice(product?.price) }}₫</h3>
          <div>Details</div>
          <v-divider></v-divider>
          <p>{{ product?.description }}</p>
        </v-col>
        <v-col class="col-center d-flex justify-center align-center px-4">
          <v-img :src="product?.image" contain class="product-main-img" />
        </v-col>
        <v-col class="col-right d-flex flex-column justify-center px-4">
          <div class="size-selection-wrapper">
            <div class="select-size-label">
              <span>Select Size</span>
            </div>
            <div class="size-grid">
              <div v-for="(size, idx) in sizes" :key="idx"
                :class="['size-item', { active: selectedSize === size.label, disabled: !size.available }]"
                @click="size.available && selectSize(size.label)">
                {{ size.label }}
              </div>
            </div>
            <div class="quantity-wrapper">
              <QuantityControl v-model="quantity" :min="1" :max="maxStock" />
              <span class="stock-info">{{ maxStock }} sản phẩm có sẵn</span>
            </div>
          </div>
          <v-btn class="buying-btn" color="black" @click="buying" style="margin-bottom: 12px;">
            Mua ngay
          </v-btn>
          <v-btn class="add-to-cart-btn" outlined @click="addToBag">Thêm vào giỏ hàng</v-btn>
          <p v-if="message" class="message">{{ message }}</p>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import apiClient from '@/api/apiClient'
import NavBar from '@/components/NavBar.vue'
import QuantityControl from '@/components/QuantityControl.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const selectedSize = ref('')
const quantity = ref(1)
const message = ref('')

const tempOrder = ref(null)

onMounted(async () => {
  const res = await apiClient.get(`/products/${route.params.id}`)
  product.value = res.data
})

const sizes = computed(() => {
  return product.value?.sizes?.map((s) => ({
    label: s.size,
    available: s.stock > 0,
    stock: s.stock,
  })) || []
})

const maxStock = computed(() => {
  const size = sizes.value.find((s) => s.label === selectedSize.value)
  return size?.stock || 1
})

const selectSize = (size) => {
  selectedSize.value = size
}

const addToBag = async () => {
  if (!selectedSize.value) {
    message.value = 'Vui lòng chọn size trước khi thêm vào giỏ hàng.'
    return
  }
  try {
    await apiClient.post(
      '/cart',
      {
        productId: product.value._id,
        productName: product.value.name,
        productImage: product.value.image,
        price: product.value.price,
        size: selectedSize.value,
        quantity: quantity.value,
      },
      { withCredentials: true }
    )
    await cartStore.fetchCart() // Đồng bộ giỏ hàng mới
    message.value = '✔ Đã thêm vào giỏ hàng!'
    setTimeout(() => (message.value = ''), 3000)
  } catch (error) {
    message.value = '❌ Thêm vào giỏ hàng thất bại.'
  }
}

const buying = async () => {
  if (!selectedSize.value) {
    alert('Vui lòng chọn size')
    return
  }
  try {
    await apiClient.post(
      '/cart',
      {
        productId: product.value._id,
        productName: product.value.name,
        productImage: product.value.image,
        price: product.value.price,
        size: selectedSize.value,
        quantity: quantity.value,
      },
      { withCredentials: true }
    )
    await cartStore.fetchCart()
    tempOrder.value = [{
      productId: product.value._id,
      productName: product.value.name,
      productImage: product.value.image,
      price: product.value.price,
      size: selectedSize.value,
      quantity: quantity.value
    }]
    router.push({ name: 'Checkout', query: { temp: 'true' } })
  } catch (error) {
    alert('Thêm vào giỏ hàng thất bại')
  }
}

const formatPrice = (value) => {
  if (!value) return ''
  return value.toLocaleString('vi-VN')
}
</script>

<style scoped>
/* Giữ nguyên style như file gốc */
.custom-main {
  width: 100vw;
  height: 100vh;
  padding: 20px 40px;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-row {
  width: 100%;
  max-width: none;
  gap: 20px;
  flex-wrap: nowrap;
  min-height: 80vh;
  align-items: center;
  justify-content: center;
}

.col-left,
.col-right {
  flex-basis: 25%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  padding-left: 8px;
  padding-right: 8px;
}

.col-center {
  flex-basis: 40%;
  flex-grow: 0;
  flex-shrink: 0;
}

.product-main-img {
  width: 100%;
  height: auto;
  border-radius: 0;
  background: transparent;
}

.size-selection-wrapper {
  width: 372px;
  margin-left: 0;
  margin-right: 0;
}

.select-size-label span {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  text-align: left;
  font-weight: 700;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;
  margin-bottom: 20px;
}

.stock-info {
  font-size: 14px;
  color: #555;
  user-select: none;
  white-space: nowrap;
  margin-top: 4px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(5, 72px);
  gap: 12px 14px;
  justify-items: start;
  width: 100%;
  margin-bottom: 32px;
}

@media (max-width: 500px) {
  .size-grid {
    grid-template-columns: repeat(4, 72px);
  }
}

@media (max-width: 380px) {
  .size-grid {
    grid-template-columns: repeat(3, 72px);
  }
}

.size-item {
  width: 72px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 600 15px/1 sans-serif;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  background: #fff;
  color: #000;
  user-select: none;
  cursor: pointer;
}

.size-item.active {
  border: 2px solid #000;
}

.size-item.disabled {
  background: #eee;
  border-color: #eee;
  color: #aaa;
  text-decoration: line-through;
  cursor: default;
}

.size-item.disabled:hover {
  background: #eee !important;
  border-color: #eee !important;
  cursor: default !important;
}

.size-item:hover {
  background: #fff;
  border-color: #d1d1d1;
}

.buying-btn,
.add-to-cart-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-size: 17px;
}

.message {
  margin-top: 10px;
  font-weight: 600;
  color: green;
}
</style>
