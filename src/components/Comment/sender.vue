<template>
  <div class="sundog-comment--sender" v-show="show">
    <div class="user-face">
      <img :src="loginUser ? loginUser.imgUrl : 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4'" alt="">
    </div>
    <div class="textarea-container">
      <textarea name="msg" v-model="content" cols="80" rows="5" :placeholder="`回复 @${loginUser.nick}:`"></textarea>
      <button class="comment-sender-btn" @click="send">发表评论</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import { CommentCreator } from './types/comment'

@Component({
  name: 'CommentSender'

})
export default class SundogCommentHeader extends Vue {
  @Prop({ type: Boolean, required: false, default: true })
  public show!: boolean

  @Inject() loginUser!: CommentCreator

  public content: string = '' // 回复内容

  public send () {
    console.log('发送评论啊。。。')
    this.$emit('send', {
      content: this.content,
      creatorId: this.loginUser.id
    })
  }
}
</script>
<style lang="less" scoped>
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
</style>
