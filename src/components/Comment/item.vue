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
          <span class="like" @click="proxyLike(comment.id, 0, $event)"><icon-svg iconClass="thumbup"></icon-svg><span>{{comment.like}}</span></span>
          <span class="hate" @click="proxyHate(comment.id, 0, $event)"><icon-svg iconClass="cai"/><span>{{comment.hate}}</span></span>
          <span class="reply btn-hover" @click="handleReply(comment.id)">回复</span>
          <comment-operation></comment-operation>
      </div>
      <div class="sundog-comment--subcomments" @click="proxyLike('', 1, $event)" v-show="subComments && subComments.length" >
          <div class="subcomment-item" :date-sub-index="index" v-for="(subComment, index) in listData" :key="index">
              <a href=""><img :src="subComment.creator && subComment.creator.imgUrl" alt="image"></a>
              <div class="subcomment-item--wrapper">
                  <span class="subcomment-item--name">{{subComment.creator && subComment.creator.nick}}</span>
                  <span class="subcomment-item--content">{{subComment.content}}</span>
              </div>
              <div class="subcomment-item--info">
                    <span class="time">{{subComment.createTime | formatTime}}</span>
                    <span class="like" :data-sub-id="subComment.id && subComment.id.toString()"><icon-svg iconClass="thumbup"></icon-svg><span>{{subComment.like}}</span></span>
                    <span class="reply btn-hover" @click="handleReply(comment.id, subComment.id)">回复</span>
                    <comment-operation></comment-operation>
              </div>
          </div>
          <div class="subcomment-item--more" v-show="showMore">
            共<b>{{totalSubCount}}</b>条回复， <a href="javascript:;;" @click="viewMore" class="btn-more">点击查看</a>
          </div>
      </div>
      <div class="sundog-comment--pagenation" v-show="!isFirst && pageCount > 1">
          <span class="result">共{{pageCount}}页</span>
          <span class="prev" :style="{display: currentPage !== 1 ? 'inline-block' : 'none'}" @click="goPage(currentPage -1 )">上一页</span>
          <a class="page-number" :class="{cur: currentPage === +idx}" v-for="idx in pageCount" :key="idx" @click="goPage(+idx)">{{idx}}</a>
          <span class="next" :style="{display: currentPage !== pageCount ? 'inline-block' : 'none'}" @click="goPage(currentPage + 1 >= pageCount ? pageCount : currentPage + 1 )">下一页</span>
      </div>
      <comment-sender :show="showSender"  @send="handleSend" :isLogin="isLogin"></comment-sender>
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

type SubCommentsResponse = {
  list: SubComment[],
  total: number
}

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

  @Prop({ type: Boolean, required: true, default: false })
  public isLogin!: boolean

  // 子评论
  public subComments: SubComment[] = []
  // 子评论数目
  public totalSubCount: number = 0
  // 回复等级
  public level: number = LEVEL_TARGET
  // 是否展示发送框
  public showSender: boolean = false
  // 评论id 回复id
  public commentId: string | number = ''
  public reCommentId: string | number = ''

  public currentPage: number = 1 // 当前页
  public isFirst: boolean = true // 是否第一次进入

  @Inject() subLink!: string
  @Inject() sendLink!: string
  @Inject() likeLink!: string
  @Inject() hateLink!: string

  // 获取需要展示评论数据
  get listData () {
    // console.log(t)
    return this.subComments.length ? this.getListData(this.subComments) : []
  }

  // 是否展示更多
  get showMore () {
    return this.isFirst && this.subComments.length > this.maxCount
  }

  // 页数
  get pageCount () {
    return Math.ceil(this.totalSubCount / this.pageSize) || 1
  }

  // 做个转化
  private commentMapper (comments: SubComment[]): SubComment[] {
    return comments.map(v => {
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
        reCommentCreator: v.re_comment_id ? v.re_comment_id.toString() : '',
        targetId: v.target_id,
        content: v.content,
        like: v.like || 0,
        createTime: +v.created_at
      }
    })
  }

  public async mounted () {
    await this.getSubComments(1)
  }

  // 获取子评论
  private async getSubComments (page: number) {
    let res = await getSubComments(this.subLink, {
      page: page,
      pageSize: this.pageSize,
      targetId: this.comment.targetId.toString(),
      commentId: this.comment.id.toString()
    })
    this.subComments = this.commentMapper(res.list)
    this.totalSubCount = res.total
    this.totalSubCount && console.log(`成功获取评论${this.comment.id}的子评论， 总共有${this.totalSubCount}条`)
    if (this.totalSubCount === 1) {
      debugger
    }
  }

  // 获取展示列表数据
  private getListData (comments: SubComment[]) : SubComment[] {
    if (this.isFirst) {
      if (this.maxCount < this.subComments.length) {
        let temp : SubComment[] = []
        for (let i = 0; i < this.maxCount; i++) {
          temp.push(this.subComments[i])
        }
        return temp
      }
    }
    return comments
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

  private async goPage (page: number) {
    if (page >= 1 && page <= this.pageCount) {
      this.currentPage = page
    } else {
      this.currentPage = 1
    }
    await this.getSubComments(this.currentPage)
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
  public async proxyLike (id: string |number, level: number, evt: any) {
    if (level) {
      // 事件委托
      if (evt.target) {
        let curTargetDom = evt.target
        let curTarget = curTargetDom.closest('.subcomment-item--info .like')
        if (curTarget) {
          // 获取id
          let subId = curTarget.dataset['subId']
          // 点赞
          let res = await likeComment(this.likeLink, { id: subId })
          if (res) {
            console.log('点赞成功')
          }
          // 手动更改
          let target = curTarget.querySelector('span')
          let nowCount = +target.innerText
          target.innerText = nowCount + 1
        }
      }
    } else {
      let res = await likeComment(this.likeLink, { id: id.toString() })
      if (res) {
        console.log('点赞成功')
      }
      let targetDom = evt.target
      if (targetDom) {
        let target = targetDom.closest('.like').querySelector('span')
        let nowCount = +target.innerText
        target.innerText = nowCount + 1
      }
    }
  }

  // 踩
  public async proxyHate (id: string |number, level: number, evt: any) {
    let res = await hateComment(this.hateLink, { id: id.toString() })
    // 成功手动更改dom 好挫
    if (res) {
      let targetDom = evt.target
      if (targetDom) {
        let target = targetDom.closest('.hate').querySelector('span')
        let nowCount = +target.innerText
        target.innerText = nowCount + 1
      }
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
