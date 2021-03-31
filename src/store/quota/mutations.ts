import { MutationTree } from 'vuex'
import { ServerInterface_old } from '../usage/state'
import { QuotaInterface, PaginationInterface, UserQuotaInterface } from './state'

// 注意此时context是store.state.quota，而不是store.state
const mutation: MutationTree<QuotaInterface> = {
  storeQuota (state: QuotaInterface, payload: {userQuota: UserQuotaInterface;}) {
    state.userQuota = payload.userQuota
    // state.groupQuota = payload.groupQuota
  },
  storePagination (state, payload: PaginationInterface) {
    // console.log('quota-payload:', payload)
    for (const key in payload) {
      // @ts-ignore
      state.pagination[key] = payload[key]
    }
    // console.log('current store', state.pagination)
  },
  storeServerList (state, payload: ServerInterface_old[]) {
    state.serverList = payload
  },
  storeServerStatus (state, payload: { id: string; status: string }) {
    const currentServer = state.serverList.find((server) => {
      return server.id === payload.id
    })
    if (currentServer) {
      currentServer.status = payload.status
    }
  }
}

export default mutation
