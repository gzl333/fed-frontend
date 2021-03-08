import { MutationTree } from 'vuex'
import { UsageInterface, DataRootInterface, ServerInterface, DataPointOnShowInterface, PaginationInterface } from './state'

const mutation: MutationTree<UsageInterface> = {
  storeDataPointTree (state, payload: DataRootInterface[]) {
    state.dataPointTree = payload
  },
  storeServerList (state, payload: ServerInterface[]) {
    state.serverList = payload
  },
  storeServerStatus (state, payload: {id: string; status:string}) {
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
    state.pagination = payload
  }

}

export default mutation
