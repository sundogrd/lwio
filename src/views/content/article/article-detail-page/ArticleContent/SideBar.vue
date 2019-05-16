<template>
  <div class="sidebar-block">
    <ul>
      <li class="marginLeft3 marginVertical10">
        <div class="clap">
          <img
            class="img-block"
            @click="clap"
            src="https://pic.52112.com/icon/256/20190306/32159/1581109.png"
          >
          <span class="number-block">{{nowCount}}</span>
          <p class="over-tip" :class="{show: isShowTip}">{{tip}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import marked from 'marked'
import * as logService from '@/services/log'
import axios from 'axios'

export type SideBarOption = {
  clap: number;
};

@Component({
  name: 'SideBar'
})
export default class SideBar extends Vue {
  @Prop(Object)
  sidebar!: SideBarOption;

  private tip: string = ''
  private isShowTip: boolean = false
  public nowCount: number = this.sidebar.clap || 0;

  public async clap () {
    logService
      .addStatement({
        articleId: this.$route.params.articleId,
        userId: '23232'// 暂时这样
      })
      .then(res => {
        if (res.id) {
          this.nowCount++
        } else {
          this.tip = res.msg || '已经不能继续鼓掌了'
          this.isShowTip = true
          setTimeout(() => {
            this.isShowTip = false
          }, 1000)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  public mounted () {}
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.sidebar-block {
  display: flex;
  margin: 24px 0;
  position: relative;
  left: -150px;
  height: 0px;
  top: -100px;

  .clap {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
      font-size: 22px;
      display: inline-block;
      position: relative;
      color: rgba(0, 0, 0, 0.54);
      background: rgba(0, 0, 0, 0);
      font-size: 16px;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      vertical-align: bottom;
      white-space: nowrap;
      text-rendering: auto;
      user-select: none;
      box-sizing: border-box;
      font-family: medium-content-sans-serif-font, -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
        "Open Sans", "Helvetica Neue", sans-serif;
      letter-spacing: 0;
      font-weight: 400;
      font-style: normal;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    .over-tip{
      &.show{
        display: inline-block;
        opacity: 1;
      }
      display: none;
      opacity: 0;
      position: absolute;
      top: -30px;
      left: -30px;
      width: 150px;
      height: 32px;
      background: gray;
      line-height: 32px;
      text-align: center;
    }
  }

  .img-block {
    width: 40px;
    height: 40px;
    display: inline-block;
    cursor: pointer;
  }

  .marginLeft3 {
    margin-left: 3px !important;
  }

  .marginVertical10 {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
}
</style>
