import { MutationTree } from 'vuex'
import { UsageInterface, DataCenterOnShowInterface, DataRootInterface } from './state'

const mutation: MutationTree<UsageInterface> = {
  storeDataPointTree (state, payload: DataRootInterface[]) {
    state.dataPointTree = payload
  },
  storeDataCenterOnShow (state, payload: DataCenterOnShowInterface) {
    state.dataCenterOnSow = payload
  }
}

export default mutation
