import { MutationTree } from 'vuex'
import { ApplicationQuotaInterface, ApplyQuotaInterface } from './state'

const mutation: MutationTree<ApplyQuotaInterface> = {
  // 删除单一user quota application
  deleteUserQuotaApplicationTable (state, apply_id: string) {
    const currentTable = state.tables.userQuotaApplicationTable
    currentTable.allIds = currentTable.allIds.filter(id => id !== apply_id)
    delete currentTable.byId[apply_id]
    if (currentTable.allIds.length === 0) {
      currentTable.isLoaded = false
    }
  },
  storeManageFilter (state, filter: string) {
    state.pages.manage.filter = filter
  },
  storeApplicationListFilter (state, filter: string) {
    state.pages.applicationList.filter = filter
  },
  clearAdminQuotaApplicationTable (state) {
    const currentTable = state.tables.adminQuotaApplicationTable
    currentTable.byId = {}
    currentTable.allIds = []
    currentTable.isLoaded = false
  },
  clearUserQuotaApplicationTable (state) {
    const currentTable = state.tables.userQuotaApplicationTable
    currentTable.byId = {}
    currentTable.allIds = []
    currentTable.isLoaded = false
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
  // storeItemInTable<T> (state: ApplyQuotaInterface, table: { allIds: string[], isLoaded: boolean; byId: Record<string, T> }, item: Record<string, T>) {
  //   Object.assign(table.byId, item)
  //   table.allIds.unshift(Object.keys(item)[0])
  //   table.allIds = [...new Set(table.allIds)]
  //   table.isLoaded = true
  // }
}

export default mutation
