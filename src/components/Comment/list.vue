<template>
  <div class='comment-list'>
    <comment-item :isLogin="$parent.user ? true : false" v-for="(comment,idx) in comments" :comment="comment" :key="idx"></comment-item>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import CommentItem from './item.vue'
import { Comment, CommentCreator } from './types/comment'

@Component({
  name: 'CommentList',
  components: {
    CommentItem
  }
})
export default class SundogCommentList extends Vue {
  @Prop({ required: true, default: [] })
  public comments!: Comment[]
}
</script>

<style lang='less' scoped>
</style>
