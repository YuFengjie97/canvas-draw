import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import { setupRouter } from '@/router'
import 'virtual:uno.css'

const app = createApp(App)

setupRouter(app)

app.mount('#app')
