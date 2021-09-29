import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderModuleInterface } from './state'

const getters: GetterTree<ProviderModuleInterface, StateInterface> = {
  someGetter (/* context */) {
    // your code
  }
}

export default getters
