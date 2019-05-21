<template>
  <div class="search-result-page">
    <div class="search-toolbar">
      <ul class="search-tabs">
        <page-tab
          v-for="tab in tabs"
          v-bind:key="tab.key"
          v-bind:tab="tab.name"
          v-on:selectTab="currentTab = tab.key"
        >
          {{ tab.name }}
        </page-tab>
      </ul>
    </div>
    <keep-alive>
      <tab-article v-if="currentTab == 'article'"></tab-article>
    </keep-alive>
  </div>
</template>

<script>
import PageTab from './page-tab'
import TabArticle from './tab-article'
import TabUser from './tab-user'
export default {
  components: {
    PageTab,
    TabArticle
    // TabUser
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
