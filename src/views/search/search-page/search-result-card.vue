<template>
  <module-card class='search-result-card'>
    <div class="search-toolbar">
      <ul class="search-tabs">
        <li>文章</li>
        <li>用户</li>
      </ul>
    </div>
    <div class="search-result-container">
      <content-brief-card v-for="content in contents" :key="content.content_id.toString()" :content="content" />
    </div>
  </module-card>
</template>

<script>
import * as contentService from '@/services/content'
import ContentBriefCard from '@/components/Cards/ContentBriefCard'
export default {
  components: {
    ContentBriefCard
  },
  data () {
    return {
      contents: null
    }
  },
  async mounted () {
    const res = await contentService.getContents({})
    this.contents = res.list
  }
}
</script>

<style lang="less" scoped>
.search-result-card {
  border-bottom: 1px solid #f0f2f7;
  .search-toolbar {
    padding: 20px;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  }
}
</style>
