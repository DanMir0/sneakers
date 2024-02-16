<script setup>
import { onMounted, ref, provide, watch, computed } from 'vue'
import axios from 'axios'

import SHeader from '@/components/SHeader.vue'
import SCardList from '@/components/SCardList.vue'
import SDrawer from '@/components/SDrawer.vue'

const items = ref([])
const cart = ref([])
const isCreatingOrder = ref(false)

const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const cartIsEmpty = computed(() => cart.value.length === 0)

const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)
const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const filters = ref({
  sortBy: 'title',
  searchQuery: ''
})

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await axios.post('https://0fe3da7abad9a25c.mokky.dev/orders', {
      items: cart.value,
      totalPrice: totalPrice.value
    })

    cart.value = []

    return data
  } catch (e) {
    console.log(e)
  } finally {
    isCreatingOrder.value = false
  }
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const addToCart = (item) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item) => {
  cart.value.splice(cart.value.indexOf(item), 1)
  item.isAdded = false
}

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
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  await fetchItems()
  await fetchFavorites()

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(filters.value, fetchItems)

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false
  }))
})

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart
})
</script>

<template>
  <SDrawer
    v-if="drawerOpen"
    @create-order="createOrder"
    :total-price="totalPrice"
    :vat-price="vatPrice"
    :button-disabled="cartButtonDisabled"
  />

  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-10">
    <SHeader :total-price="totalPrice" @open-drawer="openDrawer" />

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
        <SCardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
