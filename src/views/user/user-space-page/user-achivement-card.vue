<template>
  <module-card class='user-achivement-card'>
    <h1 slot='header'>个人成就</h1>
    <div class='stat-list'>
      <div class='stat-item'>
        <icon-svg iconClass="thumbup" />
        <span>获得鼓掌<span class='count'>{{clapCount}}</span>次</span>
      </div>
    </div>
  </module-card>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import ModuleCard from '../../../components/ModuleCard/index.vue'
import IconSvg from '../../../components/IconSvg/index.vue'
import * as logService from '@/services/log'

@Component({
  name: 'UserAchivementCard',
  components: {
    ModuleCard,
    IconSvg
  }
})
export default class UserAchivementCard extends Vue {
  clapCount: number = 0
  public async mounted () {
    const userId = '23232' // this.$route.params.userId;
    const logRes = await logService.getStatementById({ userId })
    this.clapCount = logRes.count
  }
}
</script>

<style rel='stylesheet/scss' lang='less'>
.user-achivement-card {
  h1 {
    padding: 1.333rem;
    border-bottom: 1px solid rgba(230, 230, 231, 0.5);
    font-size: 1.333rem;
    font-weight: 600;
    color: #31445b;
  }

  .stat-list {
    padding: 1.333rem;

    .stat-item {
      .count {
        margin: 0 0.3em;
        font-weight: 500;
      }
    }
  }
}
</style>
