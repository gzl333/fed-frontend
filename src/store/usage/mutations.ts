import { MutationTree } from 'vuex'
import { UsageInterface, DataRootInterface, ServerInterface } from './state'

const mutation: MutationTree<UsageInterface> = {
  storeDataPointTree (state, payload: DataRootInterface[]) {
    state.dataPointTree = payload
  },
  storeServerList (state, payload: ServerInterface[]) {
    state.serverList = payload
  }
}

export default mutation
