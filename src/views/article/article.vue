<template>
  <div class="article-container">
    <lw-card v-if="article" class="article-detail">
      <template slot="header">
        <h1>{{article.title}}</h1>
        <time>
          <i class="icon-calendar icon"></i>
          {{article.created_at | formatTime}}
        </time>
      </template>
      <div class="article-entry" v-html="article.content"></div>
    </lw-card>
    <lw-card v-else>
      <p>loading</p>
    </lw-card>
  </div>
</template>

<script>
import { getArticle } from 'api/article'
import { mapGetters } from 'vuex';
export default {
  name: 'article-lwio',
  data() {
    return {
      article: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    getArticle(this.$route.params.articleId).then(res => {
      this.article = res;
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.article-container {
  margin: 30px;
}
.article-detail {
  .lw-card__header {
    border-left: 5px solid #4d4d4d;
    padding: 30px 0 15px 25px;
    padding-left: 7.6923%;
    h1 {
      display: inline-block;
      position: relative;
      margin-bottom: 10px;
      &::after {
        content: '';
        position: absolute;
        height: 2px;
        width: 100%;
        transform: scaleX(0);
        left: 0;
        bottom: 0;
        background: #000;
        transition: all 0.3s ease-in-out;
      }
      &:hover {
        cursor: pointer;
        &::after {
          transform: scaleX(1);
        }
      }
    }
    time {
      float: right;
      color: #999;
      margin-right: 7.6923%;
      float: right;
    }
  }
  .article-entry {
    padding: 30px 0 15px 25px;
    padding-left: 7.6923%;
  }
}
</style>
