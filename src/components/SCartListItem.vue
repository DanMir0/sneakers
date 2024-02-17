<script setup>
import { inject } from 'vue'
import SCartItem from '@/components/SCartItem.vue'

const { cart, removeFromCart } = inject('cart')
</script>

<template>
  <div class="flex flex-col gap-4" v-auto-animate>
    <SCartItem
      v-for="item in cart"
      :key="item.id"
      :title="item.title"
      :price="item.price"
      :image-url="item.imageUrl"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>

<style scoped></style>
