import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);

// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from 'views/layout/Layout';
import Index from 'views/index';
/* login */
import Login from 'views/login'

const Blog = _import('blog/blog');
const Publish = _import('blog/publish');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
  /*{ path: '/authredirect', component: authRedirect, hidden: true },*/
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
    path: '/blog',
    component: Layout,
    name: 'blog',
    children: [{
        path: 'publish',
        component: Publish
      },{
        path: ':blogid',
        component: Blog
      }] 
  },
  { 
    path: '/login',
    component: Layout,
    children: [{ path: '', name: 'login', component: Login }]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});