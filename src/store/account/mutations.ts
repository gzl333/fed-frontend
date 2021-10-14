import { MutationTree } from 'vuex'
import { AccountModuleInterface, DecodedToken } from './state'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { apiFed, apiLogin } from 'boot/axios'
import { SingleMemberInterface } from 'src/store/account/state'

// 注意此时state是store.state.account，而不是store.state
const mutation: MutationTree<AccountModuleInterface> = {
  // toggle footer
  openFooter (state) {
    state.data.isFooterOpen = true
  },
  closeFooter (state) {
    state.data.isFooterOpen = false
  },
  // myLayout rightDrawer
  storeIsRightDrawerOpen (state) {
    state.data.isRightDrawerOpen = !state.data.isRightDrawerOpen
  },
  storeUser (/* this: rightType, */state, payload: { access: string; refresh: string; loginType: 'cst' | 'aai' }) {
    state.data.isLogin = true
    state.data.loginType = payload.loginType
    state.data.access = payload.access
    state.data.refresh = payload.refresh
    const decoded = jwtDecode<DecodedToken>(payload.access)
    state.data.decoded = decoded

    // localStorage
    localStorage.setItem('access', state.data.access)
    localStorage.setItem('refresh', state.data.refresh)
    localStorage.setItem('loginType', state.data.loginType)

    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${state.data.access}`
    apiFed.defaults.headers.common.Authorization = `Bearer ${state.data.access}` // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
    apiLogin.defaults.headers.common.Authorization = `Bearer ${state.data.access}` // todo 是否有必要待定
  },
  deleteUser (state: AccountModuleInterface) {
    // vuex
    state.data.isLogin = false
    delete state.data.loginType
    delete state.data.access
    delete state.data.refresh
    delete state.data.decoded

    // localStorage
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('loginType')

    // axios header
    delete axios.defaults.headers.common.Authorization
    delete apiFed.defaults.headers.common.Authorization // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
    delete apiLogin.defaults.headers.common.Authorization // todo 是否有必要待定

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.$router.push('/') // 登出后的路由目标均为首页，其跳转写在这里
  },

  /* 新模块 */
  // 向本模块table中保存对象的通用方法
  storeTable<T> (state: AccountModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    tableObj: Record<string, T>
  }) {
    Object.assign(payload.table.byId, payload.tableObj)
    payload.table.allIds.unshift(Object.keys(payload.tableObj)[0])
    payload.table.allIds = [...new Set(payload.table.allIds)]
    payload.table.isLoaded = true
  },
  // 清空本模块table的通用方法
  clearTable<T> (state: AccountModuleInterface, table: {
    byId: Record<string, T>
    allIds: string[]
    isLoaded: boolean
  }) {
    table.byId = {}
    table.allIds = []
    table.isLoaded = false
  },
  storeRoleGroupTable (state, payload: { groupId: string; myRole: 'owner' | 'leader' | 'member' }) {
    state.tables.groupTable.byId[payload.groupId].myRole = payload.myRole
  },
  storeGroupMemberTableSingleMember (state, payload: { groupId: string; member: SingleMemberInterface }) {
    // 增加人员，修改角色用。为了避免数组有重复，采取以下逻辑：
    // 删掉已有的同名member
    state.tables.groupMemberTable.byId[payload.groupId].members = state.tables.groupMemberTable.byId[payload.groupId].members.filter((member) => {
      return member.user.username !== payload.member.user.username
    })
    // 增加新拿到的member
    state.tables.groupMemberTable.byId[payload.groupId].members.unshift(payload.member)
  },
  deleteGroupMemberTableSingleMember (state, payload: { groupId: string; username: string }) {
    state.tables.groupMemberTable.byId[payload.groupId].members = state.tables.groupMemberTable.byId[payload.groupId].members.filter((member) => {
      return member.user.username !== payload.username
    })
  }
  /* 新模块 */
}

export default mutation
