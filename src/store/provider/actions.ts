import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderModuleInterface } from './state'

const actions: ActionTree<ProviderModuleInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
