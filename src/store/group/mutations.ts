import { MutationTree } from 'vuex'
import { GroupInterface, GroupMemberInterface, GroupModuleInterface } from './state'

const mutation: MutationTree<GroupModuleInterface> = {
  storeGroupTable (state, tableObj: Record<string, GroupInterface>) {
    Object.assign(state.tables.groupTable.byId, tableObj)
    state.tables.groupTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.groupTable.allIds = [...new Set(state.tables.groupTable.allIds)]
    state.tables.groupTable.isLoaded = true
  },
  storeGroupMemberTable (state, tableObj: Record<string, GroupMemberInterface>) {
    Object.assign(state.tables.groupMemberTable.byId, tableObj)
    state.tables.groupMemberTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.groupMemberTable.allIds = [...new Set(state.tables.groupMemberTable.allIds)]
    state.tables.groupMemberTable.isLoaded = true
  }
}

export default mutation
