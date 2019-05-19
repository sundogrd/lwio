<template>
  <div id='sundog-comment'>
    <comment-header></comment-header>
    <comment-list :comments="datas"></comment-list>
    <!-- <comment-footer></comment-footer> -->
  </div>
</template>

<script lang='ts'>
import { getMainComments, getSubComments } from './service'
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator'
import { Comment, CommentCreator } from './types/comment'
import CommentList from './list.vue'
import CommentHeader from './header.vue'
import CommentFooter from './footer.vue'
import EventBus from './eventbus'
@Component({
  name: 'Comment',

  components: {
    CommentHeader,
    CommentFooter,
    CommentList
  }
})
export default class SundogComment extends Vue {
  public datas: Comment[] = []
  public user: CommentCreator | null = {
    imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
    id: '354657',
    nick: '佛系玩家'
  }

  // 目标id
  @Prop({ type: [String, Number], required: true })
  public targetId!: number

  // 获取主评论接口
  @Prop({ type: String, required: true, default: '/' })
  public mainUrl!: string

  // 获取子评论接口
  @Prop({ type: String, required: false, default: '/' })
  public subUrl!: string

  // 点赞接口
  @Prop({ type: String, required: true, default: '/' })
  public likeUrl!: string

  // 踩接口
  @Prop({ type: String, required: true, default: '/' })
  public hateUrl!: string

  // 发送接口
  @Prop({ type: String, required: true, default: '/' })
  public sendUrl!: string

  // 分页大小
  @Prop({ type: Number, required: false, default: 10 })
  public size!: number

  @Provide() isLogin = true
  @Provide() loginUser = this.user
  @Provide() subLink = this.subUrl
  @Provide() likeLink = this.likeUrl
  @Provide() hateLink = this.hateUrl
  @Provide() sendLink = this.sendUrl
  @Provide() contentId = this.targetId // 文章id

  public async mounted () {
    let res = await getMainComments(this.mainUrl, {
      page: 1,
      pageSize: this.size,
      targetId: this.targetId.toString()
    })

    this.datas = res.list.map(v => {
      return {
        id: v.comment_id.toString(),
        creator: {
          nick: this.user ? this.user.nick : 'luffylv',
          imgUrl: this.user ? this.user.imgUrl : '',
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
    // this.datas = Array.from({ length: 10 }, (_, v) => {
    //   return this.genComments()
    // })
    console.log(this.datas)
  }

  public created () {
    // 发送完毕添加dom
    EventBus.$on('sendOver', (data: any) => {
      console.log(data)
    })
  }

  private genComments () {
    let cmt = {
      id: '12232323',
      creator: {
        nick: 'luffylv',
        imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
        id: '2323211'
      },
      targetId: '122323',
      like: 23,
      hate: 12,
      floor: 1,
      extra: {
        platform: '客户端'
      },
      createTime: 1556812800000,
      content: '这是一条测试评论，不用管他哈哈哈哈啊哈哈哈哈哈哈。。。。',
      subComments: this.genSubComments()
    }

    return cmt
  }

  private genSubComments (): any {
    return Array.from({ length: 20 }, (_, v) => {
      return {
        id: Math.random().toString().slice(2),
        creator: {
          nick: String.fromCodePoint(Math.round(Math.random() * 20901) + 19968),
          img_url: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
          id: Math.random().toString().slice(2)
        },
        create_time: 1556812800000,
        content: v + '测试评论回复',
        like: ~~(100 * Math.random())
      }
    })
  }
}
</script>

<style lang='less' scoped>

</style>
