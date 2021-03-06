import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './plugins/element.js'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条 样式
import ModuleCard from '@/components/ModuleCard/index.vue'
import IconSvg from '@/components/IconSvg/index.vue'

Vue.config.productionTip = false
Vue.component('module-card', ModuleCard)
Vue.component('icon-svg', IconSvg)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
