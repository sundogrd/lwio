<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'IconSvg'
})
export default class IconSvg extends Vue {
  @Prop({ type: String, required: true })
  public iconClass!: string

  get iconName () {
    return `#icon-${this.iconClass}`
  }
}
</script>
