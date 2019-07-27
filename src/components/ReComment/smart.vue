<template>
  <dumb-comment
    :targetId="targetId"
    :comments="comments"
    :user="user"
    :config="config"
    @login="login"
    @like="like"
    @hate="hate"
    @comment="comment"
    @reply="reply"
    @gopage="gopage"
    @gosubpage="gosubpage">
  </dumb-comment>
</template>
<script>
import DumbComment from './index.vue'

export default {
  data () {
    return {
      comments: {},
      user: null
    }
  },
  props: {
    targetId: {
      type: [String, Number],
      required: true
    },
    config: {
      type: Object,
      required: false
    }
  },
  components: { DumbComment },
  methods: {
    getCommentById (comments, id, deep = false) {
      let comment = null
      for (let com of comments) {
        if (com.id === id) {
          comment = com
          break
        }
        if (deep) {
          continue
        }
        for (let sub of com.subComments.list) {
          if (sub.id === id) {
            comment = sub
            break
          }
        }
      }
      return comment
    },
    async gopage (data) {
      this.comments = await this.$attrs.gopage(data)
      // 获取子评论
      await Promise.all(this.comments.list.map(async (com) => {
        let { id, targetId } = com
        await this.gosubpage({ commentId: id, targetId, page: 1, pageSize: this.config.replySize || 1 })
      }))
    },
    async gosubpage (data) {
      const { commentId, pageSize, targetId, page } = data
      // console.log('recive gosubpage request: ', data)
      let idx = this.comments.list.findIndex(com => {
        return com.id === commentId
      })

      let ret = await this.$attrs.gosubpage(data)
      // this.comments.list[idx].subComments = ret // 不能这样，这样没有变化
      let reactiveObj = { ...this.comments.list[idx], subComments: ret }
      this.comments.list.splice(idx, 1, reactiveObj)
    },
    async comment (data) {
      let ret = await this.$attrs.comment(data)
      if (ret) {
        await this.gopage(data)
      }
    },
    async reply (data) {
      let ret = await this.$attrs.comment(data)
      let { resolve, reject } = data
      if (ret) {
        // 成功
        resolve(ret)
        await this.gosubpage(data)
      } else {
        reject(ret)
      }
    },
    async like (data) {
      console.log(data)
      let ret = await this.$attrs.like(data)
      if (ret) {
        let commentId = ret.comment_id
        let comments = this.comments.list
        let com = this.getCommentById(comments, commentId, true)
        com.like++
      }
    },
    async hate (data) {
      console.log(data)
      let ret = await this.$attrs.hate(data)
      if (ret) {
        let commentId = ret.comment_id
        let comments = this.comments.list
        let com = this.getCommentById(comments, commentId)
        com.hate++
      }
    },
    async login () {
      console.log('login now')
      let ret = await this.$attrs.login()
      this.user = ret
    }
  }
}
</script>
