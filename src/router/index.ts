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
    scrollBehavior: () => ({
      left: 0,
      top: 0
    }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    )
  })

  Router.beforeEach(async (to, from, next) => {
    // 此处截获科技云通行证返回的 /login?code=xxxx 部分
    // 未登录则获取code，换取token，进行登录
    if (to.fullPath.startsWith('/login?code=') && !store.state.user.isLogin) {
      // 在科技云通行证处登录成功后，跳转至/login?code=xxxx。 此处截取code
      const code = to.fullPath.slice(12)
      // 利用code，在updatePassportToken中获取token并保存token，改变用户登录状态
      void await store.dispatch('user/loginCstUser', code)
      // 开启定时更新token
      await store.dispatch('user/retainCstToken')
      // console.log(store.state.user)
      // 跳转至内页
      next({ path: '/my' })
    }
    // 已经登录，访问/login，重定向到/my
    if (to.fullPath.startsWith('/login') && store.state.user.isLogin) {
      next({ path: '/my' })
    }

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
