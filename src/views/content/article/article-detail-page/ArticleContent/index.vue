<template>
  <div class='article-content'>
    <h1 class='article-title'>{{ (article && article.title) || 'default title' }}</h1>
    <author-bar :author='article.author' />
    <div class='article-html' v-html='contentHTML'>
    </div>
    <side-bar :sidebar="sidebar"></side-bar>
    <ul class='article-tags'>
      <li v-for='(tag, index) in tags' :key='index'>
        {{ tag }}
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import AuthorBar from './AuthorBar.vue'
import SideBar from './SideBar.vue'
import * as contentService from '@/services/content'
import * as userService from '@/services/user'
import * as logService from '@/services/log'
import marked from 'marked'
import { SideBarOption } from './SideBar.vue'
@Component({
  name: 'ArticleContent',
  components: {
    AuthorBar,
    SideBar
  }
})
export default class ArticleDetailPage extends Vue {
  public tags: string[] = []
  public title = 'Loading...'
  public contentMD = 'Loading'
  public sidebar: SideBarOption = {clap: 0}

  @Prop(Object) article!: contentService.ContentInfo & {
    author: userService.UserInfo
  }

  get contentHTML () {
    return marked(this.article.body, { sanitize: true })
  }
  public async mounted () {
    const contentId = this.$route.params.articleId;
    const logRes = await logService.getStatementById({ contentId })
    this.sidebar.clap = 23
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.article-content {
  h1.article-title {
    margin: 0;
    padding: 16px 0 0 0;
    font-family: medium-content-title-font, Georgia, Cambria, 'Times New Roman', Times, serif;
    font-weight: 400;
    font-style: normal;
    font-size: 42px;
    line-height: 1.04;
    letter-spacing: -0.015em;
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

    h4,
    h5,
    h6 {
      font-size: 22px;
    }

    p {
      margin-top: 10px;
      font-weight: 400;
      font-style: normal;
      font-size: 21px;
      line-height: 1.58;
      letter-spacing: -0.003em;
    }

    blockquote {
      margin-top: 29px;
      font-weight: 400;
      font-style: italic;
      font-size: 21px;
      line-height: 1.58;
      letter-spacing: -0.003em;
    }
  }

  ul.article-tags {
    li {
      display: inline-block;
      position: relative;
      border: none;
      padding: 8px 10px;
      font-size: 13px;
      margin-right: 10px;
      border-radius: 5px;
      color: rgba(0, 0, 0, 0.68);
      background: rgba(0, 0, 0, 0.05);

      &:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, 0.68);
      }
    }
  }
}
</style>
