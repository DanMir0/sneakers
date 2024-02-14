<script setup>
import SCard from './SCard.vue'

const onClickAdd = () => {
  alert('Добавить')
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <SCard :onClickAdd="onClickAdd" />
  </div>
</template>

<style scoped></style>
