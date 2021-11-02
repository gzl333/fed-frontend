import { MutationTree } from 'vuex'
import { ProviderModuleInterface } from './state'

const mutation: MutationTree<ProviderModuleInterface> = {
  // 向本模块table中保存item的通用方法
  storeItem<T> (state: ProviderModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
      count?: number
    }
    item: Record<string, T>
  }) {
    Object.assign(payload.table.byId, payload.item)
    payload.table.allIds.unshift(Object.keys(payload.item)[0])
    payload.table.allIds = [...new Set(payload.table.allIds)]
  },
  // 改变table的isLoaded状态
  storeStatus<T> (state: ProviderModuleInterface, payload: {
    table: {
      byId: Record<string, T>
      allIds: string[]
      isLoaded: boolean
      count?: number
    }
    isLoaded: boolean
  }) {
    payload.table.isLoaded = payload.isLoaded
  },
  // 清空本模块table的通用方法
  clearTable<T> (state: ProviderModuleInterface, table: {
    byId: Record<string, T>
    allIds: string[]
    isLoaded: boolean
    count?: number
  }) {
    table.byId = {}
    table.allIds = []
    table.isLoaded = false
    table.count = 0
  },
  // 保存单个item的单个field
  storeField<T> (state: ProviderModuleInterface, payload: {
    table: {
      byId: Record<string, T> // T为byId中单个对象的类型
      allIds: string[]
      isLoaded: boolean
      count?: number
    }
    id: string
    field: keyof T
    value: never // todo 可以更加细化，利用field: SeverInterface[field]
  }) {
    payload.table.byId[payload.id][payload.field] = payload.value
  }
}

export default mutation
