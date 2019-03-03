<template>
  <div class='audio-publish-page'>
    <parrotman-editor />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import ParrotmanEditor from '@/components/ParrotmanEditor/index.vue'
import * as contentService from '@/services/content'

@Component({
  name: 'AudioPublishPage',
  components: {
    ParrotmanEditor
  }
})
export default class AudioPublishPage extends Vue {
  created() {
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
