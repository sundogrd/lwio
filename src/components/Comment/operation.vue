<template>
  <span class="operations" v-show="show">
      <div class="spot" @click="showOperation"><icon-svg iconClass="i-more" /></div>
      <div class="operation" v-show="showOpt && focus" @mouseenter="focus = true" @mouseleave="focus = false">
          <ul>
              <li class="btn-hover">加入黑名单</li>
              <li class="btn-hover">举报</li>
          </ul>
      </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg/index.vue'

@Component({
  name: 'CommentOperation',
  components: {
    IconSvg
  }
})
export default class SundogComment extends Vue {
  public showOpt: boolean = false
  public focus: boolean = false

  @Prop({ type: Boolean, required: false, default: true })
  public show!: boolean

  public showOperation () {
    this.showOpt = true
    this.focus = true
  }
}
</script>
<style lang="less" scoped>
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
.operations{
  position: relative;
  width: 18px;
  float: right;
  margin-top: 5px;
  margin-right: 0;
  .spot{
    width: 18px;
    height: 18px;
    cursor: pointer;
    font-size: 16px;
  }
  .operation{
    // display: none;
    position: absolute;
    width: 100px;
    right: 0;
    top: 20px;
    z-index: 10;
    background: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,.2);
    border-radius: 4px;
    color: #222;
    font-size: 14px;
    padding: 10px 0;
    z-index: 999;

    & li{
      padding: 0 15px;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      transition: all .3s;
      width: 100%;
    }
  }
}
</style>
