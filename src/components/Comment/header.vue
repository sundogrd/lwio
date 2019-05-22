<template>
  <div class="comment-header">
    <div class="comment-header--title"><span>45465</span>评论</div>
    <div class="comment-header--bar">
      <div class="bar-tabs">
        <ul>
          <li>全部评论</li>
          <li class="active">按热度排序</li>
          <li>按时间排序</li>
        </ul>
      </div>
      <div class="bar-pagenation">
        <span class="result">共192页</span>
        <span class="prev">上一页</span>
        <span class="current">1</span>
        <span class="page">2</span>
        <span class="next">下一页</span>
      </div>
    </div>
    <comment-sender :level="level" @send="handleSend" @login="handleLogin"></comment-sender>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import CommentSender from './sender.vue'
import { LEVEL_TARGET } from './constant'
import { sendComment } from './service'
@Component({
  name: 'CommentHeader',
  components: {
    CommentSender
  }
})
export default class SundogCommentHeader extends Vue {
  public level:number = LEVEL_TARGET

  @Inject() contentId!: string
  @Inject() sendLink!: string

  public async handleSend (data: any) {
    let res = await sendComment(this.sendLink, {
      targetId: this.contentId,
      creatorId: data.creatorId,
      content: data.content
    })
    console.log('发送文章评论结果', res)
  }

  public async handleLogin () {
    console.log('login action here')
    this.$parent.$data.isLogin = true
  }
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
      .current{
        color: #00a1d6;
        font-weight: 700;
      }
      .next,
      .page{
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
