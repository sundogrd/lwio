<template>
  <div class='test-page'>
    <re-comment
    targetId="1111"
    :config="config"
    :like="doLike"
    :hate="doHate"
    :switchtab="doSwitchTab"
    :comment="doComment"
    :reply="doReply"
    :login="goLogin"
    :gopage="goPage"
    :gosubpage="goSubPage">
    </re-comment>
    <!-- <re-comment></re-comment> -->
  </div>
</template>

<script>
import ReComment from '@/components/ReComment/smart.vue'
import * as commentService from '@/services/comment'

const transferComment = (list) => {
  return list.map(v => {
    let tmpUser = {
      imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
      id: '354657',
      nick: '佛系玩家'
    }
    return {
      id: v.comment_id.toString(),
      creator: {
        nick: tmpUser ? tmpUser.nick : 'luffylv',
        imgUrl: tmpUser ? tmpUser.imgUrl : '',
        id: v.creator_id.toString()
      },
      targetId: v.target_id,
      content: v.content,
      like: v.like || 0,
      hate: v.hate || 0,
      createTime: +v.created_at,
      extra: v.extra,
      floor: +v.floor
    }
  })
}

const transferSubComments = (list) => {
  return list.map(v => {
    let tmpUser = {
      imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
      id: '354657',
      nick: '佛系玩家'
    }
    return {
      id: v.comment_id.toString(),
      creator: {
        nick: tmpUser ? tmpUser.nick : 'luffylv',
        imgUrl: tmpUser ? tmpUser.imgUrl : '',
        id: v.creator_id.toString()
      },
      commentId: v.parent_id.toString(),
      reCommentCreator: v.re_comment_id ? '有就是这个' : '', // v.re_comment_id ? v.re_comment_id.toString() : '',
      targetId: v.target_id,
      content: v.content,
      like: v.like || 0,
      createTime: +v.created_at
    }
  })
}

async function login () {
  return {
    avatar: 'https://v1-cn.vuejs.org/images/logo.png',
    nick: '我是登录的用户',
    id: '23456778'
  }
}

export default {
  components: {
    ReComment
  },
  data: function () {
    return {
      config: {
        pageSize: 10, // 评论页大小
        replySize: 5, // 回复页大小
        replyLimit: 4, // 默认展示回复数
        lazy: true
      }
    }
  },
  methods: {
    async goPage (data) {
      let ret = await commentService.getMainComments({
        ...data
      })
      let tRet = {
        list: transferComment(ret.list),
        page: ret.page,
        pageSize: ret.page_size,
        total: ret.total
      }
      return tRet
    },
    async goSubPage (data) {
      let ret = await commentService.getSubComments({ ...data })
      let tRet = {
        list: transferSubComments(ret.list),
        total: ret.total
      }
      return tRet
    },
    async goLogin () {
      let ret = await login()
      return ret
    },
    async doLike (data) {
      let ret = await commentService.likeComment({ ...data })
      return ret
    },
    async doHate (data) {
      let ret = await commentService.hateComment({ ...data })
      return ret
    },
    async doComment (data) {
      let ret = await commentService.sendComment({ ...data })
      return ret
    },
    async doReply () {
      let ret = await commentService.sendComment({ ...data })
      return ret
    },
    doSwitchTab () {

    }
  }
}
</script>

<style lang="less" scoped>
.test-page{
  padding: 200px;
}
</style>
