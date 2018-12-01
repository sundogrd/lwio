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

<script>
import { mapGetters } from 'vuex';
import DetailHeader from './DetailHeader'
import DetailFooter from './DetailFooter'
import AuthorBar from './AuthorBar'
import ArticleContent from './ArticleContent'
import ArticleReplies from './ArticleReplies'

export default {
  name: 'article-lwio',
  components: {
    DetailHeader,
    DetailFooter,
    AuthorBar,
    ArticleContent,
    ArticleReplies
  },
  data() {
    return {
      article: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
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
