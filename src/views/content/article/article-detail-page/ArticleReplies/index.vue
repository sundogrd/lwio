<template>
  <div class='article-replies'>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import marked from 'marked'
// import { getArticle } from '@/api/article'
@Component({
  name: 'ArticleReplies'
})
export default class ArticleReplies extends Vue {
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.article-replies {

}
</style>
