<template>
  <div class='search-page'>
    <div class='search-page-container'>
      <el-row :gutter='20'>
        <el-col :span='16'>
          <search-result-page />
        </el-col>
        <el-col :span='8'>
          <module-card />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SearchResultPage from './search-result-page.vue'
export default {
  components: {
    SearchResultPage
  },
  data: function () {
    return {
      greeting: 'Hello'
    }
  }
}
</script>

<style lang="less" scoped>
.search-page {
  background: #fafafa;
  min-height: 100vh;

  .search-page-container {
    padding: 30px 20px;
    margin: 0 auto;
    max-width: 960px;
  }
}
</style>
