<template>
  <div class="personal-col">
    <a href="null" class="profilepic">
      <img src="https://avatars2.githubusercontent.com/u/9214496?v=4&s=460" class="js-avatar">
    </a>
    <hgroup>
      <h1 class="header-author"><a href="null">Lwio</a></h1>
    </hgroup>
    <p class="header-subtitle">A salty fish</p>
    <nav class="header-menu">
      <ul>
        <li><a href="/">Homepage</a></li>
        <li><a href="/tools/file-manager">file manager</a></li>  
      </ul>
    </nav>
    <nav class="header-nav">
      <button class="pan-btn tiffany-btn" @click="$router.push('/article/publish')">New Blog</button>
      <div class="social">
        <a class="github" target="_blank" href="https://github.com/lwio" title="github"><i class="icon-github"></i></a>
      </div>
    </nav> 
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    components: {
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .personal-col {
    background: #fff;
    width: 300px;
    position: fixed;
    opacity: 1;
    transition: all .2s ease-in;
    padding: 112px 0;
    height: 100%;
    text-align: center;
    background: linear-gradient(#4d4d4d, #4d4d4d 176px, #ffffff 176px, #ffffff);
    z-index: 999;
  }
  a.profilepic {
    display: block;
    border: 5px solid #fff;
    border-radius: 300px;
    width: 128px;
    height: 128px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    background: #88acdb;
    transition: all .2s ease-in;
    img {
      height: 100%;
      width: 100%;
    }
  }

  hgroup {
    h1.header-author {
      margin: 40px 0;
      color: #1a1a1a;
    }
  }
  nav.header-nav {
    button {
      margin: 10px;
    }
  }
</style>



