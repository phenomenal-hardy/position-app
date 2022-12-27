import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Vuetify from 'vuetify'
import Router from 'vue-router';
import 'vuetify/dist/vuetify.min.css'


import App from './App.vue'
import router from './router' // <!-- export default new Router -->
import './assets/main.css'


Vue.use(PiniaVuePlugin)
const pinia = createPinia() // debe estar abajo de use PiniaVuePlugin

pinia.use(piniaPluginPersistedstate)

Vue.use(Vuetify)
Vue.use(Router);

new Vue({  
  router,
  vuetify: new Vuetify({
    theme: { dark: true }
  }),
  pinia: pinia,
  render: (h) => h(App)
}).$mount('#app')
