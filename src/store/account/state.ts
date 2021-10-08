export interface DecodedToken { // todo 待根据最新jwt token更新
  cstnetId: string // cst email
  cstnetIdStatus: string
  exp: number
  iat: number
  iss: string
  orgName: string
  securityEmail: null // ?
  trueName: string
  type: string
  umtId: string
}

export interface GroupInterface {
  id: string
  name: string
  company: string
  description: string
  creation_time: string
  owner: {
    id: string
    username: string
  },
  status: string // 'active' | 'inactive' ?

  // 以下字段自行判断添加
  // 当前用户在组内权限  owner > leader > member
  myRole: 'owner' | 'leader' | 'member'
}

export interface SingleMemberInterface {
  id: string
  user: {
    id: string
    username: string
  }
  role: 'member' | 'leader'
  join_time: string
  inviter: string
}

export interface GroupMemberInterface {
  members: SingleMemberInterface[]
  owner: {
    id: string
    username: string
  }
}

// Account总体类型
export interface AccountModuleInterface {
  // account
  isLogin: boolean
  access?: string
  refresh?: string
  decoded?: DecodedToken

  // layout
  isRightDrawerOpen: boolean
  isFooterOpen: boolean

  /* 新模块 */
  tables: {
    // 用户相关的全部组table
    groupTable: {
      byId: Record<string, GroupInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 组配额table: groupId -> groupMember
    groupMemberTable: {
      byId: Record<string, GroupMemberInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }

}

function state (): AccountModuleInterface {
  return {
    isLogin: false,
    isRightDrawerOpen: false,
    isFooterOpen: false,
    tables: {
      groupTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      groupMemberTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
