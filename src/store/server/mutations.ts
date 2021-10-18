import { MutationTree } from 'vuex'
import { ServerInterface, ServerModuleInterface } from './state'

const mutation: MutationTree<ServerModuleInterface> = {
  // 向本模块table中保存对象的通用方法
  storeTable<T> (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
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
    }
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
  },
  // 删除本模块table单个对象的通用方法
  deleteSingleItem<T> (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    },
    id: string
  }) {
    payload.table.allIds = payload.table.allIds.filter(id => id !== payload.id)
    delete payload.table.byId[payload.id]
    if (payload.table.allIds.length === 0) {
      payload.table.isLoaded = false
    }
  },
  // 保存单个item的单个field
  storeField (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, ServerInterface> // 此处固定为ServerInterface
      allIds: string[]
      isLoaded: boolean
    }
    id: string
    field: keyof ServerInterface
    value: never // 可以更加细化，利用field: SeverInterface[field]
  }) {
    payload.table.byId[payload.id][payload.field] = payload.value
  },
  // 保存单个server的status
  storeSingleServerStatus (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, ServerInterface> // 此处固定为ServerInterface
      allIds: string[]
      isLoaded: boolean
    }
    serverId: string
    status_code: string
  }) {
    payload.table.byId[payload.serverId].status = payload.status_code
  },
  // 保存单个server的remarks
  storeSingleServerRemarks (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, ServerInterface> // 此处固定为ServerInterface
      allIds: string[]
      isLoaded: boolean
    }
    serverId: string
    remarks: string
  }) {
    payload.table.byId[payload.serverId].remarks = payload.remarks
  }
}

export default mutation
