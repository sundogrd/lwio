<template>
    <div class="search-result-container">
      <content-brief-card
        v-for="content in contents"
        :key="content.content_id.toString()"
        :content="content"
      />
    </div>
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
.search-result-page {
  border-bottom: 1px solid #f0f2f7;
  .search-toolbar {
    padding: 20px;
    border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  }
}
</style>
