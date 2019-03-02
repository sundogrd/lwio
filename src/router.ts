import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from './views/public/index-page/index.vue'
import ArticleDetailPage from './views/content/article/article-detail-page/index.vue'
import ArticlePublishPage from './views/content/article/article-publish-page/index.vue'
import UserSpacePage from './views/user/user-space-page/index.vue'
import UserSpaceArticle from './views/user/user-space-article/index.vue'
import UserSpaceAudio from './views/user/user-space-audio/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage
    },
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
    },
    {
      path: '/users/:userId',
      name: 'userSpacePage',
      component: UserSpacePage,
      redirect: { name: 'userSpaceArticle' },
      children: [{
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'article',
        name: 'userSpaceArticle',
        component: UserSpaceArticle,
      }, {
        path: 'audio',
        name: 'userSpaceAudio',
        component: UserSpaceAudio,
      }]
    }
  ]
})
