<template>
  <div class="index-page" sticky-container>
    I am index
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { mapGetters } from 'vuex'

@Component({
  name: 'IndexPage',
  components: {
  }
})

export default class IndexPage extends Vue {
  public mounted() {
    
  }
  // fullScreen() {
  //   this.$fullscreen.toggle(this.$el.querySelector('.example'), {
  //     wrap: false,
  //     callback: null,
  //   })
  // }
}
</script>

<style lang="less">
.index-page {
  margin: 20px auto;
  max-width: 740px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
