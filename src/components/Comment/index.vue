<template>
  <div class='sundog-comment'>
    <div class='sundog-comment--cover' :style="{ backgroundImage: `url(${comment.creator.imgUrl})`}" />
    <div class='sundog-comment--card'>
      <p class='sundog-comment--creator'>{{comment.creator.nick}}</p>
      <div class='sundog-comment--content'>{{comment.content}}</div>
      <div class="sundog-comment--extra">
          <span class="floor">#{{comment.floor}}</span>
          <span class="platform" v-if="comment.extra && comment.extra.platform">{{comment.extra.platform}}</span>
          <span class="time">{{comment.createTime | formatTime}}</span>
          <span class="like" @click="proxyLike(comment.commentId)"><icon-svg iconClass="thumbup"></icon-svg><span>{{comment.like}}</span></span>
          <span class="hate" @click="proxyHate(comment.commentId)"><icon-svg iconClass="cai"/><span>{{comment.hate}}</span></span>
          <span class="reply btn-hover" @click="handleReply(comment.commentId)">回复</span>
          <comment-operation></comment-operation>
      </div>
      <div class="sundog-comment--subcomments" v-if="comment.subComments && comment.subComments.length" >
          <div class="subcomment-item" :date-index="index" v-for="(subComment, index) in listData" :key="index" v-show="isShow(index, currentPage)">
              <a href=""><img :src="subComment.creator && subComment.creator.imgUrl" alt="image"></a>
              <div class="subcomment-item--wrapper">
                  <span class="subcomment-item--name">{{subComment.creator && subComment.creator.nick}}</span>
                  <span class="subcomment-item--content">{{subComment.content}}</span>
              </div>
              <div class="subcomment-item--info">
                    <span class="time">{{subComment.createTime | formatTime}}</span>
                    <span class="like" @click="proxyLike(subComment.commentId)"><icon-svg iconClass="thumbup"></icon-svg>{{subComment.like}}</span>
                    <span class="reply btn-hover" @click="handleReply(comment.commentId, subComment.commentId, true)">回复</span>
                    <comment-operation></comment-operation>
              </div>
          </div>
          <div class="subcomment-item--more" v-show="showMore && isFirst">
            共<b>{{comment.subComments.length}}</b>条回复， <a href="javascript:;;" @click="viewMore" class="btn-more">点击查看</a>
          </div>
      </div>
      <div class="sundog-comment--pagenation" v-show="!isFirst && pages > 1">
          <span class="result">共{{this.pages}}页</span>
          <span class="prev" :style="{display: currentPage !== 1 ? 'inline-block' : 'none'}" @click="goPage(currentPage -1 )">上一页</span>
          <a class="page-number" :class="{cur: currentPage === +idx}" v-for="idx in this.pages" :key="idx" @click="goPage(+idx)">{{idx}}</a>
          <span class="next" :style="{display: currentPage !== pages ? 'inline-block' : 'none'}" @click="goPage(currentPage + 1 >= pages ? pages : currentPage + 1 )">下一页</span>
      </div>
      <div class="sundog-comment--sender" v-show="showSender">
        <div class="user-face">
          <img :src="avatar ? avatar : 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4'" alt="">
        </div>
        <div class="textarea-container">
          <textarea name="msg" v-model="replyContent" cols="80" rows="5" :placeholder="`回复 @${replyUserName}:`"></textarea>
          <button class="comment-sender-btn" @click="send">发表评论</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import * as SundogDataTypes from '@/types/api.d.ts'
import { formatTime } from '@/utils/index.js'
import { watch } from 'fs'
import IconSvg from '@/components/IconSvg/index.vue'
import commentOperation from './operation.vue'
@Component({
  name: 'Comment',
  filters!: {
    formatTime
  },
  components: {
    commentOperation,
    IconSvg
  }
})
export default class SundogComment extends Vue {
  @Prop({ type: Number, required: false, default: 3 })
  public maxCount!: number

  @Prop({ type: Number, required: false, default: 5 })
  public pageSize!: number

  @Prop({ type: Object, required: true })
  public comment!: SundogDataTypes.Comment

  @Prop({ type: Function, required: false })
  public getPage!: (page: number)=> Promise<SundogDataTypes.Comment[]>

  @Prop({ type: String, required: false, default: 'local', validator: (v) => ['local', 'remote'].indexOf(v) > -1 })
  public mode!: string

  // 发送者头像
  @Prop({ type: String, required: false })
  public avatar!: string

  @Watch('currentPage')
  async onPageChanged (val: number, oldVal: number) {
    this.listData = await this.__getData(val) || []
  }

  public mounted () {
    // console.log(this.comment)
  }

  public isShow (idx: number, current: number): boolean {
    // 第一页时
    if (current === 1 && this.isFirst) {
      if (idx >= this.maxCount) {
        console.log(`idx is ${idx}, current page is ${current}, page size is ${this.pageSize}, page max count is ${this.maxCount}, total pages is ${this.pages}`)
        return false
      }
    }
    return true
    // console.log(`idx is ${idx}, current page is ${current}, page size is ${this.pageSize}, page max count is ${this.maxCount}, total pages is ${this.pages}`)
  }

  public __getSubLen (): number {
    return Math.floor(((this.comment.subComments && this.comment.subComments.length) || 0) / this.pageSize) || 1
  }

  private async __getData (page: number = 0) {
    if (this.mode === 'remote') {
      await this.getPage(page)
    } else {
      const start = (page - 1) * this.pageSize
      const end = page * this.pageSize
      const copy: SundogDataTypes.Comment[] = [...(this.comment.subComments || [])]
      if (copy.length && copy.length > start && copy.length >= end) {
        return copy.splice(start, this.pageSize)
      }
      return []
    }
  }

  private goPage (page: number) {
    if (page >= 1 && page <= this.pages) {
      this.currentPage = page
    } else {
      this.currentPage = 1
    }
  }

  public send () {
    // 获取content
    let content = this.replyContent
    if (this.replyType === 1) {
      return this.proxyReplyReComment(this.replyId, this.replyTargetId, content)
    }
    return this.proxyReplyComment(this.replyId, content)
  }

  // 处理回复
  public handleReply (id:string | number, subId: string | number, isSubReply: boolean = false) {
    this.showSender = !this.showSender
    if (isSubReply) {
      this.replyType = 1
      this.replyId = id
      this.replyTargetId = subId
    } else {
      this.replyType = 0
      this.replyId = id
    }
  }

  public viewMore () {
    this.isFirst = false
  }

  // 回复主评论
  public proxyReplyComment (commentId: string | number, comment: string) {
    this.$emit('reply', {
      commentId,
      comment
    })
  }

  // 回复子评论
  public proxyReplyReComment (commentId: string | number, replyId: string | number, comment: string) {
    this.$emit('replySub', {
      commentId: commentId,
      replyId: replyId,
      comment
    })
  }

  // 赞
  public proxyLike (id: string |number) {
    this.$emit('like', {
      id
    })
  }

  // 踩
  public proxyHate (id: string |number) {
    this.$emit('hate', {
      id
    })
  }

  public pages: number = this.__getSubLen() // 总页数
  public currentPage: number = 1 // 当前页
  public isFirst: boolean = true // 是否第一次进入
  public listData: SundogDataTypes.Comment[] = (this.comment.subComments || []).slice(0, this.pageSize) || []
  public showMore: boolean = !!(((this.comment.subComments && this.comment.subComments.length) || 0) > this.maxCount)// 是否展示更多
  public replyUserName: string = ''
  public showSender: boolean = false // 是否展示发送框
  public replyId: string | number = '' // 回复评论id
  public replyTargetId: string | number = '' // 回复对象id, 如果回复的就是评论则没有这个，如果回复的是回复的话才有这个字段
  public replyType: number = 0 // 回复类型 0 父评论， 1 子回复
  public replyContent: string = '' // 回复内容
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

        .sundog-comment--sender{
          margin: 10px 0;

          .user-face{
            margin: 7px 0 0 5px;
            float: left;
            position: relative;
            img{
              width: 48px;
              height: 48px;
              border-radius: 50%;
            }
          }

          .textarea-container{
            position: relative;
            margin-left: 85px;
            margin-right: 80px;

            textarea{
              font-size: 12px;
              display: inline-block;
              box-sizing: border-box;
              background-color: #f4f5f7;
              border: 1px solid #e5e9ef;
              overflow: auto;
              border-radius: 4px;
              color: #555;
              width: 100%!important;
              height: 65px;
              transition: 0s;
              padding: 5px 10px;
              line-height: normal;
              outline: none;
              resize: none;
            }
          }

          button{
            width: 70px;
            height: 64px;
            position: absolute;
            right: -80px;
            top: 0;
            padding: 4px 15px;
            font-size: 14px;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            min-width: 60px;
            vertical-align: top;
            cursor: pointer;
            background-color: #00a1d6;
            border: 1px solid #00a1d6;
            transition: .1s;
            user-select: none;
            outline: none;
          }
        }
    }
}

</style>
