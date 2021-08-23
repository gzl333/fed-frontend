import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupInterface, GroupModuleInterface } from './state'

const getters: GetterTree<GroupModuleInterface, StateInterface> = {
  getGroupsByFilter: (state, getters, rootState /*, rootGetters */) => (filter: string): GroupInterface[] => {
    // 排序函数，按照组创建时间降序排列
    const sortFn = (a: GroupInterface, b: GroupInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    // 当前登录用户id
    const currentId = rootState.account.cstEmail

    if (filter === '0') {
      return Object.values(state.tables.groupTable.byId).sort(sortFn)
    } else {
      const rows: GroupInterface[] = []
      for (const group of Object.values(state.tables.groupTable.byId)) {
        if (filter === 'owner' && group.owner.username === currentId) {
          rows.push(group)
        } else if (filter === 'member' && group.owner.username !== currentId) {
          // 假设后端返回的数据是正确包含组长和组员的
          // for (const member of state.tables.groupMemberTable.byId[group.id].members) {
          //   if (member.user.username === currentId) {
          rows.push(group)
          //   }
          // }
        }
      }
      return rows.sort(sortFn)
    }
  }
}

export default getters
