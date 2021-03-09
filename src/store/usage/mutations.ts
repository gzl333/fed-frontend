import { MutationTree } from 'vuex'
import {
  UsageInterface,
  DataRootInterface,
  ServerInterface,
  DataPointOnShowInterface,
  PaginationInterface
} from './state'

const mutation: MutationTree<UsageInterface> = {
  storeDataPointTree (state, payload: DataRootInterface[]) {
    state.dataPointTree = payload
  },
  storeServerList (state, payload: ServerInterface[]) {
    state.serverList = payload
  },
  storeServerStatus (state, payload: { id: string; status: string }) {
    const currentServer = state.serverList.find((server) => {
      return server.id === payload.id
    })
    if (currentServer) {
      currentServer.status = payload.status
    }
  },
  storeDataPointOnShow (state, payload: DataPointOnShowInterface) {
    state.dataPointOnShow = payload
  },
  storePagination (state, payload: PaginationInterface) {
    // console.log('storePayload', payload)
    for (const key in payload) {
      // @ts-ignore
      state.pagination[key] = payload[key]
    }
    if (state.pagination.serviceId === '0') {
      delete state.pagination.serviceId
    }
    // console.log('current store', state.pagination)
  }

}

export default mutation
