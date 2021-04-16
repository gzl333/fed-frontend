import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ApplyQuotaInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'

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

  /* 删除配额申请记录 */
  async deleteAndUpdateQuotaApplication (context, apply_id: string) {
    const respDelete = await context.dispatch('deleteQuotaApplication', apply_id)
    if (respDelete.status === 204) {
      context.commit('deleteUserQuotaApplicationTable', apply_id)
    }
  },
  async deleteQuotaApplication (context, apply_id:string) {
    const api = apiBase + '/apply/quota/' + apply_id + '/'
    const response = await axios.delete(api)
    return response
  },
  /* 删除配额申请记录 */

  /* 取消配额申请 */
  async cancelAndUpdateQuotaApplication (context, apply_id: string) {
    const respCancel = await context.dispatch('cancelQuotaApplication', apply_id)
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    const normalizedData = normalize(respCancel.data, quotaApplication)
    context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
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
  async updateAdminQuotaApplicationTable (context) {
    const respApply = await context.dispatch('fetchAdminApplication')
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    respApply.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeAdminQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async fetchAdminApplication (context) {
    const api = apiBase + '/apply/quota/admin/'
    const response = await axios.get(api)
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
