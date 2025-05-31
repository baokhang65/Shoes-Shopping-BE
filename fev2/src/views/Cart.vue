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
          <v-row class="align-center mb-6">
            <v-col cols="12" md="6" class="d-flex align-center">
              <h2 class="text-h6 font-weight-bold mr-4">Your Bag </h2>
              <span class="text-body-2 text-grey-darken-1">({{ cartStore.items.length }} items)</span>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end">
              <v-btn color="primary" size="small" @click="continueShopping" prepend-icon="mdi-plus">
                Add more items
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mb-6" />
          <div v-for="(item, index) in cartStore.items" :key="item._id" class="d-flex align-start mb-8">
            <v-avatar size="72" class="mr-4" rounded="lg">
              <v-img :src="item.productImage" />
            </v-avatar>
            <div class="flex-grow-1 pr-4">
              <div class="font-weight-medium mb-1 text-body-1">{{ item.productName }}</div>
              <div class="text-body-2 text-grey-darken-1 mb-2">Size: {{ item.size }}</div>
              <QuantityControl v-model="cartStore.items[index].quantity" :min="1" :max="item.stock" />
            </div>
            <div class="text-right" style="min-width: 110px">
              <div class="font-weight-medium mb-1">{{ formatPrice(item.price) }}₫</div>
              <v-btn icon="mdi-close" size="x-small" variant="text" color="grey-darken-1" @click="removeItem(item)" />
            </div>
          </div>

          <v-divider class="my-6" />
          <v-row>
            <v-col cols="12" md="6" class="mb-4 mb-md-0">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Need help?</h3>
              <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-help-circle-outline">Order Issues</v-list-item>
                <v-list-item prepend-icon="mdi-truck-outline">Delivery Info</v-list-item>
                <v-list-item prepend-icon="mdi-archive-refresh-outline">Returns</v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">Summary</h3>
              <div class="d-flex justify-space-between mb-2">
                <span>Subtotal</span>
                <span>{{ formatPrice(subtotal) }}₫</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between font-weight-bold text-body-1 mb-4">
                <span>Total</span>
                <span>{{ formatPrice(subtotal) }}₫</span>
              </div>
              <v-btn class="checkout-btn" color="black" @click="goToCheckout">Checkout</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import QuantityControl from '@/components/QuantityControl.vue'

const cartStore = useCartStore()
const router = useRouter()

onMounted(() => {
  cartStore.fetchCart()
})

const subtotal = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const removeItem = (item) => {
  cartStore.remove(item.productId, item.size)
}

const goToCheckout = () => {
  router.push('/checkout')
}

const continueShopping = () => {
  router.push('/')
}

const breadcrumbs = [
  { title: 'Home', disabled: false, to: '/' },
  { title: 'Cart', disabled: true }
]

const formatPrice = (price) => {
  if (!price) return ''
  return price.toLocaleString('vi-VN')
}
</script>

<style scoped>
.checkout-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  font-size: 17px;
}
</style>
