import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { setupPrimeVue } from './plugins/primevue'
import 'primeicons/primeicons.css'
import './assets/admin.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
setupPrimeVue(app)

app.mount('#app')
