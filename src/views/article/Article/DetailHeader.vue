<template>
  <div class="detail-header">
    <div class="detail-header-container">
      <button>Upgrade</button>
      <h1>Lwio</h1>
      <div class="user-navbar">
        <div class="avatar">
          <img src="https://cdn-images-1.medium.com/fit/c/64/64/0*ti5WHj3RjXeMBKCT." class="avatar-image" alt="Pearce Liang">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailHeader',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detail-header {
  position: sticky;
  top: 0px;
  background: #fff;
  box-shadow: 0 2px 2px -2px rgba(0,0,0,.15);

  &-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
    button {
      height: 50px;
      width: 100px;
    }
    h1 {
      margin: 0;
    }
    .user-navbar {

    }
  }
}
</style>
