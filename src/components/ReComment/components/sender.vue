<template>
  <div class="sundog-comment--sender">
    <div class="user-face">
      <img :src="!disable ? store.user.avatar : defaultUrl" alt="">
    </div>
    <div class="textarea-container">
      <textarea name="msg" :disabled="disable" v-model="content" :cols="cols || 80" :rows="rows || 5" :placeholder="placeholder || '请输入合法的评论'"></textarea>
      <button class="comment-sender-btn" :class="{disabled: disable}" :disabled="disable" @click="send">发表评论</button>
      <button class="comment-sender-login" v-show="disable" @click="login">登录</button>
    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import EventBus from '../eventbus'
export default {
  props: ['cols', 'rows', 'placeholder'],
  name: 'sender',
  mixins: [mixins],
  data () {
    return {
      defaultUrl: 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      content: ''
    }
  },
  computed: {
    disable () {
      return !this.store.user
    }
  },
  methods: {
    send () {
      // 考虑到指令所以这里使用this.$emit
      this.$emit('send', this.content)
    },
    login () {
      EventBus.$emit('login')
    }
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
