import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ApplicationQuotaInterface, ApplyQuotaModuleInterface } from './state'

const getters: GetterTree<ApplyQuotaModuleInterface, StateInterface> = {
  // 根据用户选择的filter来返回application数组
  getAdminApplicationsByFilter: (state) => (filter: string): ApplicationQuotaInterface[] => {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: ApplicationQuotaInterface, b: ApplicationQuotaInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (filter === '0') {
      return Object.values(state.tables.adminQuotaApplicationTable.byId).sort(sortFn)
    } else {
      const rows: ApplicationQuotaInterface[] = []
      for (const application of Object.values(state.tables.adminQuotaApplicationTable.byId)) {
        if (application.status === filter) {
          rows.push(application)
        }
      }
      return rows.sort(sortFn)
    }
  },
  // 根据用户选择的filter来返回application数组
  getUserApplicationsByFilter: (state) => (filter: string): ApplicationQuotaInterface[] => {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: ApplicationQuotaInterface, b: ApplicationQuotaInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (filter === '0') {
      return Object.values(state.tables.userQuotaApplicationTable.byId).sort(sortFn)
    } else {
      const rows: ApplicationQuotaInterface[] = []
      for (const application of Object.values(state.tables.userQuotaApplicationTable.byId)) {
        if (application.status === filter) {
          rows.push(application)
        }
      }
      return rows.sort(sortFn)
    }
  }
}

export default getters
