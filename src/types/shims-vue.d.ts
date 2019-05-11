import { Route } from 'vue-router'
import Vue from 'vue'
import { ElMessage } from 'element-ui/types/message'

declare module '*.vue' {

  export default Vue
}

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $fullscreen: {
      toggle(...args: any): any
    }
    $route: Route
    $message: ElMessage
  }
}
