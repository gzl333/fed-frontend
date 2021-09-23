import { MutationTree } from 'vuex'
import { AccountModuleInterface, DecodedToken } from './state'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

// 注意此时state是store.state.account，而不是store.state
const mutation: MutationTree<AccountModuleInterface> = {
  // toggle footer
  openFooter (state) {
    state.isFooterOpen = true
  },
  closeFooter (state) {
    state.isFooterOpen = false
  },
  // myLayout rightDrawer
  storeIsRightDrawerOpen (state) {
    state.isRightDrawerOpen = !state.isRightDrawerOpen
  },
  storeUser (/* this: rightType, */state, payload: { access: string; refresh: string; }) {
    state.isLogin = true
    state.access = payload.access
    state.refresh = payload.refresh
    const decoded = jwtDecode<DecodedToken>(payload.access)
    state.decoded = decoded

    // localStorage
    localStorage.setItem('access', state.access)
    localStorage.setItem('refresh', state.refresh)

    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${state.access}`
  },
  deleteUser (state: AccountModuleInterface) {
    // vuex
    state.isLogin = false
    delete state.access
    delete state.refresh
    delete state.decoded
    // localStorage
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    // axios header
    delete axios.defaults.headers.common.Authorization
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/') // 登出后的路由目标均为首页，其跳转写在这里
  }
}

export default mutation
