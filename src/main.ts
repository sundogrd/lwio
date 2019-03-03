import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/element.js'
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import * as authService from './services/auth';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

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
    if (neededLoginList.indexOf(to.name || '') === -1) {
      next()
      SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION
    }
    if (isLogined) {
      next()
      return
    } else {
      next("/api/oauth2/github/login")
      return
    }
  })
})

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  next()
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
