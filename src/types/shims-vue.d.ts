import { Route } from 'vue-router';
import Vue from 'vue'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $fullscreen: {
      toggle(...args: any): any
    }
    $route: Route
  }
}