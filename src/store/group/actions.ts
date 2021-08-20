import { ActionTree } from 'vuex'
import { StateInterface, apiBase } from '../index'
import { GroupModuleInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'

const actions: ActionTree<GroupModuleInterface, StateInterface> = {
  // 加载group模块内全部table
  loadGroupModuleTable (context) {
    if (!context.state.tables.groupTable.isLoaded) {
      void context.dispatch('loadGroupTable').then(() => {
        // groupMemberTable 依赖 groupTable, 根据每个groupId建立一个groupMember对象
        if (!context.state.tables.groupMemberTable.isLoaded) {
          void context.dispatch('loadGroupMemberTableFromGroup')
        }
        // vm/groupQuotaTable 依赖 groupTable， 跨模块调用
        if (!context.rootState.vm.tables.groupQuotaTable.isLoaded) {
          void context.dispatch('vm/loadGroupQuotaTable', null, { root: true })
        }
        // vm/groupServerTable 依赖 groupTable， 跨模块调用
        if (!context.rootState.vm.tables.groupServerTable.isLoaded) {
          void context.dispatch('vm/loadGroupServerTable', null, { root: true })
        }
      })
    }
  },

  /* groupTable */
  // 加载groupTable
  async loadGroupTable (context) {
    const respGroup = await context.dispatch('fetchGroup')
    // normalize
    const group = new schema.Entity('group')
    for (const data of respGroup.data.results) {
      const normalizedData = normalize(data, group)
      context.commit('storeGroupTable', normalizedData.entities.group)
    }
  },
  async fetchGroup (context, payload: { page?: number; page_size?: number; owner?: boolean; member?: boolean }) {
    const api = apiBase + '/vo/'
    let response
    if (payload) {
      const config = {
        params: payload
      }
      response = await axios.get(api, config)
    } else {
      response = await axios.get(api)
    }
    return response
  },
  /* groupTable */

  /* groupMemberTable 依赖 groupTable */
  // 根据groupTable,建立groupMemberTable
  async loadGroupMemberTableFromGroup (context) {
    for (const groupId of context.state.tables.groupTable.allIds) {
      const respGroupMember = await context.dispatch('fetchGroupMember', groupId)
      // 把groupId字段补充进去
      Object.assign(respGroupMember.data, { id: groupId })
      // normalize
      const groupMember = new schema.Entity('groupMember')
      const normalizedData = normalize(respGroupMember.data, groupMember)
      // 存入state
      context.commit('storeGroupMemberTable', normalizedData.entities.groupMember)
    }
  },
  async fetchGroupMember (context, groupId: string) {
    const api = apiBase + '/vo/' + groupId + '/list-members/'
    const response = await axios.get(api)
    return response
  }
  /* groupMemberTable */
}

export default actions
