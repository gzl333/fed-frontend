export interface DecodedToken {
  id: string
  name: string
  email: string
  orgName: string

  exp: number
  iat: number
  iss: string
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
  items: { // 单独的数据
    isLogin: boolean // 登录状态

    // 账户token信息
    loginType?: 'cst' | 'aai'
    access?: string
    refresh?: string
    decoded?: DecodedToken

    // 账户在云联邦内的身份
    fedRole: 'ordinary' | 'federal-admin' // 联邦层级：普通用户还是管理员
    vmsAdmin: string[] // 有vms管理员权限的接入服务id
    // obsAdmin: string[]
    // hpsAdmin: string[]

    // layout
    isLeftDrawerOpen: boolean
    isRightDrawerOpen: boolean
    isFooterOpen: boolean
  }
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
    items: {
      isLogin: false,
      fedRole: 'ordinary', // 登进来默认都是普通用户
      vmsAdmin: [],
      isLeftDrawerOpen: true,
      isRightDrawerOpen: false,
      isFooterOpen: false
    },
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
