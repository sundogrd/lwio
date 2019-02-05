<template>
  <div class="author-bar">
    <div class="avatar-block">
      <img :src="author.avatar_url" />
    </div>
    <div class="info-block">
      <p class="name">{{author.name}}</p>
      <p class="caption">{{author.extra.github_home}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import marked from 'marked'
import * as userService from '@/services/user'
@Component({
  name: 'AuthorBar'
})
export default class AuthorBar extends Vue {
  @Prop(Object) author!: userService.UserInfo
}
</script>

<style rel="stylesheet/scss" lang="scss">
.author-bar {
  display: flex;
  margin: 24px 0;

  .avatar-block {
    margin-right: 20px;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }

  .info-block {
    p.name {
      color: rgba(0, 0, 0, 0.84);
    }

    p.caption {
      color: rgba(0, 0, 0, 0.54);
    }
  }
}
</style>
