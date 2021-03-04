import { MutationTree } from 'vuex'
import { DataCenterInterface, UsageInterface, DataCenterOnShowInterface } from './state'

const mutation: MutationTree<UsageInterface> = {
  storeDataPointTree (state, payload: DataCenterInterface[]) {
    state.dataPointTree = payload
  },
  storeDataCenterOnShow (state, payload: DataCenterOnShowInterface) {
    state.dataCenterOnSow = payload
  }
}

export default mutation
