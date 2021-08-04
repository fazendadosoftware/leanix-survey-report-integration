import { createApp } from 'vue'
import VWave from 'v-wave'
import App from '@/App'
import 'tailwindcss/tailwind.css'

const app = createApp(App)
app
  .use(VWave)
  .mount('#app')
