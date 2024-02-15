<script setup>
import SCard from './SCard.vue'

defineProps({
  items: Array
})

const emit = defineEmits(['addToFavorite'])
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <SCard
      v-for="item in items"
      :id="item.id"
      :key="item.id"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :isFavorite="item.isFavorite"
      :onClickFavorite="() => emit('addToFavorite', item)"
    />
  </div>
</template>

<style scoped></style>
