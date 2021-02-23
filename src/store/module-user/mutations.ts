import { MutationTree } from 'vuex'
import { ApiJwtInterface, UserInterface } from './state'
// import axios from 'axios'

const mutation: MutationTree<UserInterface> = {
  storeToken (context:UserInterface, payload:ApiJwtInterface) {
    // 注意此时context是store.state.user，而不是store.state
    // vuex
    context.isLogin = true
    context.token = payload
    // localStorage
    localStorage.setItem('tokenAccess', context.token.access)
    localStorage.setItem('tokenRefresh', context.token.refresh)
    // axios header
    // axios.defaults.headers.common.Authorization = `Bearer ${context.token.access}`
    console.log(context)
  },
  deleteToken (context: UserInterface) {
    // vuex
    context.isLogin = false
    delete context.token
    // localStorage
    localStorage.removeItem('tokenAccess')
    localStorage.removeItem('tokenRefresh')
    // axios header
    // delete axios.defaults.headers.common.Authorization
  }
}

export default mutation
