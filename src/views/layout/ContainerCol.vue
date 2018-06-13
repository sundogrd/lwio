<template>
  <div class="container-col">
      <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'ContainerCol',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container-col {
    position: absolute;
    right: 0;
    min-height: 100%;
    background: #eaeaea;
    left: 300px;
  }
</style>
