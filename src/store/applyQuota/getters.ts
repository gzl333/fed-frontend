import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ApplicationQuotaInterface, ApplyQuotaInterface } from './state'

const getters: GetterTree<ApplyQuotaInterface, StateInterface> = {

  // 根据用户选择的filter来返回application数组
  getAdminApplicationsByFilter (state): ApplicationQuotaInterface[] {
    // 当前选择的filter位于state.applyQuota.manage.filter，利用manage页面中的watch来修改
    if (state.pages.manage.filter === '0') {
      return Object.values(state.tables.adminQuotaApplicationTable.byId)
    } else {
      const rows: ApplicationQuotaInterface[] = []
      for (const application of Object.values(state.tables.adminQuotaApplicationTable.byId)) {
        if (application.status === state.pages.manage.filter) {
          rows.push(application)
        }
      }
      return rows
    }
  },
  // 根据用户选择的filter来返回application数组
  getUserApplicationsByFilter (state): ApplicationQuotaInterface[] {
    // 当前选择的filter位于state.applyQuota.applicationList.filter，利用applicationList页面中的watch来修改
    if (state.pages.applicationList.filter === '0') {
      return Object.values(state.tables.userQuotaApplicationTable.byId)
    } else {
      const rows: ApplicationQuotaInterface[] = []
      for (const application of Object.values(state.tables.userQuotaApplicationTable.byId)) {
        if (application.status === state.pages.applicationList.filter) {
          rows.push(application)
        }
      }
      return rows
    }
  }
}

export default getters
