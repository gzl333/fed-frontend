import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UserInterface } from './state'

const getters: GetterTree<UserInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
