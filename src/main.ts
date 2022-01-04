import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {TextLoader} from "@/utils/textLoader";

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        textObject: TextLoader
    }
}

const app = createApp(App)
app.config.globalProperties.textObject = new TextLoader()
app.use(router).mount('#app')