import { MutationTree } from 'vuex'
import { ApiJwtInterface, UserInterface } from './state'

const mutation: MutationTree<UserInterface> = {
  login (user: UserInterface, payload:ApiJwtInterface) {
    // 注意此时第一个参数是store.user，而不是store
    user.isLogin = true
    user.token = payload
    // save token to localStorage
    localStorage.setItem('tokenAccess', user.token.access)
    localStorage.setItem('tokenRefresh', user.token.refresh)
  },
  logout (user: UserInterface) {
    user.isLogin = false
    delete user.token
    // remove token in localStorage
    // localStorage.remove('tokenAccess')
    // localStorage.remove('tokenRefresh')
  }
}

export default mutation
