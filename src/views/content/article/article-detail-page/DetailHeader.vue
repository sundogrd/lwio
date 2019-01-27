<template>
  <div class="detail-header" :class="{'nav-up': !show}">
    <div class="detail-header-container">
      <h1>Lwio</h1>
      <div class="user-navbar">
        <div class="avatar">
          <img src="https://cdn-images-1.medium.com/fit/c/64/64/0*ti5WHj3RjXeMBKCT." class="avatar-image" alt="Pearce Liang">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import _ from 'lodash'
let lastScrollTop = 0
@Component({
  name: 'DetailHeader'
})
export default class DetailHeader extends Vue {
  public show = true
  public handleScroll () {
    // 下滑隐藏
    const st = window.pageYOffset || document.documentElement.scrollTop
    if (st > lastScrollTop) {
      this.show = false
    } else {
      this.show = true
    }
    lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling
  }
  public created () {
    lastScrollTop = 0
    window.addEventListener('scroll', _.throttle(this.handleScroll, 100))
  }
  public destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.detail-header {
  position: sticky;
  top: 0;
  height: 65px;
  padding: 0 20px;
  background: #fff;
  box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);

  // 下滑时
  &.nav-up {
    top: -60px;
  }

  &-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;

    button {
      padding: 5px;
    }

    h1 {
      font-size: 20px;
      margin: 0;
    }

    .user-navbar {
      .avatar {
        img {
          height: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
