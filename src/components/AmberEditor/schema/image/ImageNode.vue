<template>
  <div class="AmberSchemaImage-wrapper">
    <img :src="initialBlock.src" />
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
