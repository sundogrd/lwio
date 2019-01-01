<template>
  <div class="article-page">
    <amber-editor />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import AmberEditor from '@/components/AmberEditor/index.vue'

@Component({
  name: 'ArticleDetailPage',
  components: {
    AmberEditor
  }
})
export default class ArticlePublishPage extends Vue {
  private article = null
}
</script>

<style rel="stylesheet/scss" lang="less">
.article-publish-container {
  margin: 30px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
