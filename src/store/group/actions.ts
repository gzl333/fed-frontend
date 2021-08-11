import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupInterface } from './state'

const actions: ActionTree<GroupInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
