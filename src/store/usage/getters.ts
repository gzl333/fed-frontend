import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UsageInterface } from './state'

const getters: GetterTree<UsageInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
