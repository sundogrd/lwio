<template>
  <div :class="classObj" class="app-wrapper">
    <app-main/>
    <yuefu-player />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AppMain from "./components/app-main.vue";
import YuefuPlayer from './components/yuefu-player.vue';
@Component({
  name: "Layout",
  components: {
    AppMain,
    YuefuPlayer
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