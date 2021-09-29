import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaModuleInterface } from './state'

const actions: ActionTree<QuotaModuleInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
