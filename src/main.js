import { createApp } from 'vue'
import VWave from 'v-wave'
import router from '@/router'
import App from '@/App'
import 'tailwindcss/tailwind.css'

const app = createApp(App)
app
  .use(router)
  .use(VWave)
  .mount('#app')
