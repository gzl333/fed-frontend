import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountModuleInterface } from './state'
import { Dialog, Notify } from 'quasar'
import axios from 'axios'
import { apiFed, apiLogin } from 'boot/axios'
import { normalize, schema } from 'normalizr'
import api from 'boot/api'
import GroupEditCard from 'components/Group/GroupEditCard.vue'
import GroupAddMemberCard from 'components/Group/GroupAddMemberCard.vue'

// 注意此时context.state是store.state.account，而不是store.state
const actions: ActionTree<AccountModuleInterface, StateInterface> = {
  /* data */
  async cstAskUrl () {
    // 本函数只负责获取科技云通行证登录页面地址，并跳转。 code及token处理、/login路由跳转逻辑处理，均放在router.beforeEach中
    // 获取cst登录url
    const respPostLoginUrl = await api.login.cst.postAskUrl({ query: { clientUrl: window.location.origin + '/login' } })
    // 跳转至获取token的url
    window.location.href = respPostLoginUrl.data.data
  },
  async cstLogin (context, code: string) {
    // 获取token
    const respPostDealCode = await api.login.cst.postDealCode({ query: { code } })
    // 保存token并改变用户登录状态,保存用户信息
    context.commit('storeUser', {
      access: respPostDealCode.data.data.accessToken,
      refresh: respPostDealCode.data.data.refreshToken,
      loginType: 'cst'
    })
  },
  cstLogout (context) {
    context.commit('deleteUser')
    window.location.href = apiLogin.defaults.baseURL + '/open/api/UMTOauthLogin/loginOut?loginOutUrl=' + window.location.origin
  },
  // 页面刷新时从浏览器localStorage里读取token
  async reloadToken (context) {
    if (localStorage.getItem('access') && localStorage.getItem('refresh') && localStorage.getItem('loginType')) {
      const localToken = {
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
        loginType: localStorage.getItem('loginType')
      }
      const respPostCheckToken = localToken.loginType === 'cst' ? await api.login.cst.postCheckToken({ query: { jwtToken: localToken.access! } }) : await api.login.aai.postCheckToken({ query: { jwtToken: localToken.access! } })
      if (respPostCheckToken.data.code === 200 && respPostCheckToken.data.data === true) {
        context.commit('storeUser', localToken)
      } else {
        void await context.dispatch('cstLogout')
      }
    }
  },
  retainToken (context) {
    if (context.state.data.access && context.state.data.refresh && context.state.data.loginType) { // $store中的token状态
      const refreshToken = context.state.data.refresh
      const decodedToken = context.state.data.decoded!
      if (decodedToken.exp) {
        // const timeOut = decodedToken.exp * 1000 - Date.now() - 3595000 // 测试用，快速refresh
        const timeOut = decodedToken.exp * 1000 - Date.now() - 5000 // 到期时间前5秒钟更新token,到期时间小于5秒时立即尝试更新token
        console.log('retain timeout', timeOut)
        setTimeout(() => {
          // https://stackoverflow.com/questions/63488141/promise-returned-in-function-argument-where-a-void-return-was-expected/63488201
          void (async () => {
            try {
              if (context.state.data.access && context.state.data.refresh && context.state.data.loginType) { // 定时器注册后，仅在用户保持登录时更新token，登出则定时器不执行，不再更新
                // 先删除请求头中已有的token
                delete axios.defaults.headers.common.Authorization // token绑定到axios对象上
                delete apiFed.defaults.headers.common.Authorization // apiFed对象已经生成，只把token写在axios对象上不行，也要补充给apiFed对象
                delete apiLogin.defaults.headers.common.Authorization // 是否有必要待定?
                // 获取更新到的access token todo 更新aai部分
                const respPostRefreshToken = await api.login.cst.postRefreshToken({ query: { refreshToken } })
                if (respPostRefreshToken.data.code === 200) {
                  context.commit('storeUser', {
                    access: respPostRefreshToken.data.data.accessToken,
                    refresh: respPostRefreshToken.data.data.refreshToken,
                    loginType: context.state.data.loginType
                  })
                  // console.log(context.state.token)
                  await context.dispatch('retainToken')
                } else {
                  void await context.dispatch('cstLogout')
                  Notify.create({
                    classes: 'notification-negative shadow-15',
                    icon: 'mdi-alert',
                    textColor: 'negative',
                    message: '登录失效，请重新登录',
                    position: 'bottom',
                    closeBtn: true,
                    timeout: 5000,
                    multiLine: false
                  })
                }
              }
            } catch (error) {
              void await context.dispatch('cstLogout')
            }
          })()
        }, timeOut)
      }
    }
  },
  /* data */

  /* table */
  // 强制加载group相关table
  forceLoadGroupModuleTable (context) {
    void context.dispatch('account/loadGroupTable', null, { root: true }).then(() => {
      // groupMemberTable 依赖 groupTable, 根据每个groupId建立一个groupMember对象
      void context.dispatch('account/loadGroupMemberTable', null, { root: true }).then(() => {
        // 注意：此表依赖groupTable中的myRole字段，而该字段是loadGroupMemberTableFromGroup副产品，所以产生依赖
        void context.dispatch('server/loadGroupQuotaApplicationTable', null, { root: true })
      })
      void context.dispatch('server/loadGroupServerTable', null, { root: true })
      void context.dispatch('server/loadGroupQuotaTable', null, { root: true })
    })
  },
  // 加载groupTable
  async loadGroupTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupTable)
    // 发送请求
    const respGroup = await api.vo.getVo()
    // normalize
    const group = new schema.Entity('group')
    for (const data of respGroup.data.results) {
      // 添加role字段
      const currentId = context.state.data.decoded?.email
      const myRole = currentId === data.owner.username ? 'owner' : 'member'
      Object.assign(data, { myRole })
      // normalize
      const normalizedData = normalize(data, group)
      context.commit('storeTable', {
        table: context.state.tables.groupTable,
        tableObj: normalizedData.entities.group
      })
    }
  },
  // 根据groupTable,建立groupMemberTable
  async loadGroupMemberTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupMemberTable)
    for (const groupId of context.state.tables.groupTable.allIds) {
      const respGroupMember = await api.vo.getVoListMembers({ path: { id: groupId } })
      // 是否把组长添加进member列表？
      // 把groupId字段补充进去
      Object.assign(respGroupMember.data, { id: groupId })
      // normalize
      const groupMember = new schema.Entity('groupMember')
      const normalizedData = normalize(respGroupMember.data, groupMember)
      // 存入state
      context.commit('storeTable', {
        table: context.state.tables.groupMemberTable,
        tableObj: normalizedData.entities.groupMember
      })

      // 给groupTable补充role字段
      const currentId = context.state.data.decoded?.email
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
  /* table */

  /* dialog */
  /* 修改group信息 */
  editGroupDialog (context, groupId: string) {
    // // 把整个对话框对象包在promise里。删除成功、失败包装为promise结果值。
    // return new Promise((resolve, reject) => {
    // 操作的确认提示
    Dialog.create({
      component: GroupEditCard,
      componentProps: {
        groupId
      }
    }).onOk(async (val: { name: string; company: string; description: string }) => {
      // val是onDialogOK调用时传入的实参
      // 发送patch请求
      const respPatchGroup = await api.vo.patchVo({
        path: { id: groupId },
        body: val
      })
      if (respPatchGroup.status === 200) {
        // 加入myRole字段
        Object.assign(respPatchGroup.data, { myRole: context.state.tables.groupTable.byId[groupId].myRole })
        // 保存响应内最新信息
        const newGroup = { [respPatchGroup.data.id]: respPatchGroup.data }
        // 保存最新group
        context.commit('storeTable', {
          table: context.state.tables.groupTable,
          tableObj: newGroup
        })
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '项目组信息修改成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // resolve(true)
      } /* else {
        // 弹出通知
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '项目组信息修改失败，请重试',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // reject(false) // 待研究：用reject还是resolve
      } */
    })
    // })
  },
  /* 修改group信息 */

  /* 增加group人员 */
  addGroupMemberDialog (context, groupId: string) {
    Dialog.create({
      component: GroupAddMemberCard,
      componentProps: {
        groupId
      }
    }).onOk(async (val: { /* groupId: string; */usernames: string[] }) => { // val是onDialogOK调用时传入的实参
      // 发送patch请求
      const respPostAddMembers = await api.vo.postVoAddMembers({
        path: { id: groupId },
        body: val
      })
      // 此请求可能有多个成功，多个失败混在一起。因此不能用状态码判断。
      // 把成功的账户member信息存入table
      for (const member of respPostAddMembers.data.success) {
        // 存入单个member
        context.commit('storeGroupMemberTableSingleMember', {
          groupId,
          member
        })
        // 通知：单个member成功信息
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '已经成功添加人员:' + member.user.username,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
      // 通知：失败账户错误信息
      for (const member of respPostAddMembers.data.failed) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '添加人员失败：' + member.username + ' - ' + member.message,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /* 增加group人员 */

  /* 移除group人员 */
  removeSingleGroupMemberDialog (context, payload: { groupId: string; username: string }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '移除项目组人员：' + payload.username,
      message:
        '确认移除?',
      focus: 'cancel',
      ok: {
        label: '确认',
        push: false,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respPostRemoveMembers = await api.vo.postVoRemoveMembers({
        path: { id: payload.groupId },
        body: { usernames: [payload.username] }
      })
      if (respPostRemoveMembers.status === 204) {
        // 保存最新group
        context.commit('deleteGroupMemberTableSingleMember', payload)
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '已经移除项目组人员：' + payload.username,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /* 移除group人员 */

  /* 修改group人员角色 */
  editGroupMemberRoleDialog (context, payload: { groupId: string; member_id: string; role: 'member' | 'leader'; role_name: string }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '将人员设置为：' + payload.role_name,
      message:
        '确认设置?',
      focus: 'cancel',
      ok: {
        label: '确认',
        push: false,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respPostMemberRole = await api.vo.postVoMembersRole({
        path: {
          member_id: payload.member_id,
          role: payload.role
        }
      })
      if (respPostMemberRole.status === 200) {
        // 保存最新member
        context.commit('storeGroupMemberTableSingleMember', {
          groupId: payload.groupId,
          member: respPostMemberRole.data
        })
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '已经设置人员：' + respPostMemberRole.data.user.username + '为' + payload.role_name,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /* 修改group人员角色 */

  /* 新建group */
  async createGroupDialog (context, payload: { name: string; company: string; description: string; }) {
    // 检查输入合法性
    if (payload.name.trim() === '' || payload.company.trim() === '' || payload.description.trim() === '') {
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-alert',
        textColor: 'negative',
        message: '输入项不可为空，请全部填写',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    } else {
      const respPostVO = await api.vo.postVo({ body: payload })
      if (respPostVO.status === 200) {
        // 重要：更新table，因为group是个根依赖，新增一个组，要牵涉数据非常多，不如直接全部重读组相关数
        void await context.dispatch('forceLoadGroupModuleTable')
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '新建项目组成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // 跳转到group list
        // @ts-ignore
        this.$router.push({ path: '/my/group/list' })
      } // 失败则由axios统一报错
    }
  },
  /* 新建group */

  /* 删除group */
  deleteGroupDialog (context, groupId: string) {
    // 检查组内:云主机、配额、配额申请记录 是否删除干净
    const isServerPurged = Boolean(context.rootGetters['server/getGroupServersByGroupId'](groupId).length === 0)
    const isQuotaPurged = Boolean(context.rootGetters['server/getGroupQuotasByGroupIdByStatus'](groupId, 'all').length === 0)
    const isQuotaApplicationPurged = Boolean(context.rootGetters['server/getGroupQuotaApplicationsByGroupId'](groupId).length === 0)

    if (!isServerPurged) {
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-check-circle',
        textColor: 'red',
        message: '请将组内的云主机全部删除后，再解散该项目组',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    } else if (!isQuotaPurged) {
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-check-circle',
        textColor: 'red',
        message: '请将组内的云主机配额全部删除后，再解散该项目组',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    } else if (!isQuotaApplicationPurged) {
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-check-circle',
        textColor: 'red',
        message: '请将组内的云主机配额申请记录全部删除后，再解散该项目组',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    } else {
      // 操作的确认提示
      Dialog.create({
        class: 'dialog-primary',
        title: '解散项目组',
        message:
          '解散后的项目组无法恢复。 确认解散？',
        focus: 'cancel',
        ok: {
          label: '确认',
          push: false,
          outline: true,
          color: 'primary'
        },
        cancel: {
          label: '放弃',
          push: false,
          unelevated: true,
          color: 'primary'
        }
      }).onOk(async () => {
        // 发送请求
        const respDeleteVO = await api.vo.deleteVo({ path: { id: groupId } })
        if (respDeleteVO.status === 204) {
          // 更新table，因为group是个根依赖，删除一个组，要牵涉数据非常多，不如直接全部重读组相关数据
          void await context.dispatch('forceLoadGroupModuleTable')
          // notify
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'mdi-check-circle',
            textColor: 'light-green',
            message: '解散项目组成功',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          // jump
          // @ts-ignore
          this.$router.push('/my/group/list')
        }
      })
    }
  }
  /* 删除group */
  /* dialog */
}

export default actions
