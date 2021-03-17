import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import {
  TokenInterface,
  UserInterface,
  CstJwtInterface
} from './state'
import { Notify } from 'quasar'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

// const apiBaseDev = 'http://gosc.cstcloud.cn/api' // 'api_dev'
// const apiBaseProd = 'http://gosc.cstcloud.cn/api'
// const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev

// 科技云通行证登录的api地址，当前为测试环境，上线后需要修改
const cstApiBase = 'http://159.226.235.50'

// 注意此时context.state是store.state.user，而不是store.state
const actions: ActionTree<UserInterface, StateInterface> = {
  retainCstToken (context) {
    // console.log('in retain')
    if (context.state.token) {
      const tokenRefresh = context.state.token.refresh
      const tokenAccess = context.state.token.access
      const decoded = jwtDecode<CstJwtInterface>(tokenAccess)
      // console.log(decoded)
      if (decoded.exp) {
        // const timeOut = decoded.exp - Date.now() - 431990000 // 测试用，快速refresh
        const timeOut = decoded.exp - Date.now() - 5000 // 到期时间前5秒钟更新token,到期时间小于5秒时立即尝试更新token
        // console.log('retain timeout', timeOut)
        setTimeout(() => {
          // https://stackoverflow.com/questions/63488141/promise-returned-in-function-argument-where-a-void-return-was-expected/63488201
          void (async () => {
            try {
              if (context.state.token) { // 定时器注册后，仅在用户保持登录时更新token，登出则定时器不执行，不再更新
                // 获取更新到的access token
                const response = await context.dispatch('fetchCstNewToken', tokenRefresh)
                if (response.data.code === 200) {
                  context.commit('storeUser', {
                    access: response.data.data.accessToken,
                    refresh: response.data.data.refreshToken
                  })
                  // console.log(context.state.token)
                  await context.dispatch('retainCstToken')
                } else {
                  void await context.dispatch('logoutCstUser')
                  Notify.create({
                    color: 'nord11',
                    message: '登录失效，请重新登录',
                    closeBtn: false,
                    timeout: 2000
                  })
                }
              }
            } catch {
              void await context.dispatch('logoutCstUser')
            }
          })()
        }, timeOut)
      }
    }
  },
  async fetchCstNewToken (context, refreshToken: string) {
    // console.log('in refresh action')
    const api = cstApiBase + '/open/api/UMTOauthLogin/refreshToken'
    const config = { params: { refreshToken: refreshToken } }
    const response = await axios.post(api, null, config)
    return response
  },
  async reloadCstToken (context) {
    if (localStorage.getItem('access') && localStorage.getItem('refresh')) {
      const localToken = {
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh')
      }
      const respVerifyCstToken = await context.dispatch('verifyCstToken', localToken)
      if (respVerifyCstToken.data.code === 200) {
        context.commit('storeUser', localToken)
      } else {
        void await context.dispatch('logoutCstUser')
      }
    }
  },
  async verifyCstToken (context, payload: TokenInterface) {
    const api = cstApiBase + '/open/api/UMTOauthLogin/checkToken'
    const config = { params: { jwtToken: payload.access } }
    const response = await axios.post(api, null, config)
    // console.log(response)
    return response
  },
  logoutCstUser (context) {
    context.commit('deleteUser')
    window.location.href = cstApiBase + '/open/api/UMTOauthLogin/loginOut?loginOutUrl=' + window.location.origin
  },
  // async fetchCstLogoutUrl () {
  //   const api = cstApiBase + '/open/api/UMTOauthLogin/loginOut'
  //   // redirect是从通行证退出后重定向的地址
  //   const redirect = window.location.origin // 从通行证返回后的跳转url
  //   const config = { params: { loginOutUrl: redirect } }
  //   const response = await axios.post(api, null, config)
  //   return response
  // },
  async loginCstUser (context, code: string) {
    // 获取token
    const respFetchCstToken = await context.dispatch('fetchCstToken', code)
    // 保存token并改变用户登录状态,保存用户信息
    context.commit('storeUser', {
      access: respFetchCstToken.data.data.accessToken,
      refresh: respFetchCstToken.data.data.refreshToken
    })
  },
  async fetchCstToken (context, code: string) {
    // 利用科技云通行证返回的code，换取token
    const api = cstApiBase + '/open/api/UMTOauthLogin/dealCode'
    const config = { params: { code } }
    const response = await axios.post(api, null, config)
    return response
  },
  async fetchCstLoginUrl (/* context */) {
    const api = cstApiBase + '/open/api/UMTOauthLogin/askUrl'
    // redirect是从通行证携带code返回的地址，应该是等待截取code并获取token的具体地址
    const redirect = window.location.origin + '/login'
    const config = { params: { clientUrl: redirect } }
    const response = await axios.post(api, null, config)
    return response
  }
}

export default actions
