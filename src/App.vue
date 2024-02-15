<script setup>
import { onMounted, ref, provide, watch } from 'vue'
import axios from 'axios'

import SHeader from '@/components/SHeader.vue'
import SCardList from '@/components/SCardList.vue'
import SDrawer from '@/components/SDrawer.vue'

const items = ref([])

const filters = ref({
  sortBy: 'title',
  searchQuery: ''
})

const onChangeSelect = (event) => {
  filters.value.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.value.searchQuery = event.target.value
}

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id
      }

      item.isFavorite = true

      const { data } = await axios.post('https://0fe3da7abad9a25c.mokky.dev/favorites', obj)

      item.favoriteId = data.id
    } else {
      item.isFavorite = false

      await axios.delete(`https://0fe3da7abad9a25c.mokky.dev/favorites/${item.favoriteId}`)

      item.favoriteId = null
    }
  } catch (e) {
    console.log(e)
  }
}

const fetchFavorites = async () => {
  const { data: favorites } = await axios.get('https://0fe3da7abad9a25c.mokky.dev/favorites')

  items.value = items.value.map((item) => {
    const favorite = favorites.find((favorite) => favorite.parentId === item.id)
    if (!favorite) {
      return item
    }

    return {
      ...item,
      isFavorite: true,
      favoriteId: favorite.id
    }
  })
  console.log(items)
}

const fetchItems = async () => {
  const params = {
    sortBy: filters.value.sortBy
  }

  if (filters.value.searchQuery) {
    params.title = `*${filters.value.searchQuery}*`
  }

  const { data } = await axios.get('https://0fe3da7abad9a25c.mokky.dev/items', {
    params
  })

  items.value = data.map((obj) => ({
    ...obj,
    isFavorite: false,
    favoriteId: null,
    isAdded: false
  }))
}

onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
})

watch(filters.value, fetchItems)

provide('addToFavorite', addToFavorite)
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-10">
    <SHeader />

    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
        <div class="flex gap-4">
          <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
            <option value="name">По названию</option>
            <option value="price">По цене (дешевые)</option>
            <option value="-price">По цене (дорогие)</option>
          </select>
          <div class="relative">
            <img src="/search.svg" alt="Поиск" class="absolute left-4 top-4" />
            <input
              @input="onChangeSearchInput"
              class="border rounded-md py-2 pl-11 pr4 outline-none focus:border-gray-400"
              placeholder="Поиск..."
            />
          </div>
        </div>
      </div>

      <div class="mt-10">
        <SCardList :items="items" @addToFavorite="addToFavorite" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
