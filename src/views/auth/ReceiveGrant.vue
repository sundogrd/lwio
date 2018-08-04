<template>
  <div class="app-wrapper">
    <p>receiveGrant</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'receiveGrant',
  components: {

  },
  computed: {},
  async mounted() {
    console.log(this)
    const { token } = this.$route.query
    this.setToken(token).then(res => {
      debugger
      if (res === true) {
        window.location.href = '/'
      }
    }).catch(e => {
      console.log(e)
    })

    // redirectToAuthorize(ctx)
  },
  methods: {
    ...mapActions([
      'setToken'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
