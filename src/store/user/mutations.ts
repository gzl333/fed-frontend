import { MutationTree } from 'vuex'
import { TokenInterface, UserInterface } from './state'
import axios from 'axios'

// 注意此时state是store.state.user，而不是store.state
const mutation: MutationTree<UserInterface> = {
  storeEmail (context: UserInterface, payload: string) {
    context.email = payload
  },
  storeToken (/* this: rightType, */state:UserInterface, payload:TokenInterface) {
    // vuex
    state.isLogin = true
    state.token = payload
    // localStorage
    localStorage.setItem('tokenAccess', state.token.access)
    localStorage.setItem('tokenRefresh', state.token.refresh)
    // axios header
    axios.defaults.headers.common.Authorization = `JWT ${state.token.access}`
  },
  deleteToken (state: UserInterface) {
    // vuex
    state.isLogin = false
    delete state.token
    // localStorage
    localStorage.removeItem('tokenAccess')
    localStorage.removeItem('tokenRefresh')
    // axios header
    delete axios.defaults.headers.common.Authorization
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/')
  }
}

export default mutation
