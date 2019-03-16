<template>
  <div class='user-space-article'>
    <article-card v-for="content in contents" :key="content.content_id.toString()" :content="content" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import * as contentService from '@/services/content'
import ArticleCard from './article-card.vue'


@Component({
  name: 'UserSpaceArticle',
  components: {
    ArticleCard
  }
})
export default class UserSpaceArticle extends Vue {
  private contents: contentService.ContentInfo[] = []
  public async mounted() {
    const res = await contentService.getContents({})
    this.contents = res.list;
  }
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-space-article {
  background: #fafafa;
  min-height: 100vh;
}
</style>
