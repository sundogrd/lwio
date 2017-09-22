<template>
  <header>
    <div class="topbar"></div>
    <nav>
      <a data-act-type="hover" class="item active">Index</a>
      <a class="item">Message</a>
      <a class="item">Recommend</a>
      <a class="item">Me</a>
    </nav>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Levelbar from './Levelbar';

  export default {
    components: {
      Levelbar,
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'user',
      ])
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  header {
    .topbar {
      height: 0.6rem;
    }
    nav {
      display: flex;
      a {
        display: block;
        position: relative;
        flex: 1;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        line-height: 0.6rem;
        transition: all 0.5s ease-in-out;
        &.active {
          color: #ff8200;
          font-size: 18px;
          &:after {
            content: ' ';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background: #ff8200;
          }
        }
      }
    }
  }
  

</style>



