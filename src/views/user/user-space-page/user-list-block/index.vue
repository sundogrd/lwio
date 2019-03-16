<template>
  <div class='user-list-block'>
    <user-nav-header />
    <router-view />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import ModuleCard from '../../../../components/ModuleCard/index.vue'
import IconSvg from '../../../../components/IconSvg/index.vue'
import UserNavHeader from './user-nav-header/index.vue';

@Component({
  name: 'UserListBlock',
  components: {
    ModuleCard,
    IconSvg,
    UserNavHeader,
  }
})
export default class UserListBlock extends Vue {
  
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-list-block {
  margin-top: 10px;
}
</style>
