import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {TextLoader} from "@/utils/textLoader";


const app = createApp(App)
app.use(router).mount('#app')
app.provide('textObject', new TextLoader());