<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import SCardList from '@/components/SCardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://0fe3da7abad9a25c.mokky.dev/favorites?_relations=items'
    )
    favorites.value = data.map((obj) => obj.item)
  } catch (e) {}
})
</script>

<template>
  <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
  <SCardList :items="favorites" is-favorites />
</template>

<style scoped></style>
