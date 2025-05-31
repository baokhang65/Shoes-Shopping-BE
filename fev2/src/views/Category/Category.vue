<template>
  <v-app>
    <NavBar />

    <v-main>
      <v-container fluid class="px-0">
        <v-row class="align-center px-4">
          <v-col cols="6" class="px-0">
            <h2 class="brand-heading">
              {{ props.brandName || 'All Brands' }}
              <span class="text-grey text-body-2">({{ sortedProducts.length }})</span>
            </h2>
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center px-0">
            <v-select v-model="sort" :items="sortOptions" density="compact" variant="outlined" hide-details
              label="Sort By" style="max-width:160px" />
          </v-col>
        </v-row>

        <v-row dense class="px-4">
          <v-col v-for="p in sortedProducts" :key="p._id" cols="6" sm="3" md="3"
            class="d-flex flex-column align-start px-3">
            <router-link :to="`/${p.brand.toLowerCase()}/${p._id}`"
              style="text-decoration: none; color: inherit; width: 100%;">
              <v-img :src="p.image" height="280" width="100%" contain class="mb-3" />
              <div class="product-name mb-1">{{ p.name }}</div>
            </router-link>

            <div class="product-price">
              {{ p.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}
            </div>
          </v-col>
        </v-row>
      </v-container>
      <Footer />
    </v-main>
    <ScrollToTopButton />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProductsByBrand } from '@/api/productService'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'

const props = defineProps({
  brandName: String
})

const products = ref([])
const loading = ref(false)
const error = ref(null)
const sort = ref('Price: High-Low')
const sortOptions = ['Price: High-Low', 'Price: Low-High']

async function loadProducts() {
  loading.value = true
  try {
    const res = await getProductsByBrand(props.brandName)
    products.value = res.data.products || res.data
  } catch (e) {
    error.value = e.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

const sortedProducts = computed(() => {
  const list = [...products.value]
  const asc = sort.value.includes('Low-High')
  list.sort((a, b) => (asc ? a.price - b.price : b.price - a.price))
  return list
})

onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.brand-heading {
  font-size: 26px;
  font-weight: 700;
}

.product-name {
  font-weight: 700;
}

.product-price {
  font-weight: 700;
  font-size: 1.1rem;
}

.main-bg {
  background-image: url('/image/image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}
</style>
