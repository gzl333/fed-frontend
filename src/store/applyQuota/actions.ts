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
  async updateUserQuotaApplicationTable (context) {
    const respApply = await context.dispatch('fetchUserApplication')
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    respApply.data.results.forEach((data: Record<string, unknown>) => {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeUserQuotaApplicationTable', normalizedData.entities.quotaApplication)
    })
  },
  async fetchUserApplication (context) {
    const api = apiBase + '/apply/quota/'
    const response = await axios.get(api)
    return response
  }
  /* userQuotaApplicationTable */
}

export default actions
