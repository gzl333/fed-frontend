import { MutationTree } from 'vuex'
import { ApplicationQuotaInterface, ApplyQuotaInterface } from './state'

const mutation: MutationTree<ApplyQuotaInterface> = {
  // 删除单一 quota application
  deleteUserQuotaApplicationTable (state, apply_id: string) {
    const currentTable = state.tables.userQuotaApplicationTable
    currentTable.allIds = currentTable.allIds.filter(id => id !== apply_id)
    delete currentTable.byId[apply_id]
    if (currentTable.allIds.length === 0) {
      currentTable.isLoaded = false
    }
  },
  storeApplicationListFilter (state, filter: string) {
    state.pages.applicationList.filter = filter
  },
  storeAdminQuotaApplicationTable (state, tableObj: Record<string, ApplicationQuotaInterface>) {
    const currentTable = state.tables.adminQuotaApplicationTable
    Object.assign(currentTable.byId, tableObj)
    currentTable.allIds.unshift(Object.keys(tableObj)[0])
    currentTable.allIds = [...new Set(currentTable.allIds)]
    currentTable.isLoaded = true
  },
  storeUserQuotaApplicationTable (state, tableObj: Record<string, ApplicationQuotaInterface>) {
    const currentTable = state.tables.userQuotaApplicationTable
    Object.assign(currentTable.byId, tableObj)
    currentTable.allIds.unshift(Object.keys(tableObj)[0])
    currentTable.allIds = [...new Set(currentTable.allIds)]
    currentTable.isLoaded = true
  }
}

export default mutation
