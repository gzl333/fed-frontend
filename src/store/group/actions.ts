import { ActionTree } from 'vuex'
import { StateInterface, apiBase } from '../index'
import { GroupModuleInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import { Dialog, Notify } from 'quasar'

import GroupEditCard from 'components/Group/GroupEditCard.vue'

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
      // 添加role字段
      const currentId = context.rootState.account.cstEmail
      const myRole = currentId === data.owner.username ? 'owner' : 'member'
      Object.assign(data, { myRole })
      // normalize
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

      // 给groupTable补充role字段
      const currentId = context.rootState.account.cstEmail
      for (const member of respGroupMember.data.members) {
        if (member.user.username === currentId && member.role === 'leader') {
          const myRole = 'leader'
          context.commit('storeRoleGroupTable', {
            groupId,
            myRole
          })
        }
      }
    }
  },
  async fetchGroupMember (context, groupId: string) {
    const api = apiBase + '/vo/' + groupId + '/list-members/'
    const response = await axios.get(api)
    return response
  },
  /* groupMemberTable */

  /* 修改group信息 */
  async editGroup (context, groupId: string) {
    // 把整个对话框对象包在promise里。删除成功、失败包装为promise结果值。
    const promise = new Promise((resolve, reject) => {
      // 操作的确认提示
      Dialog.create({
        component: GroupEditCard,
        componentProps: {
          groupId
        }
      }).onOk(async (val: { name: string; company: string; description: string }) => {
        // val是onDialogOK调用时传入的实参
        // 发送patch请求
        const respPatchGroup = await context.dispatch('patchGroup', {
          groupId,
          data: val
        })

        if (respPatchGroup.status === 200) {
          // 加入myRole字段
          Object.assign(respPatchGroup.data, { myRole: context.state.tables.groupTable.byId[groupId].myRole })
          // 保存响应内最新信息
          const newGroup = { [respPatchGroup.data.id]: respPatchGroup.data }
          // 保存最新group
          context.commit('storeGroupTable', newGroup)
          // 弹出通知
          Notify.create({
            classes: 'notification-primary shadow-15',
            icon: 'mdi-check-circle',
            textColor: 'light-green',
            message: '项目组信息已经修改',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          resolve(true)
        } else {
          reject(false) // 待研究：用reject还是resolve
        }
      })
    })

    return promise
  },
  async patchGroup (context, payload: { groupId: string; data: { name: string; company: string; description: string } }) {
    const api = apiBase + '/vo/' + payload.groupId + '/'
    const { data } = payload
    const response = await axios.patch(api, data)
    return response
  }
  /* 修改group信息 */
}

export default actions
