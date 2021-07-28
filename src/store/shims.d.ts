// try to solve the type problem in actions and mutations, not working now
// https://forum.quasar-framework.org/topic/6310/typescript-error-when-using-this-router-in-actions-ts/3

import { Router } from 'vue-router/dist/vue-router'

declare module 'vue/dist/vue/' {
  interface Vue {
    $router: Router
  }
}
