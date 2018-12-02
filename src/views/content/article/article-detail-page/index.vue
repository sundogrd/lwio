<template>
  <div class="article-page">
    <detail-header  />
    <transition-group name="fade" mode="out-in">
      <div class="article-container" key="article-container">
        <author-bar />
        <article-content />
        <article-replies />
      </div>
    </transition-group>
    <detail-footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import DetailHeader from './DetailHeader.vue'
import DetailFooter from './DetailFooter.vue'
import AuthorBar from './AuthorBar.vue'
import ArticleContent from './ArticleContent/index.vue'
import ArticleReplies from './ArticleReplies/index.vue'

@Component({
  name: 'ArticleDetailPage',
  components: {
    DetailHeader,
    DetailFooter,
    AuthorBar,
    ArticleContent,
    ArticleReplies
  }
})
export default class ArticleDetailPage extends Vue {
  private article = null
}
</script>

<style rel="stylesheet/scss" lang="scss">
.article-container {
  margin: 30px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
