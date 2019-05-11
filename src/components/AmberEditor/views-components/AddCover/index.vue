<template>
  <button class='add-cover' @click='handleAddImage'>Add Image</button>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject } from 'vue-property-decorator'
@Component({
  name: 'AddCover'
})
export default class AddCover extends Vue {
  hasCover = false

  @Inject() store!: any

  mounted () {
    this.store.on('plugin.contenthints', this.updateHints)
  }
  destroyed () {
    this.store.off('plugin.contenthints', this.updateHints)
  }

  public updateHints (hints: any) {
    this.hasCover = hints.hasCover
  }
  public handleAddImage () {
    this.store.routeChange('ADD_IMAGE_TOP')
  }
}
</script>

<style lang='less'>
.add-cover {
  button {
    text-transform: 'uppercase';
    border-radius: 4px;
    padding: 10px 16px;
    margin: 0.25em 0.5em;
  }
}
</style>
