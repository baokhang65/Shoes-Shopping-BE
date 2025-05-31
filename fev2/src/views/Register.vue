<template>
  <div class="login-overlay">
    <div class="login-box">
      <!-- LEFT FORM SECTION -->
      <div class="form-section">
        <div class="brand">J97 Store</div>
        <h1>Create Account</h1>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <input v-model="displayName" type="text" required placeholder="Your name" />
          </div>
          <div class="form-group">
            <input v-model="email" type="email" required placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <input v-model="password" type="password" required placeholder="**********" />
          </div>

          <button type="submit" :disabled="loading">Sign Up</button>

          <p class="error-msg" v-if="error">{{ error }}</p>

          <p class="signup">Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </form>
      </div>

      <div class="illustration-section">
        <img src="@/assets/register-illustration.jpeg" alt="Register illustration" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/apiClient'
import { userStore } from '@/stores/userStore'

const router = useRouter()
const displayName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''
  loading.value = true
  try {
    await apiClient.post('/users/register', {
      displayName: displayName.value,
      email: email.value,
      password: password.value
    }, { withCredentials: true })

    await userStore.fetchProfile()
    router.push('/')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Giữ nguyên toàn bộ phần style từ Login.vue */
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.login-box {
  display: flex;
  width: 900px;
  height: 690px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.form-section {
  flex: 1;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
}

.illustration-section {
  flex: 1;
  background: linear-gradient(135deg, #a18cd1, #fbc2eb);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.illustration-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.brand {
  font-weight: 600;
  font-size: 18px;
  color: #555;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #111;
}

.form-group {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: #111;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #000;
}

.signup {
  margin-top: 24px;
  font-size: 14px;
  color: #333;
}

.signup a {
  color: #111;
  font-weight: bold;
  text-decoration: none;
}

.error-msg {
  color: red;
  text-align: center;
  margin-top: 12px;
}
</style>
