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
          <span class="like" @click="proxyLike(comment.id, $event)"><icon-svg iconClass="thumbup"></icon-svg><span>{{comment.like}}</span></span>
          <span class="hate" @click="proxyHate(comment.id, $event)"><icon-svg iconClass="cai"/><span>{{comment.hate}}</span></span>
          <span class="reply btn-hover" @click="handleReply(comment.id)">回复</span>
          <comment-operation></comment-operation>
      </div>
      <div class="sundog-comment--subcomments" v-show="subComments && subComments.length" >
          <div class="subcomment-item" :date-index="index" v-for="(subComment, index) in subComments" :key="index">
              <a href=""><img :src="subComment.creator && subComment.creator.imgUrl" alt="image"></a>
              <div class="subcomment-item--wrapper">
                  <span class="subcomment-item--name">{{subComment.creator && subComment.creator.nick}}</span>
                  <span class="subcomment-item--content">{{subComment.content}}</span>
              </div>
              <div class="subcomment-item--info">
                    <span class="time">{{subComment.createTime | formatTime}}</span>
                    <span class="like" @click="proxyLike(subComment.id, $event)"><icon-svg iconClass="thumbup"></icon-svg>{{subComment.like}}</span>
                    <span class="reply btn-hover" @click="handleReply(comment.id, subComment.commentId)">回复</span>
                    <comment-operation></comment-operation>
              </div>
          </div>
          <div class="subcomment-item--more" v-show="showMore && isFirst">
            共<b>{{subComments.length}}</b>条回复， <a href="javascript:;;" @click="viewMore" class="btn-more">点击查看</a>
          </div>
      </div>
      <div class="sundog-comment--pagenation" v-show="!isFirst && pages > 1">
          <span class="result">共{{this.pages}}页</span>
          <span class="prev" :style="{display: currentPage !== 1 ? 'inline-block' : 'none'}" @click="goPage(currentPage -1 )">上一页</span>
          <a class="page-number" :class="{cur: currentPage === +idx}" v-for="idx in this.pages" :key="idx" @click="goPage(+idx)">{{idx}}</a>
          <span class="next" :style="{display: currentPage !== pages ? 'inline-block' : 'none'}" @click="goPage(currentPage + 1 >= pages ? pages : currentPage + 1 )">下一页</span>
      </div>
      <comment-sender :show="showSender"  @send="handleSend"></comment-sender>
    </div>
  </div>
</template>

<script lang='ts'>
/** *
 *** 单个评论快
***/
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import { Comment, SubComment } from './types/comment'
import { formatTime } from '@/utils/index.js'
import IconSvg from '@/components/IconSvg/index.vue'
import commentOperation from './operation.vue'
import commentSender from './sender.vue'
import { getSubComments, likeComment, hateComment, sendComment } from './service'
import { LEVEL_TARGET, LEVEL_COMMENT, LEVEL_REPLY } from './constant'
@Component({
  name: 'CommentItem',
  filters!: {
    formatTime
  },
  components: {
    commentOperation,
    commentSender,
    IconSvg
  }
})
export default class SundogCommentItem extends Vue {
  // 主评论
  @Prop({ type: Object, required: true })
  public comment!: Comment

  @Prop({ type: Number, required: false, default: 3 })
  public maxCount!: number

  @Prop({ type: Number, required: false, default: 5 })
  public pageSize!: number

  @Prop({ type: Function, required: false })
  public getPage!: (page: number)=> Promise<Comment[]>

  // @Prop({ type: String, required: false, default: 'local', validator: (v) => ['local', 'remote'].indexOf(v) > -1 })
  // public mode!: string

  // // 发送者头像
  // @Prop({ type: String, required: false })
  // public avatar!: string

  @Watch('currentPage')
  async onPageChanged (val: number, oldVal: number) {
    this.listData = await this.__getData(val) || []
  }

  // @Watch('subComments')
  // onCommentsChanged (val: any, oldVal: any) {
  //   this.listData = this.__getData(val) || []
  // }

  // 子评论
  public subComments: SubComment[] = []
  // 回复等级
  public level: number = LEVEL_TARGET
  // showSender
  public showSender: boolean = false

  public commentId: string | number = ''
  public reCommentId: string | number = ''

  public pages: number = this.__getSubLen() // 总页数
  public currentPage: number = 1 // 当前页
  public isFirst: boolean = true // 是否第一次进入
  public listData: SubComment[] = (this.subComments || []).slice(0, this.pageSize) || [] // 展示条数
  public showMore: boolean = !!(((this.subComments && this.subComments.length) || 0) > this.maxCount)// 是否展示更多

  @Inject() subLink!: string
  @Inject() sendLink!: string
  @Inject() likeLink!: string
  @Inject() hateLink!: string
  @Inject() isLogin!: boolean
  @Inject() loginUser!: any

  public async mounted () {
    // console.log(this.comment)
    let res = await getSubComments(this.subLink, {
      page: 1,
      pageSize: this.pageSize,
      targetId: this.comment.targetId.toString(),
      commentId: this.comment.id.toString()
    })

    // console.log(res)
    this.subComments = res.list.map(v => {
      return {
        id: v.comment_id.toString(),
        creator: {
          nick: this.loginUser ? this.loginUser.nick : 'luffylv',
          imgUrl: this.loginUser ? this.loginUser.imgUrl : '',
          id: v.creator_id.toString()
        },
        commentId: v.parent_id.toString(),
        reCommentCreator: v.re_comment_id ? v.re_comment_id.toString() : '',
        targetId: v.target_id,
        content: v.content,
        like: v.like || 0,
        createTime: +v.created_at
      }
    })

    console.log(this.subComments, 'subComment')
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
    return Math.floor(((this.subComments && this.subComments.length) || 0) / this.pageSize) || 1
  }

  // 发送处理
  public async handleSend (data: any) {
    if (this.level === LEVEL_COMMENT) {
      let res = await sendComment(this.sendLink, {
        creatorId: data.creatorId,
        targetId: this.comment.targetId,
        commentId: this.comment.id,
        content: data.content
      })
    } else {
      let res = await sendComment(this.sendLink, {
        targetId: this.comment.targetId,
        creatorId: data.creatorId,
        commentId: this.commentId.toString(),
        content: data.content,
        reCommentId: this.reCommentId.toString()
      })

      console.log('发送结果 ', res)
    }
  }

  private async __getData (page: number = 0) {
    // if (this.mode === 'remote') {
    //   await this.getPage(page)
    // } else {
    const start = (page - 1) * this.pageSize
    const end = page * this.pageSize
    const copy: SubComment[] = [...(this.subComments || [])]
    if (copy.length && copy.length > start && copy.length >= end) {
      return copy.splice(start, this.pageSize)
    }
    return []
    // }
  }

  private goPage (page: number) {
    if (page >= 1 && page <= this.pages) {
      this.currentPage = page
    } else {
      this.currentPage = 1
    }
  }

  // 处理回复
  public handleReply (id:string | number, subId: string | number) {
    if (!this.isLogin) {
      return false
    }
    this.showSender = !this.showSender
    if (subId) {
      this.level = LEVEL_REPLY
      this.commentId = id
      this.reCommentId = subId
    } else {
      this.level = LEVEL_COMMENT
      this.commentId = id
    }
  }

  public viewMore () {
    this.isFirst = false
  }

  // 赞
  public async proxyLike (id: string |number) {
    let res = await likeComment(this.likeLink, { id: id.toString() })
    if (res) {
      console.log('点赞成功')
    }
  }

  // 踩
  public async proxyHate (id: string |number) {
    let res = await hateComment(this.hateLink, { id: id.toString() })
    if (res) {
      console.log('踩成功')
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
