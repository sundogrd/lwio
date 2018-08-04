<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'APP',
    computed: {
      ...mapGetters([
        'app',
        'user'
      ])
    },
    mounted() {
      console.log('keke')
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
