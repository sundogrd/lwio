<template>
  <div class="search-result-page">
    <tabs animation="slide" :only-fade="false" @tab-selected="handleTabSelected">
      <tab-pane label="article">
        <search-article-list></search-article-list>
      </tab-pane>
    </tabs>
  </div>
</template>

<script>
import { Tabs, TabPane } from '@/components/Tabs'
import SearchArticleList from './SearchArticleList.vue'
export default {
  components: {
    Tabs,
    TabPane,
    SearchArticleList
  },
  data () {
    return {
      currentTab: 'article',
      tabs: [{ key: 'article', name: '文章' }, { key: 'user', name: '用户' }]
    }
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  },
  methods: {
    handleTabSelected (key) {
      console.log('[Search-Result-Card] tab change: ', key)
    }
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
