import Vue from 'vue'
// import { filterArr } from '../utils'

const initState = {
  user: null,
  targetId: '',
  config: {
    pageSize: 10,
    replySize: 5,
    replyLimit: 3
  },
  comments: {
    list: [],
    total: 0, // 评论总数
    pageSize: 10,
    page: 1
  }
}

const store = Vue.observable(initState)

const mutations = {
  setUser (user) {
    store.user = { ...store.user, ...user }
  },
  initStore (targetId, config = {}) {
    store.targetId = targetId
    store.config = { ...store.config, ...config }
  },
  initConfig (config) {
    store.config = { ...store.config, ...config }
  },
  // 获取主评论
  refreshComments (comments) {
    store.comments = comments
  }
  // refreshSubComments (id, comments) {
  //   let comment = filterArr(store.comments.list, 'id', id)
  //   comment.subComments = comments
  // },
  // addComment (comment) {
  //   store.comments.list = [...store.comments.list, comment]
  //   store.comments.total = store.comments.list.length
  // },
  // addReply () {

  // }
  // async () {
  //   setTimeout(() => {
  //     store.test = 'async test'
  //   }, 2000)
  // }
}

export { store, mutations }
