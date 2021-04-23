import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ApplyQuotaInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import { Dialog } from 'quasar'

// const apiBase = 'https://vms.cstcloud.cn/api'
const apiBase = 'http://223.193.2.211:88/api'

const actions: ActionTree<ApplyQuotaInterface, StateInterface> = {
  /* 初次获取全部applyQuota模块Table，已有则自动忽略 */
  updateQuotaApplicationTable (context) {
    if (!context.state.tables.userQuotaApplicationTable.isLoaded) {
      void context.dispatch('updateUserQuotaApplicationTable')
    }
    if (!context.state.tables.adminQuotaApplicationTable.isLoaded) {
      void context.dispatch('updateAdminQuotaApplicationTable')
    }
  },
  /* 初次获取全部applyQuota模块Table，已有则自动忽略 */

  /* 修改配额申请 */
  async patchAndUpdateUserQuotaApplicationTable (context, payload: {
    apply_id: string;
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
  }) {
    const respPatch = await context.dispatch('patchQuotaApplication', payload)
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(respPatch.data, quotaApplication)
    context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
  },
  async patchQuotaApplication (context, payload: {
    apply_id: string;
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
  }) {
    const api = apiBase + '/apply/quota/' + payload.apply_id + '/'
    const response = await axios.patch(api, payload.data)
    return response
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
  deleteAndUpdateUserQuotaApplicationTable (context, apply_id: string) {
    // 操作的确认提示
    Dialog.create({
      title: '将要删除配额申请记录',
      message:
        '删除后的申请记录无法恢复。 确认删除此记录？',
      ok: {
        label: '确认',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respDelete = await context.dispatch('deleteQuotaApplication', apply_id)
      if (respDelete.status === 204) {
        context.commit('deleteUserQuotaApplicationTable', apply_id)
      }
    })
  },
  async deleteQuotaApplication (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/'
    const response = await axios.delete(api)
    return response
  },
  /* 删除配额申请记录 */

  /* 取消配额申请 */
  cancelAndUpdateUserQuotaApplicationTable (context, apply_id: string) {
    // 操作的确认提示
    Dialog.create({
      title: '将要取消配额申请',
      message:
        '取消后的申请无法恢复。 确认取消此申请？',
      ok: {
        label: '确认',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respCancel = await context.dispatch('cancelQuotaApplication', apply_id)
      const service = new schema.Entity('service')
      const quotaApplication = new schema.Entity('quotaApplication', { service })
      const normalizedData = normalize(respCancel.data, quotaApplication)
      context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async cancelQuotaApplication (context, apply_id: string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/cancel/'
    const response = await axios.post(api)
    return response
  },
  /* 取消配额申请 */

  /*  提交配额申请 */
  async submitQuotaApplication (context, payload: { service_id: string; private_ip: number; public_ip: number; vcpu: number; ram: number; disk_size: number; duration_days: number; company: string; contact: string; purpose: string }) {
    const api = apiBase + '/apply/quota/'
    const data = payload
    const response = await axios.post(api, data)
    return response
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
    // 先清空table，避免多次更新时数据累加
    context.commit('clearUserQuotaApplicationTable')
    // 再获取数据并更新table todo 应该保存全部，显示时筛选
    const respApply = await context.dispatch('fetchUserApplication', { deleted: false })
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    respApply.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async fetchUserApplication (context, payload?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] }) {
    const api = apiBase + '/apply/quota/'
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
  /* userQuotaApplicationTable */
}

export default actions
