import { ActionTree } from 'vuex'
import { StateInterface, apiBase } from '../index'
import { ApplyQuotaModuleInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import { Dialog, Notify } from 'quasar'
import QuotaApplicationEditCard from 'components/Quota/QuotaApplicationEditCard.vue'
import ProviderAuditQuotaApplicationCard from 'components/Provider/ProviderAuditQuotaApplicationCard.vue'

const actions: ActionTree<ApplyQuotaModuleInterface, StateInterface> = {
  /* 初次获取全部applyQuota模块Table，已有则自动忽略 */
  updateQuotaApplicationTable (context) {
    if (!context.state.tables.userQuotaApplicationTable.isLoaded) {
      void context.dispatch('updateUserQuotaApplicationTable')
    }
    if (!context.state.tables.adminQuotaApplicationTable.isLoaded) {
      void context.dispatch('updateAdminQuotaApplicationTable')
    }
    if (!context.state.tables.globalQuotaActivityTable.isLoaded) {
      void context.dispatch('updateGlobalQuotaActivityTable')
    }
  },
  /* 初次获取全部applyQuota模块Table，已有则自动忽略 */

  // /* 修改配额申请 */
  // async patchAndUpdateUserQuotaApplicationTable (context, payload: {
  //   apply_id: string;
  //   data: {
  //     service_id: string;
  //     duration_days: number;
  //     vcpu: number;
  //     ram: number;
  //     private_ip: number;
  //     public_ip: number;
  //     disk_size: number;
  //     company: string;
  //     contact: string;
  //     purpose: string;
  //   }
  // }) {
  //   const respPatch = await context.dispatch('patchQuotaApplication', payload)
  //   const service = new schema.Entity('service')
  //   const quotaApplication = new schema.Entity('quotaApplication', { service })
  //   const normalizedData = normalize(respPatch.data, quotaApplication)
  //   context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
  // },
  // async patchQuotaApplication (context, payload: {
  //   apply_id: string;
  //   data: {
  //     service_id: string;
  //     duration_days: number;
  //     vcpu: number;
  //     ram: number;
  //     private_ip: number;
  //     public_ip: number;
  //     disk_size: number;
  //     company: string;
  //     contact: string;
  //     purpose: string;
  //   }
  // }) {
  //   const api = apiBase + '/apply/quota/' + payload.apply_id + '/'
  //   const response = await axios.patch(api, payload.data)
  //   return response
  // },

  // 修改quota申请
  editQuotaApplicationDialog (context, payload: { apply_id: string; isGroup?: boolean }) {
    Dialog.create({
      component: QuotaApplicationEditCard,
      componentProps: {
        applyId: payload.apply_id,
        isGroup: payload.isGroup
      }
    }).onOk(async (val: { data: Record<string, string | number> }) => {
      const respPatchApplyQuota = await context.dispatch('patchApplyQuota', {
        path: { apply_id: payload.apply_id },
        body: { data: val.data }
      })
      if (respPatchApplyQuota.status === 200) {
        if (payload.isGroup) {
          // 补充vo_id字段
          Object.assign(respPatchApplyQuota.data, { vo_id: context.state.tables.groupQuotaApplicationTable.byId[payload.apply_id].vo_id })
        }
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        const normalizedData = normalize(respPatchApplyQuota.data, application)
        // 保存进table
        payload.isGroup ? context.commit('storeGroupQuotaApplicationTable', normalizedData.entities.application) : context.commit('storeUserQuotaApplicationTable', normalizedData.entities.application)
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '修改配额申请成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '修改配额申请失败，请重试',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  async patchApplyQuota (context, payload: {
    path: { apply_id: string };
    body: {
      data: {
        service_id: string;
        duration_days: number;
        vcpu: number;
        ram: number;
        private_ip: number;
        public_ip: number;
        disk_size: number;
        company: string;
        contact: string;
        purpose: string;
      }
    }
  }) {
    const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/'
    return axios.patch(api, payload.body.data)
  },
  /* 修改配额申请 */

  /* 挂起配额申请 */
  async suspendAndUpdateAdminQuotaApplicationTable (context, apply_id: string) {
    const respSuspend = await context.dispatch('suspendQuotaApplication', apply_id)
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(respSuspend.data, quotaApplication)
    context.commit('storeAdminQuotaApplicationTable', normalizedData.entities.quotaApplication)
  },
  async suspendQuotaApplication (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/pending/'
    const response = await axios.post(api)
    return response
  },
  /* 挂起配额申请 */

  /* 通过配额申请 */
  async auditQuotaApplicationDialog (context, applyId: string) {
    // 检查当前申请状态，wait则挂起后再打开对话框
    const currentApplication = context.state.tables.adminQuotaApplicationTable.byId[applyId]
    if (currentApplication.status === 'wait') {
      await context.dispatch('suspendAndUpdateAdminQuotaApplicationTable', applyId)
    }
    Dialog.create({
      component: ProviderAuditQuotaApplicationCard,
      componentProps: {
        applyId
      }
    }).onOk((val: {isApprove: boolean; reason?: string}) => {
      if (val.isApprove) {
        console.log('批准')
        // 批准申请
        // 更新table
        // notify
      } else {
        console.log('拒绝')
        // 拒绝申请
        // 更新table
        // notify
      }
    })
  },
  async approveAndUpdateAdminQuotaApplicationTable (context, apply_id: string) {
    const respApprove = await context.dispatch('approveQuotaApplication', apply_id)
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(respApprove.data, quotaApplication)
    context.commit('storeAdminQuotaApplicationTable', normalizedData.entities.quotaApplication)
  },
  async approveQuotaApplication (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/pass/'
    const response = await axios.post(api)
    return response
  },
  /* 通过配额申请 */

  /* 拒绝配额申请 */
  async rejectAndUpdateAdminQuotaApplicationTable (context, apply_id: string) {
    const respReject = await context.dispatch('rejectQuotaApplication', apply_id)
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(respReject.data, quotaApplication)
    context.commit('storeAdminQuotaApplicationTable', normalizedData.entities.quotaApplication)
  },
  async rejectQuotaApplication (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/reject/'
    const response = await axios.post(api)
    return response
  },
  /* 拒绝配额申请 */

  /* 删除配额申请记录 */
  deleteGroupQuotaApplicationDialog (context, payload: { apply_id: string; isGroup?: boolean }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '删除配额申请记录',
      message:
        '删除后的申请记录无法恢复。 确认删除此记录？',
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
      const respDelete = await context.dispatch('deleteApplyQuota', payload.apply_id)
      if (respDelete.status === 204) {
        payload.isGroup ? context.commit('deleteGroupQuotaApplicationTable', payload.apply_id) : context.commit('deleteUserQuotaApplicationTable', payload.apply_id)
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '配额申请已经删除',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        // 弹出通知
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '配额申请删除失败，请重试',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  async deleteApplyQuota (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/'
    return axios.delete(api)
  },
  /* 删除配额申请记录 */

  /* 取消配额申请 */
  cancelGroupQuotaApplicationDialog (context, payload: { apply_id: string; isGroup: boolean }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '取消配额申请',
      message:
        '取消后的申请无法恢复。 确认取消此申请？',
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
      const respPostApplyQuotaCancel = await context.dispatch('postApplyQuotaCancel', { path: { apply_id: payload.apply_id } })
      if (respPostApplyQuotaCancel.status === 200) {
        if (payload.isGroup) {
          // 补充vo_id字段
          Object.assign(respPostApplyQuotaCancel.data, { vo_id: context.rootState.applyQuota.tables.groupQuotaApplicationTable.byId[payload.apply_id]?.vo_id })
        }
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        const normalizedData = normalize(respPostApplyQuotaCancel.data, application)
        // 存入table
        payload.isGroup ? context.commit('storeGroupQuotaApplicationTable', normalizedData.entities.application) : context.commit('storeUserQuotaApplicationTable', normalizedData.entities.application)
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '取消配额申请成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '取消配额申请失败，请重试',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  async postApplyQuotaCancel (context, payload: { path: { apply_id: string } }) {
    const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/cancel/'
    return axios.post(api)
  },
  /* 取消配额申请 */

  /*  提交配额申请 */
  async submitApplyQuota (context, data: { vo_id?: string; service_id: string; private_ip?: number; public_ip?: number; vcpu?: number; ram?: number; disk_size?: number; duration_days: number; company?: string; contact?: string; purpose?: string }) {
    const respPostApplyQuota = await context.dispatch('postApplyQuota', { data })
    if (respPostApplyQuota.status === 201) {
      if (data.vo_id) {
        // 如果是组配额，则需要补充vo_id字段,响应里是vo对象，再加一个vo_id字段
        Object.assign(respPostApplyQuota.data, { vo_id: respPostApplyQuota.data.vo.id })
      }
      // normalize
      const service = new schema.Entity('service')
      const vo = new schema.Entity('vo')
      const application = new schema.Entity('application', {
        service,
        vo
      })
      const normalizedData = normalize(respPostApplyQuota.data, application)
      // store
      data.vo_id ? context.commit('storeGroupQuotaApplicationTable', normalizedData.entities.application) : context.commit('storeUserQuotaApplicationTable', normalizedData.entities.application)
      // notify
      Notify.create({
        classes: 'notification-positive shadow-15',
        icon: 'mdi-check-circle',
        textColor: 'light-green',
        message: '提交配额申请成功',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
      // 跳转
      // @ts-ignore
      data.vo_id ? this.$router.push('/my/group/quota/application') : this.$router.push('/my/personal/quota/application')
    } else {
      // 弹出通知
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-alert',
        textColor: 'negative',
        message: '申请云主机配额失败，请重试',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    }
  },
  async postApplyQuota (context, payload: { data: { vo_id?: string; service_id: string; private_ip?: number; public_ip?: number; vcpu?: number; ram?: number; disk_size?: number; duration_days: number; company?: string; contact?: string; purpose?: string } }) {
    const api = apiBase + '/apply/quota/'
    const data = payload.data
    return axios.post(api, data)
  },
  /*  提交配额申请 */

  /* adminQuotaApplicationTable */
  // 只保存undeleted的application todo 应该保存全部，显示时筛选
  async updateAdminQuotaApplicationTable (context) {
    // 先清空table，避免多次更新时数据累加
    context.commit('clearAdminQuotaApplicationTable')
    // 再获取数据并更新table
    // todo 当前只请求了一次，若超过200项，应多次请求至最后，待完成此逻辑
    const respApply = await context.dispatch('fetchAdminApplication', { deleted: false })
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    respApply.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeAdminQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async fetchAdminApplication (context, payload?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] }) {
    const api = apiBase + '/apply/quota/admin/'
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
  /* adminQuotaApplicationTable */

  /* userQuotaApplicationTable */
  // 保存单个quota application
  updateUserQuotaApplicationTableSingleApplication (context, payload: Record<string, unknown>) {
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(payload, quotaApplication)
    context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
  },
  // 默认userQuotaApplicationTable只保存undeleted的application
  async updateUserQuotaApplicationTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearUserQuotaApplicationTable')
    // 再获取数据并更新table todo 应该保存全部，显示时筛选
    const respApply = await context.dispatch('getApplyQuota', { deleted: false })
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    respApply.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async getApplyQuota (context, payload?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] }) {
    const api = apiBase + '/apply/quota/'
    const config = {
      params: payload
    }
    return axios.get(api, config)
  },
  /* userQuotaApplicationTable */

  /* groupQuotaApplicationTable */
  async loadGroupApplicationTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearGroupApplicationTable')
    // 根据groupTable,建立groupApplicationTable
    for (const groupId of context.rootState.group.tables.groupTable.allIds) {
      // member没有权限请求这个接口, owner和leader可以
      if (context.rootState.group.tables.groupTable.byId[groupId].myRole !== 'member') {
        // 获取响应
        const respGroupApplication = await context.dispatch('getApplyQuotaVO', {
          path: { vo_id: groupId },
          query: { deleted: false }
        })
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        // application 数组
        for (const data of respGroupApplication.data.results) {
          /* 增加补充字段 */
          // 补充vo_id字段
          Object.assign(data, { vo_id: groupId })
          /* 增加补充字段 */
          // normalize data
          const normalizedData = normalize(data, application)
          // 存入groupQuotaTable
          context.commit('storeGroupQuotaApplicationTable', normalizedData.entities.application)
        }
      }
    }
  },
  // 此接口应保证当前用户是owner或者leader,否则返回403
  // payload 分为path和query两部分，方便分别获取
  async getApplyQuotaVO (context, payload: { path: { vo_id: string }, query?: { status?: string[]; service?: string; deleted?: boolean; page?: number; page_size?: number } }) {
    const api = apiBase + '/apply/quota/vo/' + payload.path.vo_id + '/'
    const config = { params: payload.query }
    return axios.get(api, config)
  },
  /* groupQuotaApplicationTable */

  /* globalQuotaActivityTable */
  async getActivityQuotaAndUpdateGlobalQuotaActivityTable (context, activityId: string) {
    const respQuota = await context.dispatch('fetchQuotaFromActivity', activityId)
    // const resp = {
    //   data: {
    //     quota_id: '15ec9dd6-e543-11eb-bd38-c8009fe2eb03'
    //   },
    //   status: 200,
    //   statusText: 'OK'
    // }

    // code 200 -> 正确领取：1.提示领取成功 2.更新userQuotaTable(更新领取的新配额)和globalQuotaActivityTable(更新剩余数量)
    if (respQuota.status === 200) {
      // 提示成功
      Dialog.create({
        class: 'dialog-positive',
        title: '成功',
        message:
          '配额领取成功',
        ok: {
          label: '确认',
          push: false,
          flat: true,
          unelevated: true,
          color: 'primary'
        }
      })
      // 强制更新table
      void context.dispatch('updateGlobalQuotaActivityTable')
      void context.dispatch('vm/updateUserQuotaTable', null, { root: true })
    } else {
      // code error -> 领取出错：提示错误
      Dialog.create({
        class: 'dialog-negative',
        title: '抱歉',
        message:
        respQuota.response.data.message, // 真正信息在respQuota.response.data里面
        ok: {
          label: '确认',
          push: false,
          flat: true,
          unelevated: true,
          color: 'primary'
        }
      })
    }
  },
  async fetchQuotaFromActivity (context, activityId: string) {
    const api = apiBase + '/quota-activity/' + activityId + '/get/'
    const response = await axios.get(api)
    return response
  },
  async updateGlobalQuotaActivityTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新
    // 当前没有强制清楚，避免了ui闪烁,但是也没有数据累加
    // context.commit('clearGlobalQuotaActivityTable')

    // 再获取数据并更新table
    // 当前table内容为筛选出active,排除未开始和已结束的，以后可根据需求全部获取，显示时进行筛选
    const respActivity = await context.dispatch('fetchQuotaActivity', {
      status: 'active',
      // 'exclude-not-start': true,
      'exclude-ended': true
    })
    // normalize信息
    const service = new schema.Entity('service')
    const user = new schema.Entity('user')
    const quotaActivity = new schema.Entity('quotaActivity', {
      service,
      user
    })
    respActivity.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaActivity)
      context.commit('storeGlobalQuotaActivityTable', normalizedData.entities.quotaActivity)
    })
  },
  async fetchQuotaActivity (context, payload?: { page?: number; page_size?: number; status?: 'active' | 'closed'; 'exclude-not-start'?: boolean; 'exclude-ended'?: boolean; }) {
    const api = apiBase + '/quota-activity/'
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
  }
  /* globalQuotaActivityTable */
}

export default actions
