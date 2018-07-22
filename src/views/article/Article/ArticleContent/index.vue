<template>
  <div class="article-content">
    <h1 class="article-title">{{ title }}</h1>
    <div class="article-html" v-html="contentHTML">
    </div>
    <ul class="article-tags">
      <li>
        Oauth
      </li>
    </ul>
  </div>
</template>

<script>
import marked from 'marked';
export default {
  name: 'ArticleContent',
  components: {
  },
  data() {
    return {
      title: '标题测试',
      contentMD: `# 欢迎使用 Cmd Markdown 编辑阅读器

------

我们理解您需要更便捷更高效的工具记录思想，整理笔记、知识，并将其中承载的价值传播给他人，**Cmd Markdown** 是我们给出的答案 —— 我们为记录思想和分享知识提供更专业的工具。 您可以使用 Cmd Markdown：`
    }
  },
  computed: {
    contentHTML() {
      return marked(this.contentMD, { sanitize: true })
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.article-content {
  h1.article-title {
    font-weight: 600;
    font-style: normal;
    letter-spacing: 0;
    font-size: 42px;
    margin-left: -2.63px;
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
