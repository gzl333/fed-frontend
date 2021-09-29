import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface } from './state'

const actions: ActionTree<ServerModuleInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
