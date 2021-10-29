import { MutationTree } from 'vuex'
import { FedModuleInterface } from './state'

const mutation: MutationTree<FedModuleInterface> = {
  // 向本模块table中保存item的通用方法
  storeItem<T> (state: FedModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    item: Record<string, T>
  }) {
    Object.assign(payload.table.byId, payload.item)
    payload.table.allIds.unshift(Object.keys(payload.item)[0])
    payload.table.allIds = [...new Set(payload.table.allIds)]
  },
  // 改变table的isLoaded状态
  storeStatus<T> (state: FedModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    isLoaded: boolean
  }) {
    payload.table.isLoaded = payload.isLoaded
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

  /* 泛型尝试，vuex4.0似乎不支持泛型 */
  // storeItemInTable<T> (state: ApplyQuotaInterface, table: { allIds: string[], isLoaded: boolean; byId: Record<string, T> }, item: Record<string, T>) {
  //   Object.assign(table.byId, item)
  //   table.allIds.unshift(Object.keys(item)[0])
  //   table.allIds = [...new Set(table.allIds)]
  //   table.isLoaded = true
  // }
}

export default mutation
