<template>
  <div class='comment-list'>
    <comment-item v-for="(comment,idx) in comments" :comment="comment" :key="idx"></comment-item>
  </div>
</template>

<script >
import CommentItem from './item.vue'
import mixins from '../mixins'
export default {
  mixins: [mixins],
  name: 'CommentList',
  props: ['comments'],
  components: {
    CommentItem
  }
}
</script>

<style lang='less' scoped>
</style>
