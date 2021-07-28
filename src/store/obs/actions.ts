import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ObsStateInterface } from './state'

const actions: ActionTree<ObsStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
