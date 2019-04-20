<template>
  <div class='user-space-page'>
    <div class='user-space-container'>
      dsa
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'UserSpaceAudio',
  components: {
  }
})
export default class UserSpaceAudio extends Vue {
  
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-space-page {
  background: #fafafa;
  min-height: 100vh;

  .user-space-container {
    padding: 30px 20px;
    margin: 0 auto;
    max-width: 960px;
  }
}
</style>
