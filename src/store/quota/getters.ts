import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaModuleInterface } from './state'

const getters: GetterTree<QuotaModuleInterface, StateInterface> = {
  someGetter (/* context */) {
    // your code
  }
}

export default getters
