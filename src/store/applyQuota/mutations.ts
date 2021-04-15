import { MutationTree } from 'vuex'
import { ApplicationQuotaInterface, ApplyQuotaInterface } from './state'

const mutation: MutationTree<ApplyQuotaInterface> = {
  storeQuotaListFilter (state, filter: string) {
    state.pages.quotaList.filter = filter
  },
  storeAdminQuotaApplicationTable (state, tableObj: Record<string, ApplicationQuotaInterface>) {
    Object.assign(state.tables.adminQuotaApplicationTable.byId, tableObj)
    state.tables.adminQuotaApplicationTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.adminQuotaApplicationTable.allIds = [...new Set(state.tables.adminQuotaApplicationTable.allIds)]
    state.tables.adminQuotaApplicationTable.isLoaded = true
  },
  storeUserQuotaApplicationTable (state, tableObj: Record<string, ApplicationQuotaInterface>) {
    Object.assign(state.tables.userQuotaApplicationTable.byId, tableObj)
    state.tables.userQuotaApplicationTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userQuotaApplicationTable.allIds = [...new Set(state.tables.userQuotaApplicationTable.allIds)]
    state.tables.userQuotaApplicationTable.isLoaded = true
  }
}

export default mutation
