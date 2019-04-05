<template>
  <div class='article-page' sticky-container>
    <!-- <button v-sticky sticky-offset='30' sticky-side='bottom' :click='fullScreen'>Great</button> -->
    <detail-header />
    <transition-group name='fade' mode='out-in'>
      <div class='article-container' key='article-container'>
        <article-content :article='article' />
      </div>
    </transition-group>
    <div class='graylight-bg'>
      <!-- <recommend-section /> -->
      <article-replies />
    </div>
    <detail-footer />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as contentService from '@/services/content'
import * as logService from '@/services/log'
import DetailHeader from './DetailHeader.vue'
import DetailFooter from './DetailFooter.vue'
import ArticleContent from './ArticleContent/index.vue'
import ArticleReplies from './ArticleReplies/index.vue'
import RecommendSection from './RecommendSection/index.vue'

@Component({
  name: 'ArticleDetailPage',
  components: {
    DetailHeader,
    DetailFooter,
    ArticleContent,
    ArticleReplies,
    RecommendSection
  }
})

export default class ArticleDetailPage extends Vue {
  private article: contentService.ContentInfo | null = null
  public async  mounted() {
    const contentId = this.$route.params.articleId;
    const res = await contentService.getContentById({contentId: contentId})
    this.article = res
  }
  // fullScreen() {
  //   this.$fullscreen.toggle(this.$el.querySelector('.example'), {
  //     wrap: false,
  //     callback: null,
  //   })
  // }
}
</script>

<style lang='less'>
.article-container {
  margin: 20px auto;
  max-width: 980px;
  padding-left: 20px;
  padding-right: 20px;
}

.graylight-bg {
  background: #fafafa;
}
</style>
