<template>
  <div :class="classObj" class="app-wrapper">
    <app-header/>
    <app-main/>
    <yuefu-player />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppHeader from './components/app-header.vue';
import AppMain from "./components/app-main.vue";
import YuefuPlayer from './components/yuefu-player.vue';
@Component({
  name: "Layout",
  components: {
    AppMain,
    YuefuPlayer,
    AppHeader
  }
})
export default class Layout extends Vue {
  get classObj() {
    return {}
  }
}
</script>

<style lang="less">
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>