<template>
  <span>
    footer
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg/index.vue'

@Component({
  name: 'CommentHeader',
  components: {
    IconSvg
  }
})
export default class SundogCommentHeader extends Vue {

}
</script>
<style lang="less" scoped>

</style>
