import { MutationTree } from 'vuex'
import { AccountModuleInterface, DecodedToken } from './state'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { apiFed, apiLogin } from 'boot/axios'

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
    apiFed.defaults.headers.common.Authorization = `Bearer ${state.access}` // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
    apiLogin.defaults.headers.common.Authorization = `Bearer ${state.access}` // todo 是否有必要待定
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
    delete apiFed.defaults.headers.common.Authorization // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
    delete apiLogin.defaults.headers.common.Authorization // todo 是否有必要待定

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/') // 登出后的路由目标均为首页，其跳转写在这里
  }
}

export default mutation
