import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UserInterface } from './state'

const actions: ActionTree<UserInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default actions
