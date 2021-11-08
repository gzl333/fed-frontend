import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { StateInterface } from '../store'
import routes from './routes'
import { Notify } from 'quasar'
import { i18n } from 'boot/i18n'

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
    const isLogin = store.state.account.items.isLogin // 当前登录状态
    // 此处截获科技云通行证返回的 /login?code=xxxx 部分
    // 未登录则获取code，换取token，进行登录
    if (to.fullPath.includes('/login?code=') && !isLogin) { // fullPath包括 path、 query 和 hash
      // 在科技云通行证处登录成功后，跳转至/login?code=xxxx。 此处截取code
      const code = to.fullPath.slice(12)
      // 利用code，在updatePassportToken中获取token并保存token，改变用户登录状态
      void await store.dispatch('account/cstLogin', code)
      // 开启定时更新token
      await store.dispatch('account/retainToken')
      // 跳转至内页
      next({ path: '/my' })
    } else if (to.fullPath.startsWith('/login') && isLogin) {
      // 已经登录，访问/login，重定向到/my
      next({ path: '/my' })
    } else if (to.meta.requireLogin && !isLogin) {
      // 要求登录的页面，如果没有登录，则返回home页面
      next({ path: '/' })
    } else if (to.fullPath === '/' && isLogin) {
      // home页面，如果已经登录了，则跳转到/my
      next({ path: '/my' })
    } else {
      // 之前都是登录状态有关的强制跳转。进入else后登录状态已经正常，进行页面访问权限的限制跳转

      // 云联邦管理员才能访问
      if (to.meta.requireFedAdmin && store.state.account.items.fedRole !== 'federal-admin') {
        // 跳转回上一个页面
        next(from.fullPath)
        // 弹出通知
        Notify.create({
          classes: 'notification-primary shadow-15',
          icon: 'mdi-alert-circle',
          textColor: 'primary',
          message: '访问目标页面需要联邦管理员权限',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }

      // 服务管理员才能访问
      if (to.meta.requireServiceAdmin && store.state.account.items.vmsAdmin.length === 0) {
        // 跳转回上一个页面
        next(from.fullPath)
        // 弹出通知
        Notify.create({
          classes: 'notification-primary shadow-15',
          icon: 'mdi-alert-circle',
          textColor: 'primary',
          message: '访问目标页面需要服务管理员权限',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    }

    // 修改页面标题，与跳转无关，每个页面都做，所以不在上面的逻辑里。
    if (to.meta.title) {
      if (i18n.global.locale === 'zh') {
        document.title = to.meta.title as string // 中文
      } else {
        document.title = to.meta.title_en as string || to.meta.title as string // 英文, fallback to 中文
      }
    }

    // // 进入vmcreate和quota_apply前打开footer
    // if (to.fullPath.includes('/vmcreate') || to.fullPath.includes('/quota_apply')) {
    //   store.commit('account/openFooter')
    // } else {
    //   // 进入非上述两个页面时关闭footer
    //   store.commit('account/closeFooter')
    // }

    next()
  })

  return Router
})

// exporting router instance
export { routerInstance }
