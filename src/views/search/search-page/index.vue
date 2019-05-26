<template>
  <div class='search-page'>
    <div class='search-page-container'>
      <el-row :gutter='20'>
        <el-col :span='16'>
          <search-result-card />
        </el-col>
        <el-col :span='8'>
          <module-card />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import SearchResultCard from './search-result-card'
export default {
  components: {
    SearchResultCard
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
    /deep/.tabs {
      padding: 20px;
      border-bottom: 1px solid #f0f2f7;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      [role="tab"] {
        &.is-active {
          color: #007fff;
        }
      }
    }
  }
}
</style>
