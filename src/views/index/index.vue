<template>
  <div class="index-container">
    asd
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'index',
    data() {
      return {
        
      }
    },
    computed: {
      ...mapGetters([
        'user',
      ])
    },
    created() {
    }
  }
</script>

