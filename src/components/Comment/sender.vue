<template>
  <div class="sundog-comment--sender" v-show="show">
    <div class="user-face">
      <img :src="user ? user.imgUrl : defaultUrl" alt="">
    </div>
    <div class="textarea-container">
      <textarea name="msg" :disabled="!isLogin" v-model="content" cols="80" rows="5" :placeholder="isLogin ? (level !== LEVEL_TARGET ? `回复 @${user.nick}:` : '请输入合法的评论') : '你需要登录才能发表评论'"></textarea>
      <button class="comment-sender-btn" :class="{disabled: !isLogin}" :disabled="!isLogin" @click="send">发表评论</button>
      <button class="comment-sender-login" v-show="!isLogin" @click="login">登录</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator'
import { CommentCreator } from './types/comment'
import { LEVEL_TARGET, LEVEL_COMMENT, LEVEL_REPLY } from './constant'
import EventBus from './eventbus'
import { setTimeout } from 'timers'
@Component({
  name: 'CommentSender'

})
export default class SundogCommentHeader extends Vue {
  // 是否展示
  @Prop({ type: Boolean, required: false, default: true })
  public show!: boolean
  // 等级
  @Prop({ type: Number, required: false, default: 1 })
  public level!: number

  private defaultUrl: string = 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
  public content: string = '' // 回复内容
  public LEVEL_TARGET = LEVEL_TARGET
  public LEVEL_COMMENT = LEVEL_COMMENT
  public LEVEL_REPLY = LEVEL_REPLY

  get isLogin () {
    if (this.user) {
      return true
    }
    return false
  }

  get user () {
    let data
    let deep = 4
    let target = this.$parent
    while (deep) {
      if (!target) {
        return null
      }
      if ('user' in target.$data) {
        data = target.$data.user
        break
      } else {
        target = target.$parent
      }
      deep--
    }
    return data
  }

  public send () {
    console.log('发送评论啊。。。')
    if (!this.content) {
      EventBus.$emit('showToast', {
        content: '评论不能为空'
      })
    }
    this.$emit('send', {
      content: this.content
    })
  }

  public login () {
    EventBus.$emit('login')
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

  .comment-sender-btn{
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
    &.disabled{
      cursor: not-allowed;
      background-color: #00a1d6b3;
      border-color: #00a1d6b3;
    }
  }

  .comment-sender-login{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 26px;
    width: 50px;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    color: blue;
    background: white;
    vertical-align: middle;
    font-size: 14px;
    display: inline-block;
    text-align: center;
    border: 1px solid blue;
  }
}
</style>
