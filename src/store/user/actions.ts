import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ApiJwtInterface, UserInterface, LoginReqInterface, RefreshTokenInterface } from './state'
import axios from 'axios'

const apiBaseDev = 'http://gosc.cstcloud.cn/api' // 'api_dev'
const apiBaseProd = 'http://gosc.cstcloud.cn/api'
const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev

// 注意此时context.state是store.state.user，而不是store.state
const actions: ActionTree<UserInterface, StateInterface> = {
  async reloadToken (context) {
    if (localStorage.getItem('tokenAccess') && localStorage.getItem('tokenRefresh')) {
      const localToken = {
        access: localStorage.getItem('tokenAccess'),
        refresh: localStorage.getItem('tokenRefresh')
      }
      try {
        await context.dispatch('verifyToken', localToken)
        context.commit('storeToken', localToken)
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
  // verify token passed in
  async verifyToken (context, payload: ApiJwtInterface) {
    const tokenAccess = payload.access
    const api = apiBase + '/jwt-verify/'
    const data = { token: tokenAccess }
    const response = await axios.post(api, data)
    return response
  },
  async refreshToken (context, payload: RefreshTokenInterface) {
    const api = apiBase + '/jwt-refresh/'
    const data = payload
    const response = await axios.post(api, data)
    return response
  },
  retainToken (context) {
    // times to auto refresh token
    // const times = 15
    // const tokenAccess = context.state.token.access
    // const tokenRefresh = context.state.token.refresh
  }
}

export default actions
