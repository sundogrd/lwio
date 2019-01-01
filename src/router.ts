import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import ArticleDetailPage from './views/content/article/article-detail-page/index.vue'
import ArticlePublishPage from './views/content/article/article-publish-page/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/articles/publish',
      name: 'articlePublishPage',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ArticlePublishPage
    },
    {
      path: '/articles/:articleId',
      name: 'articleDetailPage',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ArticleDetailPage
    }
  ]
})
