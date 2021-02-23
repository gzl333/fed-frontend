import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ApiJwtInterface, UserInterface } from './state'
import axios from 'axios'

import { useRouter } from 'vue-router'
const $router = useRouter()

const actions: ActionTree<UserInterface, StateInterface> = {
  reloadToken (context) {
    console.log('$$$$$ store reloading token...')
    if (localStorage.getItem('tokenAccess') && localStorage.getItem('tokenRefresh')) {
      const localToken = {
        access: localStorage.getItem('tokenAccess'),
        refresh: localStorage.getItem('tokenRefresh')
      }
      void context.dispatch('verifyToken', localToken)
        .then(() => {
          context.commit('storeToken', localToken)
          alert('before router.push')
          void $router.push({ path: '/my' }) // todo why not working??? this is the only problem now!!
        }).catch(() => {
          localStorage.removeItem('tokenAccess')
          localStorage.removeItem('tokenRefresh')
        })
    }
  },
  fetchToken () {
    // getToken
  },
  // verify token passed in
  verifyToken (context, payload:ApiJwtInterface) {
    // 注意此时context.state是store.state.user，而不是store.state
    const tokenAccess = payload.access

    const apiBaseDev = 'api_dev'
    const apiBaseProd = 'http://gosc.cstcloud.cn/api'
    const apiBase = process.env.NODE_ENV === 'production' ? apiBaseProd : apiBaseDev
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
  refrechToken () {
    alert('refreshToken')
    // refresh
  }
}

export default actions
