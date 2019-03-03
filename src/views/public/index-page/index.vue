<template>
  <div class='index-page' sticky-container>
    I am index
    <el-button @click="handleGoDetailDemo">Content Detail</el-button>
    <el-button @click="handleGoPublishDemo">Content Publish</el-button>
    <el-button @click="handleGoUserSpaceDemo">Content List(User Space)</el-button>
    <el-button @click="handleGoAudioPublishDemo">Audio Publish</el-button>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'

@Component({
  name: 'IndexPage',
  components: {
  }
})

export default class IndexPage extends Vue {
  public mounted() {
    
  }
  handleGoDetailDemo () {
    this.$router.push({name: "articleDetailPage", params: {articleId: '309464524321198080'}})
  }
  handleGoPublishDemo () {
    this.$router.push({name: "articlePublishPage"})
  }
  handleGoUserSpaceDemo () {
    this.$router.push({name: "userSpacePage", params: {userId: 'lwyj123'}})
  }
  handleGoAudioPublishDemo () {
    this.$router.push({
      name: "audioPublishPage",
    })
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
.index-page {
  margin: 20px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
