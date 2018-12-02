<template>
  <div class="author-bar">
    <div class="avatar-block">
      <img src="//cdn-images-1.medium.com/fit/c/64/64/0*ti5WHj3RjXeMBKCT." />
    </div>
    <div class="info-block">
      <p class="name">梁王</p>
      <p class="caption">blabla</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import marked from 'marked'
@Component({
  name: 'AuthorBar'
})
export default class AuthorBar extends Vue {
}
</script>

<style rel="stylesheet/scss" lang="scss">
.author-bar {
  display: flex;
  .avatar-block {
    margin-right: 20px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .info-block {
    p.name {
      color: rgba(0,0,0,.84);
    }
    p.caption {
      color: rgba(0,0,0,.54);
    }
  }
}
</style>
