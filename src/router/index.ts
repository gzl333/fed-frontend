import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { StateInterface } from '../store'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

let routerInstance

export default route<StateInterface>(function ({ store/*, ssrContext */ }) {
  const createHistory =
    process.env.SERVER
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory
        : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })

  Router.beforeEach((to, from, next) => {
    // todo /login为科技云通行证返回回调code的路由，应截取localhost:8080/login/callback?code=1111中的code，并取回token

    if (to.meta.myPages && !store.state.user.isLogin) {
      next({ path: '/' })
    }
    if (!to.meta.myPages && store.state.user.isLogin) {
      next({ path: '/my' })
    }
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })

  return Router
})

// exporting router instance
export { routerInstance }
