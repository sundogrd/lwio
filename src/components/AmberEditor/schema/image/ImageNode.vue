<template>
  <div class="AmberSchemaImage-wrapper">
    <img :src="initialBlock.src" />
    <p class="AmberSchemaImage-caption">{{initialBlock.caption}}</p>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'ImageNode'
})
export default class ImageNode extends Vue {
  @Prop({ type: Object, required: true})
  public initialBlock!: any
}
</script>

<style lang="less">
.AmberSchemaImage-wrapper {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;

  .AmberSchemaImage-caption {
    color: #aaa;
  }
}
</style>
