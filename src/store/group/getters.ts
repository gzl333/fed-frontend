import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupInterface, GroupModuleInterface, SingleMemberInterface } from './state'

const getters: GetterTree<GroupModuleInterface, StateInterface> = {
  getGroupsByFilter: (state) => (filter: string): GroupInterface[] => {
    // 排序函数，按照组创建时间降序排列
    const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    if (filter === '0') {
      return Object.values(state.tables.groupTable.byId).sort(sortFn)
    } else {
      const groups: GroupInterface[] = []
      for (const group of Object.values(state.tables.groupTable.byId)) {
        if (filter === 'owner' && group.myRole === 'owner') {
          groups.push(group)
        } else if (filter === 'member' && group.myRole === 'member') {
          groups.push(group)
        } else if (filter === 'leader' && group.myRole === 'leader') {
          groups.push(group)
        }
      }
      return groups.sort(sortFn)
    }
  },
  getGroupMembersByGroupId: (state) => (groupId: string): SingleMemberInterface[] => {
    // 排序函数，按照组创建时间降序排列
    const sortFn = (a: SingleMemberInterface, b: SingleMemberInterface) => new Date(b.join_time).getTime() - new Date(a.join_time).getTime()
    // sort方法修改数组本身，所以需要建立新数组再排序
    const newArr: SingleMemberInterface[] = []
    state.tables.groupMemberTable.byId[groupId].members.forEach((item) => {
      newArr.unshift(item)
    })
    return newArr.sort(sortFn)
  },
  // 根据myRole返回group数组
  getGroupsByMyRole: (state) => (roles: string[]): GroupInterface[] => {
    // 排序函数，按照组创建时间降序排列
    const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    const groups: GroupInterface[] = []
    roles.forEach((role) => {
      for (const group of Object.values(state.tables.groupTable.byId)) {
        if (group.myRole === role) {
          groups.push(group)
        }
      }
    })
    return groups.sort(sortFn)
  },
  // 项目组详情用，根据组员加入时间给成员排序
  getMemberByTime: (state) => (groupId: string): SingleMemberInterface[] => {
    const sortFn = (a: SingleMemberInterface, b: SingleMemberInterface) => new Date(a.join_time).getTime() - new Date(b.join_time).getTime()
    const newArr: SingleMemberInterface[] = []
    state.tables.groupMemberTable.byId[groupId]?.members.forEach((item) => {
      newArr.unshift(item)
    })
    return newArr.sort(sortFn)
  }
}

export default getters
