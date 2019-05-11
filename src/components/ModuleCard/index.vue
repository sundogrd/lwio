<template>
  <div class='module-card'>
    <slot name='header'></slot>
    <slot></slot>
    <slot name='footer'></slot>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'ModuleCard'
})
export default class ModuleCard extends Vue {
}
</script>

<style lang='scss'>
.module-card {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>
