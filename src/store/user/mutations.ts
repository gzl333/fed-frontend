import { MutationTree } from 'vuex'
import { CstJwtInterface, UserInterface } from './state'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

// 注意此时state是store.state.user，而不是store.state
const mutation: MutationTree<UserInterface> = {
  storeUser (/* this: rightType, */state, payload: { access: string; refresh: string; }) {
    // vuex
    state.isLogin = true
    state.token = {
      access: payload.access,
      refresh: payload.refresh
    }
    const decoded = jwtDecode<CstJwtInterface>(payload.access)
    state.cstTrueName = decoded.trueName
    state.cstEmail = decoded.cstnetId
    state.cstId = decoded.umtId
    // localStorage
    localStorage.setItem('access', state.token.access)
    localStorage.setItem('refresh', state.token.refresh)

    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${state.token.access}`
  },
  deleteUser (state: UserInterface) {
    // vuex
    state.isLogin = false
    delete state.token
    delete state.cstTrueName
    delete state.cstEmail
    delete state.cstId
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
