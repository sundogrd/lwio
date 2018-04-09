<template>
  <article>
    <header class="article-header">
      <h1>{{article.title}}</h1>
      <time>
        <i class="icon-calendar icon"></i>
        2017-07-30
      </time>
    </header>
    <div class="article-brief">
      <p>{{article.brief}}</p>
    </div>
    <footer class="article-info">
      <div class="article-tag">
        <i class="icon-price-tags icon"></i>
        <ul class="article-tag-list">
          <li class="article-tag-list-item">
            <a>安全</a>
          </li>
        </ul>
      </div>
    </footer>
  </article>
</template>

<script>
export default {
  name: 'article-brief-card',
  props: {
    article: {
      type: Object,
      required: true,
      validator(article) {
        if (article.id && article.title && article.brief) {
          return true;
        }
        return false;
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  article {
    header {
      border-left: 5px solid #4d4d4d;
      padding: 30px 0 15px 25px;
      padding-left: 7.6923%;
      h1 {
        display: inline;
        margin-bottom: 10px;
      }
      time {
        float: right;
        color: #999;
        margin-right: 7.6923%;
        float: right;
      }
    }
    .article-brief {
      line-height: 1.8em;
      padding-right: 7.6923%;
      padding-left: 7.6923%;
    }
    footer {
      padding-top: 20px;
      margin: 30px 7.6923% 0;
      min-height: 72px;
      border-top: 1px solid #ddd;
      .article-tag {
        .icon {
          float: left;
        }
        ul.article-tag-list {
          li.article-tag-list-item {
            float: left;
            a {
              display: inline-block;
              background: #ba8f6c;
              text-decoration: none;
              font-weight: 400;
              font-size: 10px;
              color: #fff;
              height: 18px;
              line-height: 18px;
              float: left;
              padding: 0 5px 0 10px;
              position: relative;
              border-radius: 0 5px 5px 0;
              margin: 5px 9px 5px 8px;
              &:before {
                content: " ";
                position: absolute;
                width: 0;
                height: 0;
                top: 0;
                left: -18px;
                border: 9px solid transparent;
                border-right: 9px solid #ba8f6c;
              }
              &:after {
                content: " ";
                width: 4px;
                height: 4px;
                background-color: #fff;
                border-radius: 4px;
                box-shadow: 0 0 0 1px rgba(0,0,0,.3);
                position: absolute;
                top: 7px;
                left: 2px;
              }
            }
          }
        }
      }
    }
  }
  // article display style
  .article-brief {

  }
</style>
