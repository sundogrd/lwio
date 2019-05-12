<template>
  <div class='recommend-section'>
    <recommend-content-card :contentBrief="{title: 'Making Sense of React Hooks', cover_url: 'https://cdn-images-1.medium.com/fit/c/800/240/1*_XMyHqfFSyw03BiNjBoV3Q.jpeg'}" :subtitle="'More from Sundogrd'"/>
    <recommend-content-card :contentBrief="{title: 'Making Sense of React Hooks', cover_url: 'https://cdn-images-1.medium.com/fit/c/800/240/1*_XMyHqfFSyw03BiNjBoV3Q.jpeg'}" :subtitle="'More from Sundogrd'"/>
    <recommend-content-card :contentBrief="{title: 'Making Sense of React Hooks', cover_url: 'https://cdn-images-1.medium.com/fit/c/800/240/1*_XMyHqfFSyw03BiNjBoV3Q.jpeg'}" :subtitle="'More from Sundogrd'"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import RecommandContentCard from './RecommendContentCard.vue'
@Component({
  name: 'RecommendSection',
  components: {
    RecommandContentCard
  }
})
export default class RecommendSection extends Vue {
  public async mounted () {
  }
}
</script>

<style rel='stylesheet/scss' lang='scss'>
.recommend-section {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
