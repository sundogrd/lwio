<template>
  <div class="lw-card">
    <header class="lw-card__header">
      <slot name="header"></slot>
    </header>
    <main class="lw-card__main">
      <slot></slot>
    </main>
    <footer class="lw-card__footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'lw-card',
  props: {

  },
  data() {
    return {
    }
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.lw-card {
  border: 1px solid #ddd;
  background: #fff;
  transition: all .2s ease-in;
  margin-bottom: 30px;
}
</style>
