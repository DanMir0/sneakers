<script setup>
import SCardList from '@/components/SCardList.vue'
import axios from 'axios'
import { inject, onMounted, ref, watch } from 'vue'
import debounce from 'lodash.debounce'

const items = ref([])
const { addToCart, removeFromCart, cart } = inject('cart')

const filters = ref({
  sortBy: 'title',
  searchQuery: ''
})
const onChangeSelect = (event) => {
  filters.value.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.value.searchQuery = event.target.value
}, 300)

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        item_id: item.id
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

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
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
const fetchFavorites = async () => {
  const { data: favorites } = await axios.get('https://0fe3da7abad9a25c.mokky.dev/favorites')

  items.value = items.value.map((item) => {
    const favorite = favorites.find((favorite) => favorite.item_id === item.id)
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

onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

watch(filters.value, fetchItems)
</script>

<template>
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
    <SCardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
  </div>
</template>

<style scoped></style>
