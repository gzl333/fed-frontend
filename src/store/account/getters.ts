import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountInterface } from './state'

const getters: GetterTree<AccountInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
