<template>
  <div class="quantity-control">
    <button @click="decrease" :disabled="modelValue <= min">-</button>
    <span class="quantity-number">{{ modelValue }}</span>
    <button @click="increase" :disabled="modelValue >= max">+</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Number,
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 }
})
const emit = defineEmits(['update:modelValue'])

function decrease() {
  if (props.modelValue > props.min)
    emit('update:modelValue', props.modelValue - 1)
}
function increase() {
  if (props.modelValue < props.max)
    emit('update:modelValue', props.modelValue + 1)
}
</script>

<style scoped>
.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}

.quantity-control button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-number {
  width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
}
</style>
