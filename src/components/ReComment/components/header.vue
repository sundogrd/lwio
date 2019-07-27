<template>
  <div class="comment-header">
    <div class="comment-header--title"><span>{{total}}</span>评论</div>
    <div class="comment-header--bar">
      <div class="bar-tabs">
        <ul>
          <li>全部评论</li>
          <li class="active">按时间排序</li>
          <li>按热度排序</li>
        </ul>
      </div>
      <div class="bar-pagenation">
        <span class="result">共{{Math.ceil(total / pageSize)}}页</span>
        <span class="prev" :style="{display: page !== 1 ? 'inline-block' : 'none'}" @click="goPage(page - 1)">上一页</span>
        <span class="page" v-for="idx in Math.ceil(total / pageSize)" :class="{current: page === +idx}" :key="idx" @click="goPage(+idx)">{{idx}}</span>
        <span class="next" :style="{display: page !== Math.ceil(total / pageSize) ? 'inline-block' : 'none'}" @click="goPage(page + 1)">下一页</span>
      </div>
    </div>
    <comment-sender @send="send"></comment-sender>
  </div>
</template>

<script>
// import CommentSender from './sender.vue'
import { LEVEL_TARGET } from '../constant'
import EventBus from '../eventbus'
import mixins from '../mixins'
import CommentSender from './sender'
export default {
  name: 'CommentHeader',
  mixins: [mixins],
  components: { CommentSender },
  computed: {
    total () {
      return this.store.comments.total || 0
    },
    pageSize () {
      return this.store.config.pageSize || 1
    },
    page () {
      return this.store.comments.page || 1
    }
  },
  methods: {
    goPage (page) {
      EventBus.$emit('gopage', {
        page: page || 1,
        pageSize: this.pageSize,
        targetId: this.store.targetId
      })
    },
    send (content) {
      EventBus.$emit('comment', {
        content,
        targetId: this.store.targetId,
        page: this.store.comments.page,
        pageSize: this.pageSize
      })
    }
  }

  // public async handleSend (data: any) {
  //   // let res = await sendComment(this.sendLink, {
  //   //   targetId: this.contentId,
  //   //   creatorId: data.creatorId,
  //   //   content: data.content
  //   // })
  //   // console.log('发送文章评论结果', res)
  //   // this.$emit('send')
  // }

  // public async handleLogin () {
  //   console.log('login action here')
  //   this.$parent.$data.isLogin = true
  // }

  // public async goPage (page: number) {
  //   console.log('you will go to page ', page)
  //   this.$emit('goto', page)
  // }
}
</script>
<style lang="less" scoped>
.comment-header{

  &--title{
    padding-top: 18px;
    font-size: 18px;
    line-height: 20px;
    // height: 20px;
    color: #222;
    margin-bottom: 10px;
    span{
      margin-right: 10px;
    }
  }

  &--bar{
    margin: 0 0 24px;
    border-bottom: 1px solid #e5e9ef;
    overflow: hidden;
    .bar-tabs{
      float: left;
      margin-bottom: -1px;
      ul::after{
        content: "";
        display: block;
        visibility: hidden;
        height: 0;
        clear: both;
        font-size: 0;
      }
      li{
        list-style: none;
        background-color: transparent;
        border-radius: 0;
        border: 0;
        padding: 8px 0;
        margin-right: 16px;
        border-bottom: 1px solid transparent;
        position: relative;
        float: left;
        cursor: pointer;
        line-height: 20px;
        font-size: 14px;
        font-weight: 700;
        color: #222;
      }

      .active{
        border-bottom: 1px solid #00a1d6;
        color: #00a1d6;
        &::after{
          content: "";
          width: 6px;
          height: 3px;
          // background: transparent url(../../dist/images/icons-comment.png) -669px -31px no-repeat;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -3px;
          visibility: visible;
        }
      }
    }

    .bar-pagenation{
      float: right;
      font-size: 12px;
      line-height: 36px;
      .result{
        padding-right: 10px;
      }
      .prev,
      .next,
      .page{
        color: #222;
        cursor: pointer;
        text-align: center;
        margin: 0 4px;
        text-decoration: none;
        line-height: 26px;
      }
      .current{
        color: #00a1d6;
        font-weight: 700;
      }
    }
  }
}
</style>
