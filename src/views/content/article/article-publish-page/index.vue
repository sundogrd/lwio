<template>
  <div class='article-page publish-page'>
    <header>
      <!-- <el-input v-model='title' placeholder='Please Input title' /> -->
      <div class="publish-header">
        <div class="logo"></div>
        <div class="status-text">文章将会保存到<a>草稿</a></div>
        <div class="header-operations">
            <div class="operation-btn">
                <span @click="handleSubmit">发布</span>
                <i class="icon"></i>
            </div>
            <div class="operation-panel"></div>
        </div>
        <div class='avatar' @click='handleGoUserSpace'>
          <img src='https://cdn-images-1.medium.com/fit/c/64/64/0*ti5WHj3RjXeMBKCT.' class='avatar-image' alt='Pearce Liang'>
        </div>
      </div>
    </header>
    <textarea placeholder="输入标题..." spellcheck="false" maxlength="80" rows="1" class="publish-title" v-model="title"></textarea>
    <amber-editor class="publish-editor" :initialMarkdown='body' :hasMenubar='true' @change='handleBodyChange' />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import AmberEditor from '@/components/AmberEditor/index.vue'
import * as contentService from '@/services/content'

@Component({
  name: 'ArticleDetailPage',
  components: {
    AmberEditor
  }
})
export default class ArticlePublishPage extends Vue {
  private article = null
  private title: string = ''
  private body: string = ''
  created () {
  }
  public handleSubmit () {
    if (this.title === '' || this.body === '') {
      this.$message.error('请输入title和body')
      return
    }
    contentService.createContent({
      title: this.title!,
      body: this.body!,
      type: contentService.EType.TEXT,
      body_type: contentService.EBodyType.BODY_MARKDOWN
    }).then(res => {
      this.$router.push({ name: 'articleDetailPage', params: { articleId: res.content_id } })
    }).catch(err => {
      this.$message.error(err.data.msg)
    })
  }
  public handleBodyChange (content: {markdown: string, doc: any}) {
    this.body = content.markdown
  }

  public handleGoUserSpace () {
    this.$router.push({ name: 'userSpacePage', params: { userId: '304012802987667460' } })
  }
}
</script>

<style rel='stylesheet/scss' lang='less'>
.article-publish-container {
  margin: 30px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}

.publish-page {
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;
    border-bottom: none;
    z-index: 100;
    max-width: 1000px;
    margin: 0 auto;
  }
  .publish-title {
    padding: 0;
    font-size: 28px;
    font-weight: 700;
    color: #000;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    position: relative;
    max-width: 856px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
    padding-left: 40px;
    top: 116px;
    height: initial;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .publish-header {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: 83.334rem;
    max-width: 100%;
    height: 100%;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-left: 30px;
      img {
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }
    }
    .logo {
      position: relative;
      margin: 0 auto 0 0;
      width: 3.067rem;
      height: 3.067rem;
      background: 50% no-repeat;
      background-size: contain;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAjVBMV…RS3bfRSan1waGZMVXwctmrrKdPqhgt0jnVtBa+DwMDA3r8A41Ik44EoNuxAAAAAElFTkSuQmCC);
    }
    .status-text {
      font-size: 18px;
      white-space: nowrap;
      color: #ddd;
      cursor: default;
      user-select: none;

      a {
        margin: 0 0 0 6px;
        padding: 3px 6px;
        color: inherit;
        text-decoration: none;
        border: 1px solid currentColor;
        border-radius: 2px;
      }
    }
    .header-operations {
      user-select: none;
      margin-left: 60px;
      .operation-btn {
        font-size: 20px;
        white-space: nowrap;
        color: #007fff;
        cursor: pointer;
        user-select: none;
        span {
          font-size: 18px;
          white-space: nowrap;
          color: #007fff;
          cursor: pointer;
          user-select: none;
        }
        .icon {
          margin-left: 6px;
        }
      }
    }
  }
  .publish-editor {
    margin-top: 120px;
    .ProseMirror {
      height: calc(100vh - 184px);
    }
    .ProseMirror-content {
      margin-bottom: 0;
      padding-bottom: 0;
      padding-top: 0;
      // margin-top: 30px;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .ProseMirror-menubar {
      position: fixed;
      top: 76px;
      z-index: 100;
      max-width: 856px;
      margin: 0 auto;
      padding: 0 1rem 0 2rem;
    }
  }
}
</style>
