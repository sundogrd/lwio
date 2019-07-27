<template>
  <div class='sundog-comment' ref="comment" v-if="comment" :data-comment-id="comment.id">
    <div class='sundog-comment--cover' :style="{ backgroundImage: `url(${comment.creator.imgUrl})`}" />
    <div class='sundog-comment--card' v-sender="{show: showSender, sendCallback: sendCb}">
      <p class='sundog-comment--creator'>{{comment.creator.nick}}</p>
      <div class='sundog-comment--content'>{{comment.content}}</div>
      <!--一些额外的信息， 赞 踩 时间-->
      <div class="sundog-comment--extra">
          <span class="floor">#{{comment.floor}}</span>
          <span class="platform" v-if="comment.extra && comment.extra.platform">{{comment.extra.platform}}</span>
          <span class="time">{{comment.createTime | formatTime}}</span>
          <span class="like" @click="like(comment.id)"><icon-svg iconClass="thumbup"></icon-svg><span>{{comment.like}}</span></span>
          <span class="hate" @click="hate(comment.id)"><icon-svg iconClass="cai"/><span>{{comment.hate}}</span></span>
          <span class="reply btn-hover" @click="handleReply(comment.id)">回复</span>
          <comment-operation></comment-operation>
      </div>
      <!--子评论部分-->
      <div class="sundog-comment--subcomments" v-if="comment.subComments && comment.subComments.list && comment.subComments.list.length" >
          <div class="subcomment-item" :data-sub-comment-id="subComment.id" v-for="(subComment, index) in listData" :key="index">
              <a href=""><img :src="subComment.creator && subComment.creator.imgUrl" alt="image"></a>
              <div class="subcomment-item--wrapper">
                  <span class="subcomment-item--name">{{subComment.creator && subComment.creator.nick}}</span>
                  <span class="subcomment-item--reply" v-show="subComment.reCommentCreator">回复 <i>{{`@${subComment.reCommentCreator}`}}</i></span>
                  <span class="subcomment-item--content">{{subComment.content}}</span>
              </div>
              <div class="subcomment-item--info">
                    <span class="time">{{subComment.createTime | formatTime}}</span>
                    <span class="like" @click="like(subComment.id.toString())"><icon-svg iconClass="thumbup"></icon-svg><span>{{subComment.like}}</span></span>
                    <span class="reply btn-hover" @click="handleReply(comment.id, subComment.id)">回复</span>
                    <comment-operation></comment-operation>
              </div>
          </div>
          <div class="subcomment-item--more" v-show="showMore">
            共<b>{{comment.subComments.total}}</b>条回复， <a href="javascript:;;" @click="viewMore" class="btn-more">点击查看</a>
          </div>
      </div>
      <!--子评论分页-->
      <div class="sundog-comment--pagenation" v-show="!isFirst && pageCount > 1">
          <span class="result">共{{pageCount}}页</span>
          <span class="prev" :style="{display: currentPage !== 1 ? 'inline-block' : 'none'}" @click="goPage(currentPage -1 )">上一页</span>
          <a class="page-number" :class="{cur: currentPage === +idx}" v-for="idx in pageCount" :key="idx" @click="goPage(+idx)">{{idx}}</a>
          <span class="next" :style="{display: currentPage !== pageCount ? 'inline-block' : 'none'}" @click="goPage(currentPage + 1 >= pageCount ? pageCount : currentPage + 1 )">下一页</span>
      </div>
    </div>
  </div>
</template>

<script>
/** *
 *** 单个评论快
***/
import { formatTime } from '@/utils/index.js'
import IconSvg from '@/components/IconSvg/index.vue'
import commentOperation from './operation.vue'
import EventBus from '../eventbus'
import { LEVEL_TARGET, LEVEL_COMMENT, LEVEL_REPLY } from '../constant'
import mixins from '../mixins'
import sender from '../directive/sender'
import { uniqueId } from '../utils'

export default {
  name: 'CommentItem',
  filters: {
    formatTime
  },
  mixins: [mixins],
  components: {
    commentOperation,
    IconSvg
  },
  directives: { sender },
  props: ['comment'],
  // 主评论
  data () {
    return {
      lastReplyCommentId: '', // 上次回复评论的id
      level: LEVEL_TARGET,
      showSender: false,
      commentId: this.comment.id,
      reCommentId: '',
      currentPage: 1,
      isFirst: true,
      maxCount: 1,
      pageSize: 1
    }
  },
  created () {
    this.maxCount = this.store.config.replyLimit || 1
    this.pageSize = this.store.config.replySize || 1
  },
  // mounted () {
  //   // 懒加载意味着获取子评论是异步加载的，而非首次就渲染
  //   // if (this.store.config.lazy) {
  //   //   this.getSubComments(1)
  //   // }
  //   this.getSubComments(1)
  // },
  computed: {
    isLogin () {
      return this.store.user || false
    },
    // 获取需要展示评论数据
    listData () {
      return this.comment.subComments && this.comment.subComments.list.length ? this.getListData(this.comment.subComments.list) : []
    },
    // 是否展示更多
    showMore () {
      return this.isFirst && (this.comment.subComments && this.comment.subComments.list.length) > this.maxCount
    },
    pageCount () {
      let { replySize } = this.store.config
      let total = (this.comment.subComments && this.comment.subComments.total) || 0
      return Math.ceil(total / replySize) || 1
    }
  },

  methods: {
    // 获取子评论
    getSubComments (page) {
      EventBus.$emit('gosubpage', {
        page: this.currentPage,
        pageSize: this.pageSize,
        targetId: this.store.targetId,
        commentId: this.commentId
      })
    },

    // 获取展示列表数据
    getListData (comments) {
      if (this.isFirst) {
        if (this.maxCount < this.comment.subComments.list.length) {
          let temp = []
          for (let i = 0; i < this.maxCount; i++) {
            temp.push(this.comment.subComments.list[i])
          }
          return temp
        }
      }
      return comments.slice(0, this.pageSize)
    },

    goPage (page) {
      if (page >= 1 && page <= this.pageCount) {
        this.currentPage = page
      } else {
        this.currentPage = 1
      }
      this.getSubComments(this.currentPage)
    },
    // 处理回复
    handleReply (id, subId) {
      // if (!this.isLogin) {
      //   return false
      // }
      let dom = this.$refs['comment'].getElementsByClassName('sundog-comment--sender')[0] || null
      if (subId) {
        this.level = LEVEL_REPLY
        this.commentId = id
        this.reCommentId = subId
      } else {
        this.level = LEVEL_COMMENT
        this.commentId = id
      }
      // 1. 如果没有sender 显示sender
      // 2. 如果已经有sender 但是是同一个回复 则hide
      // 3. 如果有sender 不同回复 不变
      if (!dom) {
        this.showSender = uniqueId()
        this.lastReplyCommentId = subId || id
      } else {
        if (subId) {
          if (this.lastReplyCommentId === subId) {
            this.showSender = false
          }
          this.lastReplyCommentId = subId
        } else {
          if (this.lastReplyCommentId === id) {
            this.showSender = false
          }
          this.lastReplyCommentId = id
        }
      }
    },
    sendCb (content) {
      let promise = new Promise((resolve, reject) => {
        EventBus.$emit('reply', {
          content,
          commentId: this.commentId,
          level: this.level,
          reCommentId: this.reCommentId,
          targetId: this.store.targetId,
          page: this.currentPage,
          pageSize: this.pageSize,
          resolve,
          reject
        })
      })
      promise.then(() => {
        this.showSender = false
      })
    },

    viewMore () {
      this.isFirst = false
    },
    // 赞
    like (id) {
      EventBus.$emit('like', { id })
    },
    // 踩
    hate (id) {
      EventBus.$emit('hate', { id })
    }
  }
}
</script>

<style lang='less' scoped>
.sundog-comment{
    // background: red;
    // min-width: 300px;
    // min-height: 300px;
    a{
      outline: none;
      color: #00a1d6;
      text-decoration: none;
      cursor: pointer;
    }

    .btn-hover{
        padding: 0 5px;
        border-radius: 4px;
        // margin-right: 15px;
        cursor: pointer;
        display: inline-block;
        &:hover{
          color: #00a1d6;
          background: #e5e9ef;
        }
    }

    .sundog-comment--cover{
        cursor: pointer;
        float: left;
        margin: 24px 0 0 5px;
        position: relative;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover;
        width: 48px;
        border: none;
        vertical-align: middle;
        height: 48px;
        border-radius: 50%;
    }

    .sundog-comment--card{
        position: relative;
        margin-left: 85px;
        padding: 22px 0 14px;
        border-top: 1px solid #e5e9ef;
        .sundog-comment--creator{
            font-size: 12px;
            font-weight: 700;
            line-height: 18px;
            padding-bottom: 4px;
            display: block;
            word-wrap: break-word;
            color: #6d757a;
            cursor: pointer;
        }
        .sundog-comment--content{
            line-height: 20px;
            padding: 2px 0;
            font-size: 14px;
            text-shadow: none;
            overflow: hidden;
            word-wrap: break-word;
            word-break: break-word;
        }

        .sundog-comment--extra{
            color: #99a2aa;
            line-height: 26px;
            font-size: 12px;
            user-select: none;
            & > span{
                margin-right: 20px;
            }
        }

        .floor{

        }

        .platform{

        }

        .time{
        }

        .hate,
        .like{
            cursor: pointer;
            svg{
              display: inline-block;
              width: 14px;
              height: 14px;
              font-size: 14px;
              vertical-align: text-top;
              margin-right: 5px;
            }
        }

        .hate{
            margin-right: 15px;
        }

        .operation{
            position: relative;
            width: 18px;
            float: right;
            margin-top: 5px;
            margin-right: 0;
        }

        .reply{

        }

        .subcomment-item {
          padding: 10px 0;

          .operations{
            display: none;
          }
          &:hover .operations{
            display: block;
          }

          &>a{
            display: inline-block;
            position: relative;
            margin-right: 10px;
            vertical-align: top;

            img {
              width: 24px;
              height: 24px;
              border-radius: 50%;
            }
          }

          .subcomment-item--wrapper{
            display: inline-block;
            width: calc(100% - 34px);

            & > span {
              font-size: 12px;
              font-weight: 700;
              line-height: 18px;
              display: inline-block;
              // padding-bottom: 4px;
              word-wrap: break-word;
            }

            .subcomment-item--name{
              color: #6d757a;
              position: relative;
              display: inline-block;
              margin-right: 20px
            }

            .subcomment-item--reply{
              padding-right: 10px;
              color: #99a2aa;
              i{
                color: #00a1d6;
              }
            }

            .subcomment-item--content{
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              word-break: break-all;
            }
          }

          .subcomment-item--info{
            color: #99a2aa;
            line-height: 26px;
            font-size: 12px;
            margin-left: 34px;
            user-select: none;
            & > span{
              margin-right: 20px;
            }
          }
        }

        .subcomment-item--more{
          font-size: 12px;
          color: #6d757a;

          a{
            padding: 2px 3px;
            border-radius: 4px;
          }
        }

        .sundog-comment--pagenation{
          user-select: none;
          font-size: 12px;
          .result{
            padding-right: 10px;
          }
          .cur{
            color: #00a1d6;
            font-weight: 700;
          }

          .prev,
          .next,
          a{
            color: #222;
            cursor: pointer;
            text-align: center;
            margin: 0 4px;
            text-decoration: none;
            line-height: 26px;
          }
        }
    }
}

</style>
