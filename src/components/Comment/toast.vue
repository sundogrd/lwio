<template>
  <div class="toast" v-show="show">{{content}}</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import EventBus from './eventbus'
@Component({
  name: 'CommentToast'
})
export default class SundogCommentHeader extends Vue {
  public show:boolean = false
  public content: string = '我是toast哟yoooo~~~'

  private __showToast ({ content } : {content: string}) {
    this.show = true
    this.content = content
    setTimeout(() => {
      this.show = false
    }, 1500)
  }

  private __hideToast () {
    this.show = false
  }

  public mounted () {
    EventBus.$on('showToast', this.__showToast)

    EventBus.$on('hideToast', this.__hideToast)
  }

  public beforeDestroy () {
    EventBus.$off('hideToast', this.__hideToast)
    EventBus.$off('showToast', this.__showToast)
  }
}
</script>
<style lang="less" scoped>
.toast{
  position: fixed;
  left: 50%;
  top: 50%;
  background: rgba(0, 0, 0, 0.54);
  padding: 10px;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  color: white;
}
</style>
