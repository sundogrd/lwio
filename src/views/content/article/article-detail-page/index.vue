<template>
  <div class="article-page" sticky-container>
    <!-- <button v-sticky sticky-offset="30" sticky-side="bottom" :click="fullScreen">Great</button> -->
    <detail-header  />
    <transition-group name="fade" mode="out-in">
      <div class="article-container" key="article-container">
        <article-content />
      </div>
    </transition-group>
    <div class="graylight-bg">
      <recommend-section />
      <article-replies />
    </div>
    <detail-footer />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'
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
  private article = null
  public mounted() {
    
  }
  // fullScreen() {
  //   this.$fullscreen.toggle(this.$el.querySelector('.example'), {
  //     wrap: false,
  //     callback: null,
  //   })
  // }
}
</script>

<style rel="stylesheet/scss" lang="less">
.article-container {
  margin: 20px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}

.graylight-bg {
  background: #fafafa;
}
</style>
