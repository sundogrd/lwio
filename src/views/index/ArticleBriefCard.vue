<template>
  <lw-card class="article-brief-card">
    <template slot="header">
      <h1 @click="$router.push({path: `/article/${article.id}`})">{{article.title}}</h1>
      <time>
        <i class="icon-calendar icon"></i>
        {{article.created_at | formatTime}}
      </time>
    </template>
    <div class="article-brief">
      <p>{{article.brief}}</p>
    </div>
    <template slot="footer">
      <div class="article-tag">
        <ul class="article-tag-list clearfix">
          <li v-for="tag in article.tags" :key="tag" class="article-tag-list-item">
            <a>{{tag}}</a>
          </li>
        </ul>
      </div>
      <span class="pv">阅读量 {{article.read_count}}</span>
    </template>
  </lw-card>
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
    console.log(this)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.article-brief-card {
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
  .lw-card__main {
    line-height: 1.8em;
    padding-right: 7.6923%;
    padding-left: 7.6923%;
  }
  .lw-card__footer {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    margin: 30px 7.6923% 0;
    min-height: 72px;
    border-top: 1px solid #ddd;
    .pv {
      color: #777;
      font-size: 14px;
    }
    .article-tag {
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
</style>
