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
    <div class="comment-wrapper">
      <sundog-comment :comment="comment"></sundog-comment>
    </div>
    <detail-footer />
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as SundogDataTypes from '@/types/api.d.ts'
import * as contentService from '@/services/content'
import * as logService from '@/services/log'
import DetailHeader from './DetailHeader.vue'
import DetailFooter from './DetailFooter.vue'
import ArticleContent from './ArticleContent/index.vue'
import ArticleReplies from './ArticleReplies/index.vue'
import RecommendSection from './RecommendSection/index.vue'
import SundogComment from '@/components/Comment/index.vue'

@Component({
  name: 'ArticleDetailPage',
  components: {
    DetailHeader,
    DetailFooter,
    ArticleContent,
    ArticleReplies,
    RecommendSection,
    SundogComment
  }
})

export default class ArticleDetailPage extends Vue {
  private article: contentService.ContentInfo | null = null
  public async mounted () {
    const contentId = this.$route.params.articleId
    const res = await contentService.getContentById({ contentId: contentId })
    this.article = res
  }

  public comment: SundogDataTypes.Comment = {
    id: '12232323',
    creator: {
      nick: 'luffylv',
      img_url: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4',
      id: '2323211'
    },
    target_id: '122323',
    like: 23,
    hate: 12,
    floor: 1,
    extra: {
      platform: '客户端'
    },
    create_time: 1556812800000,
    content: '这是一条测试评论，不用管他哈哈哈哈啊哈哈哈哈哈哈。。。。'
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
