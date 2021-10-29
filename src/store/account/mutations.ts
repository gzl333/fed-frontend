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
    state.items.isFooterOpen = true
  },
  closeFooter (state) {
    state.items.isFooterOpen = false
  },
  // myLayout rightDrawer
  storeIsRightDrawerOpen (state) {
    state.items.isRightDrawerOpen = !state.items.isRightDrawerOpen
  },
  // 保存用户角色
  storeUserRole (state, payload: { fedRole: 'ordinary' | 'federal-admin', vmsAdmin: string[] }) {
    state.items.fedRole = payload.fedRole
    state.items.vmsAdmin = payload.vmsAdmin
  },
  storeUser (/* this: rightType, */state, payload: { access: string; refresh: string; loginType: 'cst' | 'aai' }) {
    state.items.isLogin = true
    state.items.loginType = payload.loginType
    state.items.access = payload.access
    state.items.refresh = payload.refresh
    const decoded = jwtDecode<DecodedToken>(payload.access)
    state.items.decoded = decoded

    // localStorage
    localStorage.setItem('access', state.items.access)
    localStorage.setItem('refresh', state.items.refresh)
    localStorage.setItem('loginType', state.items.loginType)

    // axios header
    axios.defaults.headers.common.Authorization = `Bearer ${state.items.access}`
    apiFed.defaults.headers.common.Authorization = `Bearer ${state.items.access}` // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
    apiLogin.defaults.headers.common.Authorization = `Bearer ${state.items.access}` // todo 是否有必要待定
  },
  deleteUser (state: AccountModuleInterface) {
    // vuex
    state.items.isLogin = false
    delete state.items.loginType
    delete state.items.access
    delete state.items.refresh
    delete state.items.decoded

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
  // 向本模块table中保存item的通用方法
  storeItem<T> (state: AccountModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    item: Record<string, T>
  }) {
    Object.assign(payload.table.byId, payload.item)
    payload.table.allIds.unshift(Object.keys(payload.item)[0])
    payload.table.allIds = [...new Set(payload.table.allIds)]
  },
  // 改变table的isLoaded状态
  storeStatus<T> (state: AccountModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    isLoaded: boolean
  }) {
    payload.table.isLoaded = payload.isLoaded
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
    // 增加成员，修改角色用。为了避免数组有重复，采取以下逻辑：
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
}

export default mutation
