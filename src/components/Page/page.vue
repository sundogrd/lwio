<template>
    
</template>

<script>
  import { oneOf } from '../../utils/assist';
  import Options from './options.vue';
  import Locale from '../../mixins/locale';

  const prefixCls = 'ivu-page';

  export default {
    name: 'Page',
    mixins: [ Locale ],
    components: { Options },
    props: {
      current: {
        type: Number,
        default: 1,
      }
    },
    data () {
      return {
          
      };
    },
    watch: {
      
    },
    computed: {
        
    },
    methods: {
      changePage: function() {

      }
    }
  };
</script>
