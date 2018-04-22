<template>
  <div class="app-wrapper">
    <!-- <app-shell>
      <header>
        <el-button> </el-button>
        <input type="file" />
      </header>
    </app-shell> -->
    <personal-col></personal-col>
    <container-col></container-col>
  </div>
</template>

<script>
  import { PersonalCol, ContainerCol } from 'views/layout';

  export default {
    name: 'layout',
    components: {
      PersonalCol,
      ContainerCol
    },
    computed: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 100vh;
    width: 100%;
    .personal-col {
      
    }
    .container-col {
      background-color: #f8f9fa;
      flex: 1;
      overflow: auto;
      transition: all .28s ease-out;
    }
  }
</style>
