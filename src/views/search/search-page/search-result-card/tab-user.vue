<template>
  <div class="search-result-container">
    <content-brief-card
      v-for="user in users"
      :key="user.id"
      :content="user.name"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      users: [{ id: 0, name: 'hanzc' }, { id: 1, name: 'lw' }]
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
