import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { TokenInterface, UserInterface, LoginReqInterface, RefreshTokenInterface, JwtPayload } from './state'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

const apiBaseDev = 'http://gosc.cstcloud.cn/api' // 'api_dev'
const apiBaseProd = 'http://gosc.cstcloud.cn/api'
const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev

// 注意此时context.state是store.state.user，而不是store.state
const actions: ActionTree<UserInterface, StateInterface> = {
  storeUser (context, payload: UserInterface) {
    context.commit('storeEmail', payload.email)
    context.commit('storeToken', payload.token)
  },
  async reloadToken (context) {
    if (localStorage.getItem('tokenAccess') && localStorage.getItem('tokenRefresh')) {
      const localToken = {
        access: localStorage.getItem('tokenAccess'),
        refresh: localStorage.getItem('tokenRefresh')
      }
      try {
        await context.dispatch('verifyToken', localToken)
        context.commit('storeToken', localToken)
        if (localToken.access) {
          const email = jwtDecode<JwtPayload>(localToken.access).username
          context.commit('storeEmail', email)
        }
      } catch {
        context.commit('deleteToken')
      }
    }
  },
  async fetchToken (context, payload: LoginReqInterface) {
    const api = apiBase + '/jwt/'
    const data = payload
    const response = await axios.post(api, data)
    return response
  },
  async verifyToken (context, payload: TokenInterface) {
    const tokenAccess = payload.access
    const api = apiBase + '/jwt-verify/'
    const data = { token: tokenAccess }
    const response = await axios.post(api, data)
    return response
  },
  async fetchNewToken (context, payload: RefreshTokenInterface) {
    const api = apiBase + '/jwt-refresh/'
    const data = payload
    const response = await axios.post(api, data)
    return response
  },
  retainToken (context) {
    if (context.state.token) {
      const tokenRefresh = context.state.token.refresh
      const tokenAccess = context.state.token.access
      const decoded = jwtDecode<JwtPayload>(tokenAccess)
      if (decoded.exp) {
        const exp = decoded.exp * 1000
        const timeOut = exp - Date.now() - 10000
        console.log(timeOut)
        setTimeout(() => {
          void (async () => {
            try {
              // only fetch new token when logged in
              if (context.state.token) {
                const response = await context.dispatch('fetchNewToken', { refresh: tokenRefresh })
                context.commit('storeToken', { access: response.data.access, refresh: tokenRefresh })
                console.log('new token', context.state.token.access)
                await context.dispatch('retainToken')
              }
            } catch {
              context.commit('deleteToken')
            }
          })()
        }, timeOut)
      }
    }
  }
}

export default actions
