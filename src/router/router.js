import SHome from '@/pages/SHome.vue'
import SFavorites from '@/pages/SFavorites.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: SHome },
  { path: '/favorites', name: 'Favorites', component: SFavorites }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
