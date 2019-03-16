<template>
  <div class='user-nav-header'>
    <router-link class="nav-item" :to="{ name: 'userSpaceArticle' }">文章</router-link>
    <router-link class="nav-item" :to="{ name: 'userSpaceAudio' }">音频</router-link>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'UserNavHeader',
  components: {
  }
})
export default class UserNavHeader extends Vue {
  
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-nav-header {
  position: relative;
  background-color: #fff;
  border-radius: 2.4px 2.4px 0 0;
  border-bottom: 1px solid #ebebeb;
  z-index: 100;
  display: flex;
  align-items: center;
  margin: 0 auto;
  height: 50px;
  max-width: 960px;
  white-space: nowrap;

  .nav-item {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 90px;
    height: 100%;
    transition: 0.2s all ease-in-out;

    &.router-link-exact-active {
      box-shadow: inset 0 -2px 0 #3780f7;
      color: #007fff;
    }

    &:hover {
      color: #007fff;
    }
  }
}
</style>
