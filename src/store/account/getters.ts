import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountModuleInterface } from './state'

const getters: GetterTree<AccountModuleInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
