import { MutationTree } from 'vuex'
import { TokenInterface, UserInterface } from './state'
import axios from 'axios'

// 注意此时context是store.state.user，而不是store.state
const mutation: MutationTree<UserInterface> = {
  storeEmail (context: UserInterface, payload: string) {
    context.email = payload
  },
  storeToken (/* this: rightType, */context:UserInterface, payload:TokenInterface) {
    // vuex
    context.isLogin = true
    context.token = payload
    // localStorage
    localStorage.setItem('tokenAccess', context.token.access)
    localStorage.setItem('tokenRefresh', context.token.refresh)
    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${context.token.access}`
  },
  deleteToken (context: UserInterface) {
    // vuex
    context.isLogin = false
    delete context.token
    // localStorage
    localStorage.removeItem('tokenAccess')
    localStorage.removeItem('tokenRefresh')
    // axios header
    delete axios.defaults.headers.common.Authorization
  }
}

export default mutation
