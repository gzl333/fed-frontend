import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupModuleInterface/*, SingleMemberInterface, GroupInterface */ } from './state'

const getters: GetterTree<GroupModuleInterface, StateInterface> = {
  // getGroupsByFilter: (state) => (filter: string): GroupInterface[] => {
  //   // 排序函数，按照组创建时间降序排列
  //   const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
  //   if (filter === 'all') {
  //     return Object.values(state.tables.groupTable.byId).sort(sortFn)
  //   } else {
  //     const groups: GroupInterface[] = []
  //     for (const group_obsolete of Object.values(state.tables.groupTable.byId)) {
  //       if (filter === 'owner' && group_obsolete.myRole === 'owner') {
  //         groups.push(group_obsolete)
  //       } else if (filter === 'member' && group_obsolete.myRole === 'member') {
  //         groups.push(group_obsolete)
  //       } else if (filter === 'leader' && group_obsolete.myRole === 'leader') {
  //         groups.push(group_obsolete)
  //       }
  //     }
  //     return groups.sort(sortFn)
  //   }
  // }
  // getGroupMembersByGroupId: (state) => (groupId: string): SingleMemberInterface[] => {
  //   // 排序函数，按照组创建时间降序排列
  //   const sortFn = (a: SingleMemberInterface, b: SingleMemberInterface) => new Date(b.join_time).getTime() - new Date(a.join_time).getTime()
  //   // sort方法修改数组本身，所以需要建立新数组再排序
  //   const newArr: SingleMemberInterface[] = []
  //   state.tables.groupMemberTable.byId[groupId].members.forEach((item) => {
  //     newArr.unshift(item)
  //   })
  //   return newArr.sort(sortFn)
  // }
  // // 根据myRole返回group数组
  // getGroupsByMyRole: (state) => (roles: string[]): GroupInterface[] => {
  //   // 排序函数，按照组创建时间降序排列
  //   const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
  //   const groups: GroupInterface[] = []
  //   roles.forEach((role) => {
  //     for (const group_obsolete of Object.values(state.tables.groupTable.byId)) {
  //       if (group_obsolete.myRole === role) {
  //         groups.push(group_obsolete)
  //       }
  //     }
  //   })
  //   return groups.sort(sortFn)
  // },
  // // 项目组详情用，根据组员加入时间给成员排序
  // getMemberByJoinTime: (state) => (groupId: string): SingleMemberInterface[] => {
  //   const sortFn = (a: SingleMemberInterface, b: SingleMemberInterface) => new Date(a.join_time).getTime() - new Date(b.join_time).getTime()
  //   const newArr: SingleMemberInterface[] = []
  //   state.tables.groupMemberTable.byId[groupId]?.members.forEach((item) => {
  //     newArr.unshift(item)
  //   })
  //   return newArr.sort(sortFn)
  // }
}

export default getters
