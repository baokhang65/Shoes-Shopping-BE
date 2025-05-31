<template>
  <transition name="fade">
    <div v-if="showButton" class="scroll-to-top" role="button" aria-label="Scroll to top" @click="scrollToTop"
      tabindex="0" @keydown.enter="scrollToTop">
      <v-icon size="24">mdi-chevron-up</v-icon>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const checkScroll = () => {
  showButton.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border: 1px solid #999;
  /* viền mỏng màu xám */
  border-radius: 4px;
  /* bo góc nhẹ */
  background-color: rgba(255 255 255 / 0);
  /* trong suốt */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  user-select: none;
  z-index: 1000;
}

.scroll-to-top:hover,
.scroll-to-top:focus {
  background-color: rgba(255 255 255 / 0.1);
  border-color: #666;
  outline: none;
}

/* Hiệu ứng fade mượt */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
