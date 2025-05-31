<template>
  <!-- NAVBAR -->
  <v-app-bar flat height="64" class="elevation-0">
    <v-container fluid class="d-flex align-center justify-space-between px-4">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo text-decoration-none">J97Store</router-link>

      <!-- Center Menu -->
      <nav class="navbar-menu d-none d-md-flex align-center">
        <router-link to="/adidas" class="navbar-link">ADIDAS</router-link>
        <router-link to="/nike" class="navbar-link">NIKE</router-link>
        <router-link to="/vans" class="navbar-link">VANS</router-link>
      </nav>

      <!-- Right Section -->
      <div class="navbar-icons d-flex align-center">
        <!-- Nike-like Search -->
        <div class="search-input-container d-flex align-center mr-2" :class="{ focused: searchFocus }">
          <v-btn icon variant="text" size="x-small" aria-label="Search" class="search-start-btn" @click="performSearch">
            <v-icon size="20">mdi-magnify</v-icon>
          </v-btn>
          <input type="search" class="search-input" placeholder="Search" v-model="searchQuery"
            @focus="searchFocus = true" @blur="onBlur" @keyup.enter="performSearch" />
          <v-btn icon variant="text" size="x-small" aria-label="Reset Search" class="search-end-btn" v-if="searchQuery"
            @click="clearSearch">
            <v-icon size="20">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- Account icon or Login button -->
        <template v-if="!userStore.isAuthenticated">
          <router-link to="/login" class="rounded-login-button">
            Login
          </router-link>
        </template>

        <template v-else>
          <v-menu offset-y right transition="slide-y-transition" origin="top">
            <template #activator="{ props }">
              <v-btn icon variant="text" v-bind="props" aria-label="Account">
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item link>
                <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                <v-list-item-title>{{ userStore.user.displayName }}</v-list-item-title>
              </v-list-item>

              <v-list-item link>
                <v-list-item-icon><v-icon>mdi-account-box</v-icon></v-list-item-icon>
                <v-list-item-title>Change Password</v-list-item-title>
              </v-list-item>

              <v-list-item link to="/order">
                <v-list-item-icon><v-icon>mdi-list-box</v-icon></v-list-item-icon>
                <v-list-item-title>View Orders</v-list-item-title>
              </v-list-item>

              <v-list-item link @click="logout">
                <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Cart icon with badge -->
        <router-link to="/cart" class="text-decoration-none">
          <v-btn icon variant="text" aria-label="Cart" class="position-relative">
            <v-badge :content="cartStore.count" color="#111" overlap floating class="custom-badge">
              <v-icon>mdi-cart-outline</v-icon>
            </v-badge>
          </v-btn>
        </router-link>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { userStore } from '@/stores/userStore'

const cartStore = useCartStore()
const searchQuery = ref('')
const searchFocus = ref(false)

onMounted(() => {
  userStore.fetchProfile()
})

function performSearch() {
  if (!searchQuery.value) return
  console.log('Search:', searchQuery.value)
}
function clearSearch() {
  searchQuery.value = ''
}
function onBlur() {
  setTimeout(() => {
    if (!document.activeElement.classList.contains('search-input')) {
      searchFocus.value = false
    }
  }, 100)
}

function logout() {
  userStore.logout()
}
</script>

<style scoped>
.v-app-bar {
  background: #fff;
}

.navbar-logo {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #111;
}

.navbar-menu {
  gap: 40px;
}

.navbar-link {
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #111;
  text-decoration: none;
  position: relative;
  transition: color .3s;
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #111;
  transition: width .3s;
}

.navbar-link:hover::after {
  width: 100%;
}

.navbar-link:hover {
  color: #000;
}

.navbar-icons .v-btn {
  margin-left: 12px;
}

.navbar-icons .v-icon {
  color: #111;
}

.search-input-container {
  background: #f5f5f5;
  border-radius: 999px;
  padding: 4px 8px;
  transition: background .2s;
}

.search-input-container.focused {
  background: #e9e9e9;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 4px 6px;
  font-size: 14px;
  width: 120px;
  color: #111;
}

.search-input::placeholder {
  color: #8d8d8d;
}

.search-start-btn,
.search-end-btn {
  --v-btn-size: 24px;
  --v-icon-size: 20px;
  padding: 0;
  min-width: 24px !important;
}

.search-start-btn .v-btn__overlay,
.search-end-btn .v-btn__overlay {
  background: transparent !important;
}

.text-decoration-none {
  text-decoration: none;
}

.position-relative {
  position: relative;
}

.v-list-item {
  display: flex;
  align-items: center;
}

.v-list-item-icon {
  margin-right: 12px;
  min-width: 24px;
  display: flex;
  align-items: center;
}

.v-list-item-content {
  display: flex;
  align-items: center;
}

.v-list-item-title {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  padding-left: 16px;
  height: 100%;
}

.rounded-login-button {
  padding: 4px 16px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #111;
  background-color: transparent;
  margin-left: 20px;
  color: #111;
  border-radius: 999px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.rounded-login-button:hover {
  background-color: #f0f0f0;
}
</style>
