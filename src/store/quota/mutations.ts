import { MutationTree } from 'vuex'
import { QuotaInterface } from './state'

// 注意此时context是store.state.quota，而不是store.state
const mutation: MutationTree<QuotaInterface> = {
  storeQuota (state: QuotaInterface, payload: QuotaInterface) {
    state.userQuota = payload.userQuota
    state.groupQuota = payload.groupQuota
  }
}

export default mutation
