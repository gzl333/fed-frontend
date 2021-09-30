import { MutationTree } from 'vuex'
import { ServerModuleInterface } from './state'

const mutation: MutationTree<ServerModuleInterface> = {
  // 向本模块table中保存对象的通用方法
  storeTable<T> (state: ServerModuleInterface, payload: {
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
  storeTableLocalId<T> (state: ServerModuleInterface, payload: {
    table: {
      byLocalId: Record<string, T>
      allLocalIds: string[]
      isLoaded: boolean
    },
    tableObj: Record<string, T>
  }) {
    Object.assign(payload.table.byLocalId, payload.tableObj)
    payload.table.allLocalIds.unshift(Object.keys(payload.tableObj)[0])
    payload.table.allLocalIds = [...new Set(payload.table.allLocalIds)]
    payload.table.isLoaded = true
  },
  // 清空本模块table的通用方法
  clearTable<T> (state: ServerModuleInterface, table: {
    byId: Record<string, T>
    allIds: string[]
    isLoaded: boolean
  }) {
    table.byId = {}
    table.allIds = []
    table.isLoaded = false
  }
}

export default mutation
