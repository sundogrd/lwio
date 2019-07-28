<template>
  <div id='sundog-comment'>
    <!-- {{store.test}} -->
    <comment-header></comment-header>
    <comment-list :comments="store.comments.list"></comment-list>
    <!-- <comment-footer></comment-footer> -->
  </div>
</template>

<script>
import CommentList from './components/list.vue'
import CommentHeader from './components/header.vue'
// import CommentFooter from './footer.vue'
import EventBus from './eventbus'
import mixins from './mixins'
const noop = () => {}
const listenerNames = ['reply', 'comment', 'gopage', 'gosubpage', 'like', 'hate', 'login']
export default {
  name: 'DumbComment',
  mixins: [mixins],
  props: {
    config: {
      type: Object,
      required: false
    },
    comments: {
      type: Object,
      required: true
    },
    targetId: {
      type: [String, Number],
      required: true
    },
    user: {
      type: Object,
      required: false,
      default: null
    }
  },
  components: { CommentList, CommentHeader },
  mounted () {
    this.initStore(this.targetId, this.config)
    // 初始化
    this.$emit('gopage', {
      page: 1,
      pageSize: this.config.pageSize,
      targetId: this.targetId
    })
    // 注册事件
    listenerNames.forEach(name => {
      EventBus.$on(name, (data) => {
        // console.log(name, data)
        this.$emit(name, data)
      })
    })
  },
  beforeDestroy () {
    EventBus.$off()
  },
  watch: {
    comments: {
      handler (n, o) {
        console.log('comments changed', n)
        this.refreshComments(n)
      },
      deep: true
    },
    user (n, o) {
      this.setUser(n || null)
    }
  }
}
</script>

<style lang='less' scoped>

</style>
