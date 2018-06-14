// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from 'store';

import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
// import IconSvg from 'components/IconSvg';// svg 组件
// import LwCard from 'components/LwCard'
import components from 'components';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
// register globally
// Vue.component('icon-svg', IconSvg)
// Vue.component('lw-card', LwCard)
Object.keys(components).forEach(component => {
  Vue.component(component, components[component])
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});


// register global progress.
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  next()
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

// Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


