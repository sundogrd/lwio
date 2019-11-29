import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import hooks from '@u3u/vue-hooks'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueCompositionApi)
Vue.use(hooks)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
