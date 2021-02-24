import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ApiJwtInterface, UserInterface, LoginReqInterface, RefreshTokenInterface } from './state'
import axios from 'axios'

const apiBaseDev = 'api_dev'
const apiBaseProd = 'http://gosc.cstcloud.cn/api'
const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev

const actions: ActionTree<UserInterface, StateInterface> = {
  reloadToken (context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (localStorage.getItem('tokenAccess') && localStorage.getItem('tokenRefresh')) {
      const localToken = {
        access: localStorage.getItem('tokenAccess'),
        refresh: localStorage.getItem('tokenRefresh')
      }
      context.dispatch('verifyToken', localToken)
        .then(() => {
          context.commit('storeToken', localToken)
        }).catch(() => {
          context.commit('deleteToken')
        })
    }
  },
  fetchToken (context, payload: LoginReqInterface) {
    const api = apiBase + '/jwt/'
    const data = payload

    const resultFetch = axios.post(api, data).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response)
      }
    }).catch(error => {
      return Promise.reject(error)
    })
    return resultFetch
  },
  // verify token passed in
  verifyToken (context, payload:ApiJwtInterface) {
    // 注意此时context.state是store.state.user，而不是store.state
    const tokenAccess = payload.access

    const api = apiBase + '/jwt-verify/'
    const data = { token: tokenAccess }

    const resultVerified = axios.post(api, data).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response)
      }
    }).catch(error => {
      return Promise.reject(error)
    })
    return resultVerified
  },
  refreshToken (context, payload:RefreshTokenInterface) {
    const api = apiBase + '/jwt-refresh/'
    const data = payload
    const resultRefresh = axios.post(api, data).then(response => {
      if (response.status === 200) {
        return Promise.resolve(response)
      }
    }).catch(error => {
      return Promise.reject(error)
    })
    return resultRefresh
  },
  retainToken (context) {
    //
  }
}

export default actions
