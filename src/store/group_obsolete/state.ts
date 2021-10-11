/* group_obsolete 模块保存组信息，组内成员信息 */
// 自定义类型
// 组类型
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
  },
  role: 'member' | 'leader'
  join_time: string
  inviter: string
}

export interface GroupMemberInterface {
  members: SingleMemberInterface[],
  owner: {
    id: string
    username: string
  }
}

// group模块的总体类型
export interface GroupModuleInterface {
  pages: { // 各个页面所需vuex数据
  }
  tables: { // 扁平的data table
    // 用户相关的全部组table
    // groupTable: {
    //   byId: Record<string, GroupInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    // // 组配额table: groupId -> groupMember
    // groupMemberTable: {
    //   byId: Record<string, GroupMemberInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
  }
}

// group模块初始值
function state (): GroupModuleInterface {
  return {
    pages: {},
    tables: {
      // groupTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // },
      // groupMemberTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // }
    }
  }
}

export default state
