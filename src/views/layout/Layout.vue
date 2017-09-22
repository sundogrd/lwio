<template>
  <div class="app-wrapper">
    <personal-col></personal-col>
    <div class="container-col">
      <container-col></container-col>
    </div>
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
