import { ActionTree } from 'vuex'
import { StateInterface/*, apiBase */ } from '../index'
import { GroupModuleInterface } from './state'
// import axios from 'axios'
// import { normalize, schema } from 'normalizr'
// import { Dialog, Notify } from 'quasar'

// import GroupEditCard from 'components/Group/GroupEditCard.vue'
// import GroupAddMemberCard from 'components/Group/GroupAddMemberCard.vue'

const actions: ActionTree<GroupModuleInterface, StateInterface> = {
  // 加载group模块内全部table
  loadGroupModuleTable (/* context */) {
    // if (!context.state.tables.groupTable.isLoaded) {
    //   void context.dispatch('loadGroupTable').then(() => {
    //     // groupMemberTable 依赖 groupTable, 根据每个groupId建立一个groupMember对象
    //     // if (!context.state.tables.groupMemberTable.isLoaded) {
    //     //   void context.dispatch('loadGroupMemberTableFromGroup').then(() => {
    //     //     // applyQuota_obsolete/groupApplicationTable 依赖 groupTable， 跨模块调用。
    //     //     // 注意：此表依赖groupTable中的myRole字段，而该字段是loadGroupMemberTableFromGroup副产品，所以产生依赖
    //     //     // if (!context.rootState.applyQuota_obsolete.tables.groupQuotaApplicationTable.isLoaded) {
    //     //     //   void context.dispatch(('applyQuota_obsolete/loadGroupApplicationTable'), null, { root: true })
    //     //     // }
    //     //   })
    //     // }
    //     // vm_obsolete/groupQuotaTable 依赖 groupTable， 跨模块调用
    //     // if (!context.rootState.vm_obsolete.tables.groupQuotaTable.isLoaded) {
    //     //   void context.dispatch('vm_obsolete/loadGroupQuotaTable', null, { root: true })
    //     // }
    //     // vm_obsolete/groupServerTable 依赖 groupTable， 跨模块调用
    //     // if (!context.rootState.vm_obsolete.tables.groupServerTable.isLoaded) {
    //     //   void context.dispatch('vm_obsolete/loadGroupServerTable', null, { root: true })
    //     // }
    //   })
    // }
  }
  // 强制加载group模块内全部table
  // forceLoadGroupModuleTable (context) {
  //   void context.dispatch('loadGroupTable').then(() => {
  //     groupMemberTable 依赖 groupTable, 根据每个groupId建立一个groupMember对象
  //     void context.dispatch('loadGroupMemberTableFromGroup').then(() => {
  //       // applyQuota_obsolete/groupApplicationTable 依赖 groupTable， 跨模块调用。
  //       // 注意：此表以来groupTable中的myRole字段，1而该字段是loadGroupMemberTableFromGroup副产品，所以产生依赖
  //       // void context.dispatch(('applyQuota_obsolete/loadGroupApplicationTable'), null, { root: true })
  //     })
  //     vm_obsolete/groupQuotaTable 依赖 groupTable， 跨模块调用
  //     void context.dispatch('vm_obsolete/loadGroupQuotaTable', null, { root: true })
  //     vm_obsolete/groupServerTable 依赖 groupTable， 跨模块调用
  //     void context.dispatch('vm_obsolete/loadGroupServerTable', null, { root: true })
  //   })
  // },

  /* groupTable */
  // 加载groupTable
  // async loadGroupTable (context) {
  //   // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
  //   context.commit('clearGroupTable')
  //   // 发送请求
  //   const respGroup = await context.dispatch('fetchGroup')
  //   // normalize
  //   const group_obsolete = new schema.Entity('group_obsolete')
  //   for (const data of respGroup.data.results) {
  //     // 添加role字段
  //     const currentId = context.rootState.account.decoded?.cstnetId
  //     const myRole = currentId === data.owner.username ? 'owner' : 'member'
  //     Object.assign(data, { myRole })
  //     // normalize
  //     const normalizedData = normalize(data, group_obsolete)
  //     context.commit('storeGroupTable', normalizedData.entities.group_obsolete)
  //   }
  // },
  // fetchGroup (context, payload: { page?: number; page_size?: number; owner?: boolean; member?: boolean }) {
  //   const api = apiBase + '/vo/'
  //   const config = {
  //     params: payload
  //   }
  //   return axios.get(api, config)
  // },
  /* groupTable */

  /* groupMemberTable 依赖 groupTable */
  // 根据groupTable,建立groupMemberTable
  // async loadGroupMemberTableFromGroup (context) {
  //   for (const groupId of context.state.tables.groupTable.allIds) {
  //     const respGroupMember = await context.dispatch('getVoListMembers', groupId)
  //     // 把groupId字段补充进去
  //     Object.assign(respGroupMember.data, { id: groupId })
  //     // normalize
  //     const groupMember = new schema.Entity('groupMember')
  //     const normalizedData = normalize(respGroupMember.data, groupMember)
  //     // 存入state
  //     context.commit('storeGroupMemberTable', normalizedData.entities.groupMember)
  //
  //     // 给groupTable补充role字段
  //     const currentId = context.rootState.account.decoded?.cstnetId
  //     for (const member of respGroupMember.data.members) {
  //       if (member.user.username === currentId && member.role === 'leader') {
  //         const myRole = 'leader'
  //         context.commit('storeRoleGroupTable', {
  //           groupId,
  //           myRole
  //         })
  //       }
  //     }
  //   }
  // },
  // getVoListMembers (context, groupId: string) {
  //   const api = apiBase + '/vo/' + groupId + '/list-members/'
  //   return axios.get(api)
  // },
  /* groupMemberTable */

  /* 修改group信息 */
  // async editGroupDialog (context, groupId: string) {
  //   // 把整个对话框对象包在promise里。删除成功、失败包装为promise结果值。
  //   return new Promise((resolve, reject) => {
  //     // 操作的确认提示
  //     Dialog.create({
  //       component: GroupEditCard,
  //       componentProps: {
  //         groupId
  //       }
  //     }).onOk(async (val: { name: string; company: string; description: string }) => {
  //       // val是onDialogOK调用时传入的实参
  //       // 发送patch请求
  //       const respPatchGroup = await context.dispatch('patchGroup', {
  //         groupId,
  //         data: val
  //       })
  //
  //       if (respPatchGroup.status === 200) {
  //         // 加入myRole字段
  //         Object.assign(respPatchGroup.data, { myRole: context.state.tables.groupTable.byId[groupId].myRole })
  //         // 保存响应内最新信息
  //         const newGroup = { [respPatchGroup.data.id]: respPatchGroup.data }
  //         // 保存最新group
  //         context.commit('storeGroupTable', newGroup)
  //         // 弹出通知
  //         Notify.create({
  //           classes: 'notification-positive shadow-15',
  //           icon: 'mdi-check-circle',
  //           textColor: 'light-green',
  //           message: '项目组信息修改成功',
  //           position: 'bottom',
  //           closeBtn: true,
  //           timeout: 5000,
  //           multiLine: false
  //         })
  //         resolve(true)
  //       } else {
  //         // 弹出通知
  //         Notify.create({
  //           classes: 'notification-negative shadow-15',
  //           icon: 'mdi-alert',
  //           textColor: 'negative',
  //           message: '项目组信息修改失败，请重试',
  //           position: 'bottom',
  //           closeBtn: true,
  //           timeout: 5000,
  //           multiLine: false
  //         })
  //         reject(false) // 待研究：用reject还是resolve
  //       }
  //     })
  //   })
  // },
  // patchGroup (context, payload: { groupId: string; data: { name: string; company: string; description: string } }) {
  //   const api = apiBase + '/vo/' + payload.groupId + '/'
  //   const { data } = payload
  //   return axios.patch(api, data)
  // },
  /* 修改group信息 */

  /* 增加group人员 */
  // addGroupMemberDialog (context, groupId: string) {
  //   Dialog.create({
  //     component: GroupAddMemberCard,
  //     componentProps: {
  //       groupId
  //     }
  //   }).onOk(async (val: { groupId: string; usernames: string[] }) => {
  //     // val是onDialogOK调用时传入的实参
  //     // 发送patch请求
  //     const respPostAddMembers = await context.dispatch('postAddMembers', val)
  //     // 此请求可能有多个成功，多个失败混在一起。因此不能用状态码判断。
  //     // 把成功的账户member信息存入table
  //     for (const member of respPostAddMembers.data.success) {
  //       // 存入单个member
  //       context.commit('storeGroupMemberTableSingleMember', {
  //         groupId,
  //         member
  //       })
  //       // 通知：单个member成功信息
  //       Notify.create({
  //         classes: 'notification-positive shadow-15',
  //         icon: 'mdi-check-circle',
  //         textColor: 'light-green',
  //         message: '已经成功添加人员:' + member.user.username,
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     }
  //     // 通知：失败账户错误信息
  //     for (const member of respPostAddMembers.data.failed) {
  //       Notify.create({
  //         classes: 'notification-negative shadow-15',
  //         icon: 'mdi-alert',
  //         textColor: 'negative',
  //         message: '添加人员失败：' + member.username + ' - ' + member.message,
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     }
  //   })
  // },
  // postAddMembers (context, payload: { groupId: string; usernames: string[] }) {
  //   const api = apiBase + '/vo/' + payload.groupId + '/add-members/'
  //   const data = {
  //     usernames: payload.usernames
  //   }
  //   return axios.post(api, data)
  // },
  /* 增加group人员 */

  /* 移除group人员 */
  // removeSingleGroupMemberDialog (context, payload: { groupId: string; username: string }) {
  //   // 操作的确认提示
  //   Dialog.create({
  //     class: 'dialog-primary',
  //     title: '移除项目组人员：' + payload.username,
  //     message:
  //       '确认移除?',
  //     focus: 'cancel',
  //     ok: {
  //       label: '确认',
  //       push: false,
  //       outline: true,
  //       color: 'primary'
  //     },
  //     cancel: {
  //       label: '放弃',
  //       push: false,
  //       unelevated: true,
  //       color: 'primary'
  //     }
  //   }).onOk(async () => {
  //     const respPostRemoveMembers = await context.dispatch('postRemoveMembers', {
  //       groupId: payload.groupId,
  //       usernames: [payload.username]
  //     })
  //     if (respPostRemoveMembers.status === 204) {
  //       // 保存最新group
  //       context.commit('deleteGroupMemberTableSingleMember', payload)
  //       // 弹出通知
  //       Notify.create({
  //         classes: 'notification-positive shadow-15',
  //         icon: 'mdi-check-circle',
  //         textColor: 'light-green',
  //         message: '已经移除项目组人员：' + payload.username,
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     } else {
  //       // 弹出通知
  //       Notify.create({
  //         classes: 'notification-negative shadow-15',
  //         icon: 'mdi-alert',
  //         textColor: 'negative',
  //         message: '移除项目组人员失败，请重试',
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     }
  //   })
  // },
  // postRemoveMembers (context, payload: { groupId: string; usernames: string[] }) {
  //   const api = apiBase + '/vo/' + payload.groupId + '/remove-members/'
  //   const data = {
  //     usernames: payload.usernames
  //   }
  //   return axios.post(api, data)
  // },
  /* 移除group人员 */

  /* 修改group人员角色 */
  // editGroupMemberRoleDialog (context, payload: { groupId: string; member_id: string; role: 'member' | 'leader'; role_name: string }) {
  //   // 操作的确认提示
  //   Dialog.create({
  //     class: 'dialog-primary',
  //     title: '将人员设置为：' + payload.role_name,
  //     message:
  //       '确认设置?',
  //     focus: 'cancel',
  //     ok: {
  //       label: '确认',
  //       push: false,
  //       outline: true,
  //       color: 'primary'
  //     },
  //     cancel: {
  //       label: '放弃',
  //       push: false,
  //       unelevated: true,
  //       color: 'primary'
  //     }
  //   }).onOk(async () => {
  //     const respPostMemberRole = await context.dispatch('postMemberRole', {
  //       member_id: payload.member_id,
  //       role: payload.role
  //     })
  //     if (respPostMemberRole.status === 200) {
  //       // 保存最新member
  //       context.commit('storeGroupMemberTableSingleMember', {
  //         groupId: payload.groupId,
  //         member: respPostMemberRole.data
  //       })
  //       // 弹出通知
  //       Notify.create({
  //         classes: 'notification-positive shadow-15',
  //         icon: 'mdi-check-circle',
  //         textColor: 'light-green',
  //         message: '已经设置人员：' + respPostMemberRole.data.user.username + '为' + payload.role_name,
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     } else {
  //       // 弹出通知
  //       Notify.create({
  //         classes: 'notification-negative shadow-15',
  //         icon: 'mdi-alert',
  //         textColor: 'negative',
  //         message: '设置人员角色失败，请重试',
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //     }
  //   })
  // },
  // postMemberRole (context, payload: { member_id: string; role: 'member' | 'leader' }) {
  //   const api = apiBase + '/vo/members/' + payload.member_id + '/role/' + payload.role + '/'
  //   return axios.post(api)
  // },
  /* 修改group人员角色 */

  /* 新建group */
  // async createGroup (context, payload: { name: string; company: string; description: string; }) {
  //   // 检查输入合法性
  //   if (payload.name.trim() === '' || payload.company.trim() === '' || payload.description.trim() === '') {
  //     Notify.create({
  //       classes: 'notification-negative shadow-15',
  //       icon: 'mdi-alert',
  //       textColor: 'negative',
  //       message: '输入项不可为空，请全部填写',
  //       position: 'bottom',
  //       closeBtn: true,
  //       timeout: 5000,
  //       multiLine: false
  //     })
  //   } else {
  //     const respPostVO = await context.dispatch('postVO', { data: payload })
  //     if (respPostVO.status === 200) {
  //       // 更新table，因为group是个根依赖，新增一个组，要牵涉数据非常多，不如直接全部重读组相关数
  //       void await context.dispatch('forceLoadGroupModuleTable')
  //       // 通知
  //       Notify.create({
  //         classes: 'notification-positive shadow-15',
  //         icon: 'mdi-check-circle',
  //         textColor: 'light-green',
  //         message: '新建项目组成功',
  //         position: 'bottom',
  //         closeBtn: true,
  //         timeout: 5000,
  //         multiLine: false
  //       })
  //       // 跳转到group list
  //       // @ts-ignore
  //       this.$router.push({ path: '/my/group_obsolete/list' })
  //     } // 失败则由axios统一报错
  //   }
  // },
  // postVO (context, payload: { data: { name: string; company: string; description: string; } }) {
  //   const api = apiBase + '/vo/'
  //   return axios.post(api, payload.data)
  // },
  /* 新建group */

  // /* 删除group */
  // deleteGroupDialog (context, groupId: string) {
  //   // 检查组内云主机是否删除干净
  //   const countServers = context.rootGetters['vm_obsolete/getGroupServersByGroupId'](groupId)
  //   if (countServers.length > 0) {
  //     Notify.create({
  //       classes: 'notification-negative shadow-15',
  //       icon: 'mdi-check-circle',
  //       textColor: 'red',
  //       message: '请将组内的云主机全部删除后，再解散该项目组',
  //       position: 'bottom',
  //       closeBtn: true,
  //       timeout: 5000,
  //       multiLine: false
  //     })
  //   } else {
  //     // 操作的确认提示
  //     Dialog.create({
  //       class: 'dialog-primary',
  //       title: '解散项目组',
  //       message:
  //         '解散后的项目组无法恢复。 确认解散？',
  //       focus: 'cancel',
  //       ok: {
  //         label: '确认',
  //         push: false,
  //         outline: true,
  //         color: 'primary'
  //       },
  //       cancel: {
  //         label: '放弃',
  //         push: false,
  //         unelevated: true,
  //         color: 'primary'
  //       }
  //     }).onOk(async () => {
  //       // 发送请求
  //       const respDeleteVO = await context.dispatch('deleteVO', { path: { id: groupId } })
  //       if (respDeleteVO.status === 204) {
  //         // 更新table，因为group是个根依赖，删除一个组，要牵涉数据非常多，不如直接全部重读组相关数据
  //         void await context.dispatch('forceLoadGroupModuleTable')
  //         // notify
  //         Notify.create({
  //           classes: 'notification-positive shadow-15',
  //           icon: 'mdi-check-circle',
  //           textColor: 'light-green',
  //           message: '解散项目组成功',
  //           position: 'bottom',
  //           closeBtn: true,
  //           timeout: 5000,
  //           multiLine: false
  //         })
  //         // jump
  //         // @ts-ignore
  //         this.$router.push('/my/group_obsolete/list')
  //       }
  //     })
  //   }
  // },
  // deleteVO (context, payload: { path: { id: string } }) {
  //   const api = apiBase + '/vo/' + payload.path.id
  //   return axios.delete(api)
  // }
  // /* 删除group */
}

export default actions
