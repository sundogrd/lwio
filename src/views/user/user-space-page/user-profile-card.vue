<template>
  <module-card class='user-profile-card'>
    <div class='avatar' :style='avatarStyle' />
    <div class='info-box'>
      <div class='top'>
        <h1 class='username'>梁王</h1>
      </div>
      <div class='position'><span class='content'><span>web前端工程师</span><span class="split"></span><span>宇宙条</span></span></div>
      <div class='intro'><span class='content'>RGVhZCBob3VzZQ==</span></div></div>
    </div>
    <div class='action-box'>

    </div>
  </module-card>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import ModuleCard from '../../../components/ModuleCard/index.vue'
// import IconSvg from '../../../components/IconSvg/index.vue'

@Component({
  name: 'UserProfileCard',
  components: {
    ModuleCard,
    // IconSvg
  }
})
export default class UserProfileCard extends Vue {
  avatarStyle = {
    backgroundImage: 'url("https://avatars1.githubusercontent.com/u/9214496?v=4")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50%'
  }
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-profile-card {
  display: flex;
  padding: 30px;

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin-right: 28px;
  }

  .info-box {
    font-size: 15px;
    line-height: 1.5;
    color: #72777b;
  }

  .split {
    display: inline-block;
    margin: 0 0.5em;
    width: 1px;
    height: 0.7em;
    background-color: #72777b;
    opacity: 0.5;
  }
}
</style>
