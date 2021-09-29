import { MutationTree } from 'vuex'
import { FedModuleInterface } from './state'

const mutation: MutationTree<FedModuleInterface> = {
  // 向本模块table中保存对象的通用方法
  storeTable<T> (state: FedModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    },
    tableObj: Record<string, T>
  }) {
    Object.assign(payload.table.byId, payload.tableObj)
    payload.table.allIds.unshift(Object.keys(payload.tableObj)[0])
    payload.table.allIds = [...new Set(payload.table.allIds)]
    payload.table.isLoaded = true
  },
  // 清空本模块table的通用方法
  clearTable<T> (state: FedModuleInterface, table: {
    byId: Record<string, T>
    allIds: string[]
    isLoaded: boolean
  }) {
    table.byId = {}
    table.allIds = []
    table.isLoaded = false
  },
  storeDataCenterTableServices (state, payload: { dataCenterId: string; serviceId: string; }) {
    state.tables.dataCenterTable.byId[payload.dataCenterId].services.unshift(payload.serviceId)
    state.tables.dataCenterTable.byId[payload.dataCenterId].services = [...new Set(state.tables.dataCenterTable.byId[payload.dataCenterId].services)]
  }
}

export default mutation
