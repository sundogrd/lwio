<template>
  <div class="index-container">
    <div class="articles">
      <article-brief-card v-for="article in articles" :key="article.id" :article="article" />
    </div>
    <footer id="footer">
      <div class="license">
        © 2017-2018 Lwio
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getArticles } from 'api/article'
import ArticleBriefCard from './ArticleBriefCard';
export default {
  name: 'index',
  components: {
    'article-brief-card': ArticleBriefCard
  },
  data() {
    return {
      articles: null,
      pagination: {
        current: 1,
        limit: 20,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  async mounted() {
    const { list } = await getArticles()
    this.articles = list
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .articles {
    margin: 30px;
    position: relative;
    
  }
  #footer {
    font-size: 12px;
    text-shadow: 0 1px #fff;
    bottom: 30px;
    opacity: .6;
    padding: 0 30px;
    width: 100%;
    text-align: center;
    .license {
      float: left;
    }

  }
</style>
