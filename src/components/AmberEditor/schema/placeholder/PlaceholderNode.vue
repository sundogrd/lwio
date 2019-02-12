<template>
  <div class="AmberSchemaPlaceholder-wrapper">
    <img :src="require('./loading.gif')" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'PlaceholderNode'
})
export default class PlaceholderNode extends Vue {
  @Prop({ type: Object, required: true})
  public initialBlock!: any
}
</script>

<style lang="less">
.AmberSchemaPlaceholder-wrapper {
  text-align: center;

  img {
    width: 100px;
  }
}
</style>
