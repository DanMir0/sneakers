import './assets/main.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router.js'

const app = createApp(App)

app.use(router).use(autoAnimatePlugin).mount('#app')
