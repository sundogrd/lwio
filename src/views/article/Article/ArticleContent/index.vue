<template>
  <div class="article-content">
    <h1 class="article-title">{{ title }}</h1>
    <div class="article-html" v-html="contentHTML">
    </div>
    <ul class="article-tags">
      <li v-for="(tag, index) in tags" :key="index">
        {{ tag }}
      </li>
    </ul>
  </div>
</template>

<script>
import marked from 'marked';
import { getArticle } from 'api/article';
export default {
  name: 'ArticleContent',
  components: {
  },
  data() {
    return {
      title: 'Loading...',
      contentMD: 'Loading...'
    }
  },
  computed: {
    contentHTML() {
      return marked(this.contentMD, { sanitize: true })
    }
  },
  methods: {
  },
  async mounted() {
    const res = await getArticle(this.$route.params.articleId)
    this.title = res.title
    this.contentMD = res.content_md
    this.tags = res.tags
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.article-content {
  h1.article-title {
    border-bottom: 1px solid;
    margin: 0 0 50px 0;
    padding: 20px 0;

    font-weight: 600;
    font-style: normal;
    letter-spacing: 0;
    font-size: 42px;
    line-height: 1.04;
    letter-spacing: -.015em;
  }
  .article-html {
    margin-bottom: 30px;
    h1 {
      font-size: 35px;
    }
    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 26px;
    }
    h4,h5,h6 {
      font-size: 22px;
    }
    p {
      margin-top: 10px;

      font-weight: 400;
      font-style: normal;
      font-size: 21px;
      line-height: 1.58;
      letter-spacing: -.003em;
    }
    blockquote {
      margin-top: 29px;

      font-weight: 400;
      font-style: italic;
      font-size: 21px;
      line-height: 1.58;
      letter-spacing: -.003em;
    }
  }
  ul.article-tags {
    li {
      display: inline-block;
      position: relative;
      border: none;
      padding: 5px 10px;
      margin-right: 20px;
      color: rgba(0,0,0,.68);
      background: rgba(0,0,0,.05);
      
      &:hover {
        cursor: pointer;
        background: rgba(0,0,0,.1);
        color: rgba(0,0,0,.68);
      }
    }
  }
}
</style>
