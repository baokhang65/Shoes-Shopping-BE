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
            <v-col cols="12" md="12">
              <h2 class="text-subtitle-1 font-weight-bold mb-4">Your Orders</h2>
              <div v-if="orders.length === 0">You have no orders.</div>
              <div v-else>
                <v-list>
                  <v-list-item v-for="order in orders" :key="order._id" class="order-item">
                    <v-list-item-content>
                      <v-list-item-title>Order #{{ order._id }}</v-list-item-title>
                      <v-list-item-subtitle>Status: {{ order.status }}</v-list-item-subtitle>
                      <v-list-item-subtitle>
                        Total: {{ formatPrice(calculateTotal(order.items)) }}₫
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon @click="viewOrder(order._id)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/apiClient'
import NavBar from '@/components/NavBar.vue'

const orders = ref([])
const router = useRouter()

const breadcrumbs = [
  { title: 'Home', to: '/' },
  { title: 'Orders', disabled: true }
]

onMounted(async () => {
  try {
    const res = await apiClient.get('/orders', { withCredentials: true })
    orders.value = res.data
  } catch (err) {
    console.error('Failed to load orders:', err)
  }
})

const calculateTotal = (items) => {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

const viewOrder = (orderId) => {
  router.push(`/order/${orderId}`)
}

const formatPrice = (price) => {
  if (!price) return ''
  return price.toLocaleString('vi-VN')
}
</script>

<style scoped>
.order-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
</style>
