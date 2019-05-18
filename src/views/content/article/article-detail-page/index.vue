<template>
  <div class='article-page' sticky-container>
    <!-- <button v-sticky sticky-offset='30' sticky-side='bottom' :click='fullScreen'>Great</button> -->
    <detail-header />
    <transition-group name='fade' mode='out-in'>
      <div class='article-container' key='article-container'>
        <article-content :article='article' />
      </div>
    </transition-group>
    <div class='graylight-bg'>
      <!-- <recommend-section /> -->
      <article-replies />
    </div>
    <div class="comment-wrapper" style="margin-bottom: 300px; padding: 0 100px" v-for="(comment, idx) in comments" :key="idx">
      <sundog-comment :comment="comment" @like="handleLike()" @hate="handleHate" @reply="handleReply" @replySub="handleSubReply" ></sundog-comment>
    </div>
    <detail-footer />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as SundogDataTypes from '@/types/api.d.ts'
import * as contentService from '@/services/content'
import * as logService from '@/services/log'
import * as commentService from '@/services/comment'
import DetailHeader from './DetailHeader.vue'
import DetailFooter from './DetailFooter.vue'
import ArticleContent from './ArticleContent/index.vue'
import ArticleReplies from './ArticleReplies/index.vue'
import RecommendSection from './RecommendSection/index.vue'
import SundogComment from '@/components/Comment/index.vue'
const CONTENT_ID = '1111' // 测试用的

@Component({
  name: 'ArticleDetailPage',
  components: {
    DetailHeader,
    DetailFooter,
    ArticleContent,
    ArticleReplies,
    RecommendSection,
    SundogComment
  }
})

export default class ArticleDetailPage extends Vue {
  private article: contentService.ContentInfo | null = null
  private comments: any = null

  public async mounted () {
    const contentId = this.$route.params.articleId
    const res = await contentService.getContentById({ contentId: contentId })
    this.article = res
    const commentsRes = await commentService.getComments({
      contentId: CONTENT_ID
    })

    this.comments = await Promise.all(commentsRes.list.map(this.handleComment))
    console.log(this.comments)
  }

  private __handleComment (comment: any) {
    let cmt = {
      commentId: comment.comment_id.toString(),
      creator: {
        nick: 'luffylv',
        imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
        id: comment.creator_id
      },
      targetId: comment.target_id,
      like: comment.like || 0,
      hate: comment.hate || 0,
      floor: comment.floor,
      state: comment.state,
      extra: comment.extra && JSON.parse(comment.extra),
      createTime: +comment.created_at,
      content: comment.content,
      subComments: []
    }
    return cmt
  }

  // comment服务数据是不完整的，人物信息并没有，自己mock
  public async handleComment (comment: any) {
    let cmt = this.__handleComment(comment)
    let subComments = await this.getSubComments(cmt.commentId)
    cmt.subComments = subComments
    return cmt
  }

  public async getSubComments (id: string): Promise<any> {
    let subCommentsRes = await commentService.getComments({
      contentId: CONTENT_ID,
      targetId: id
    })
    return subCommentsRes.list.map(this.__handleComment)
  }

  private genSubComments (id: string | number): any {

    // return Array.from({ length: 20 }, (_, v) => {
    //   return {
    //     id: Math.random().toString().slice(2),
    //     creator: {
    //       nick: String.fromCodePoint(Math.round(Math.random() * 20901) + 19968),
    //       img_url: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
    //       id: Math.random().toString().slice(2)
    //     },
    //     create_time: 1556812800000,
    //     content: v + '测试评论回复',
    //     like: ~~(100 * Math.random())
    //   }
    // })
  }

  public handleLike () {
    console.log('like')
  }

  public handleHate () {

  }

  public async handleReply ({ commentId, comment } : {commentId: string, comment: string}) {
    let res = await commentService.sendComment({
      contentId: CONTENT_ID,
      targetId: commentId,
      content: comment
    })
    console.log(res)
  }

  public async handleSubReply ({ commentId, replyId, comment }: {commentId: string, comment: string, replyId: string}) {
    let res = await commentService.sendComment({
      contentId: CONTENT_ID,
      targetId: commentId,
      content: comment,
      reCommentId: replyId
    })
  }

  // public comment: SundogDataTypes.Comment = {
  //   id: '12232323',
  //   creator: {
  //     nick: 'luffylv',
  //     img_url: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
  //     id: '2323211'
  //   },
  //   target_id: '122323',
  //   like: 23,
  //   hate: 12,
  //   floor: 1,
  //   extra: {
  //     platform: '客户端'
  //   },
  //   create_time: 1556812800000,
  //   content: '这是一条测试评论，不用管他哈哈哈哈啊哈哈哈哈哈哈。。。。',
  //   subComments: this.genSubComments()
  // }
  // fullScreen() {
  //   this.$fullscreen.toggle(this.$el.querySelector('.example'), {
  //     wrap: false,
  //     callback: null,
  //   })
  // }
}
</script>

<style lang='less'>
.article-container {
  margin: 20px auto;
  max-width: 980px;
  padding-left: 20px;
  padding-right: 20px;
}

.graylight-bg {
  background: #fafafa;
}
</style>
