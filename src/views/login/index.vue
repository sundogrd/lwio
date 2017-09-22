<template lang="html">
  <div class="">
    <div class="info">
      
    </div>
    <div id="particles-js"></div>
  </div>
</template>
 
<script>
  import { mapActions, mapGetters } from 'vuex'
  require('particles.js')
  export default {
    name: "login",
    data() {
      return {
      
      }
    },
    computed: {
      ...mapGetters({
        loginState: 'login'
      }),
    },
    watch: {
      loginState: function (val, oldVal) {
        if (val) {
          this.goMain()
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initParticleJS()
      })
      this.checkUrl()
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      checkUrl() {
        var vue = this
        if (vue.loginState) {
          vue.goMain()
        } else {
          if (vue.code) {
            vue.login(vue.oauthCode)
          }
        }
      },
      oauth() {
        var vue = this
        if (DEBUG) {
          vue.goMain()
        } else {
          var client_id = KEY_CONFIG.app_key;
          var redirect_uri = KEY_CONFIG.redirect_uri;
          var oauthUrl = HOST_CONCIG.oauth;
          window.open(oauthUrl + '?client_id=' + client_id + '&redirect_uri=' + redirect_uri, "_self", "", true)  ;
        }
      },
    }
  }
</script>
 
<style lang="scss" scoped>

#particles-js {
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>