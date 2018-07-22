<template>
  <div class="author-bar">
    <div class="avatar-block">
      <img src="//p1.pstatp.com/thumb/2c66000380eab7b3f040" />
    </div>
    <div class="info-block">
      <p class="name">梁王</p>
      <p class="caption">一个喜欢唱歌的死宅</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthorBar',
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
.author-bar {
  display: flex;
  .avatar-block {
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .info-block {
    p.name {
      color: rgba(0,0,0,.84);
    }
    p.caption {
      color: rgba(0,0,0,.54);
    }
  }
}
</style>
