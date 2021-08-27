import { MutationTree } from 'vuex'
import { GroupInterface, GroupMemberInterface, GroupModuleInterface, SingleMemberInterface } from './state'

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
  },
  storeRoleGroupTable (state, payload: { groupId: string; myRole: 'owner' | 'leader' | 'member' }) {
    state.tables.groupTable.byId[payload.groupId].myRole = payload.myRole
  }
}

export default mutation
