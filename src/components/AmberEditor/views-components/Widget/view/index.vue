<template>
  <div :class="componentClass">
    <div class="WidgetView-description">

    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'Widget'
})
export default class Widget extends Vue {
  @Prop({ type: Object, required: true })
  public initialBlock!: any

  @Prop({ type: String, required: false })
  public subtitle?: string

  public get componentClass () {
    return `WidgetView WidgetView-${this.initialBlock.type}`
  }
}
</script>

<style lang='less'>
.WidgetView {
  border: 1px solid silver;
  border-radius: 2px;
  padding: 1rem;
  background-color: white;
  white-space: normal;
}
</style>
