import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/element.js'
import * as authService from './services/auth';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

// permission judge function
function hasLogined(): Promise<boolean> {
  return authService.getI().then((res) => {
    if(!res.name) {
      return false
    }
    return true
  })
}

const neededLoginList = ['articlePublishPage']// need redirect list

router.beforeEach((to, from, next) => {
  hasLogined().then(isLogined => {
    if (neededLoginList.indexOf(to.name || '') !== -1) {
      next()
    }
    if (isLogined) {
      next()
    } else {
      next("/api/oauth2/github/login")
    }
  })
})
