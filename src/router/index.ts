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
    // console.log('in router: logging store...', store)
    // console.log('in router: logging isLogin', store.state.user.isLogin)
    // console.log('in router: logging meta', to.meta.myPages)
    // todo can I put reloadToken here??? No,dont reload token on every route!

    if (to.meta.myPages && !store.state.user.isLogin) {
      alert('need login but not, goto home')
      next({ path: '/' })
    }
    if (!to.meta.myPages && store.state.user.isLogin) {
      alert('already login, goto my')
      next({ path: '/my' })
    }
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  })

  return Router
})
