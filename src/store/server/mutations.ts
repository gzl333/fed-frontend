import { MutationTree } from 'vuex'
import { ServerInterface, ServerModuleInterface } from './state'

const mutation: MutationTree<ServerModuleInterface> = {
  // 向本模块table中保存item的通用方法
  storeItem<T> (state: ServerModuleInterface, payload: {
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
  storeStatus<T> (state: ServerModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
    }
    isLoaded: boolean
  }) {
    payload.table.isLoaded = payload.isLoaded
  },
  storeItemLocalId<T> (state: ServerModuleInterface, payload: {
    table: {
      byLocalId: Record<string, T>
      allLocalIds: string[]
      isLoaded: boolean
    }
    item: Record<string, T>
  }) {
    Object.assign(payload.table.byLocalId, payload.item)
    payload.table.allLocalIds.unshift(Object.keys(payload.item)[0])
    payload.table.allLocalIds = [...new Set(payload.table.allLocalIds)]
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
  },

  // todo 保存单个item的单个field
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
  }
}

export default mutation
