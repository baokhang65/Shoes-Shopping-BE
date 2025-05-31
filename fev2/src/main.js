/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import 'vuetify/styles'
import vuetify from './plugins/vuetify'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia' 
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
registerPlugins(app)

app.mount('#app')
