import Vue from 'vue';
import Router from 'vue-router';

const Layout = resolve => require.ensure([], () => resolve(require('../views/layout/Layout')), 'Layout')
const Index = resolve => require.ensure([], () => resolve(require('../views/index/index')), 'Index')
const Login = resolve => require.ensure([], () => resolve(require('../views/login/index')), 'Login')
const Article = resolve => require.ensure([], () => resolve(require('../views/article/article')), 'Article')
const Publish = resolve => require.ensure([], () => resolve(require('../views/article/publish')), 'Publish')
/* error page */
const Err404 = resolve => require.ensure([], () => resolve(require('../views/error/404')), 'Err404')
const Err401 = resolve => require.ensure([], () => resolve(require('../views/error/401')), 'Err401')


Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
  /* { path: '/authredirect', component: authRedirect, hidden: true },*/
  { path: '/404', component: Err404, hidden: true },
  { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'index',
    hidden: true,
    children: [{
      path: 'index',
      component: Index
    }]
  },
  {
    path: '/article',
    component: Layout,
    name: 'article',
    children: [{
      path: 'publish',
      component: Publish
    }, {
      path: ':articleId',
      component: Article
    }]
  },
  {
    path: '/login',
    component: Layout,
    children: [{ path: '', name: 'login', component: Login }]
  }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});