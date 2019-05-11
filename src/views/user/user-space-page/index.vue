<template>
  <div class='user-space-page'>
    <div class='user-space-container'>
      <el-row :gutter='20'>
        <el-col :span='16'>
          <user-profile-card />
          <user-list-block />
        </el-col>
        <el-col :span='8'>
          <user-achivement-card />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import UserAchivementCard from './user-achivement-card.vue'
import UserProfileCard from './user-profile-card.vue'
import UserListBlock from './user-list-block/index.vue'

@Component({
  name: 'UserSpacePage',
  components: {
    UserProfileCard,
    UserAchivementCard,
    UserListBlock
  }
})
export default class UserSpacePage extends Vue {

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
