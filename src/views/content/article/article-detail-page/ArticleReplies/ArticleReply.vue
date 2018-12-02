<template>
  <div class="article-reply">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import marked from 'marked'
// import { getArticle } from '@/api/article'
@Component({
  name: 'ArticleReply'
})
export default class ArticleReply extends Vue {
}
</script>

<style rel="stylesheet/scss" lang="scss">
.article-reply {

}
</style>
