<template>
  <div class='article-page'>
    <header>
      <el-input v-model='title' placeholder='Please Input title' />
    </header>
    <amber-editor v-bind:markdown.sync='body' :hasMenubar='true' />
    <footer>
      <el-button @click='handleSubmit'>发表</el-button>
    </footer>
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
  private title = ''
  private body = ''
  public handleSubmit() {
    contentService.createContent({
      title: this.title,
      body: this.body,
      type: contentService.EType.TEXT,
      body_type: contentService.EBodyType.BODY_MARKDOWN
    }).then(res => {
      debugger
    }).catch(err => {
      debugger
    })
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
</style>
