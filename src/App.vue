<template>
	<div id="app">
		<router-view></router-view>
    <div class="login-modal" v-show="app.showLogin">
      <header>
        keke
      </header>
      <ul>
        <li @click="githubLogin">github</li>
      </ul>
      <footer></footer>
    </div>
    <div id="overlay" v-show="app.showLogin"></div>
	</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'APP',
    computed: {
      ...mapGetters([
        'app',
        'user',
      ])
    },
    mounted() {
      if(!this.user.accessToken && !this.app.showLogin) {
        this.$store.commit('TOGGLE_LOGIN_MODAL');
      }
      // TODO: a new page for oauth callback
      if(this.$route.query.code) {
        console.log(this.$route.query.code)
        // request backend
        this.$store.dispatch('GithubLogin', this.$route.query.code).then(() => {
          // window.close();
        })
      }
    },
    methods: {
      githubLogin: function() {
        window.open(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user:email`, 'githubLogin', 'width=400, height=300');
      }
    }
  }
</script>

<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式

  .login-modal {
    position: absolute;
    z-index: 1001;
    top: 50%;
    left: 50%;
    width: 300px;
    transform: translate(-50%,-50%);
    background: #fff;
    border: 1px solid #eeeeee;
    header {
      padding: 10px;
      border-bottom: 1px solid grey;
    }
    ul {
      padding: 10px;
      li {
        cursor: pointer;
      }
    }
  }
  #overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    filter: alpha(opacity=60);
    background: #777;
    opacity: 0.5;
  }
</style>
