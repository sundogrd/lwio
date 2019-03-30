<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "AppMain",
})
export default class AppMain extends Vue {
  get key() {
    return this.$route.fullPath
  }
}
</script>

<style lang="less">
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh);
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>