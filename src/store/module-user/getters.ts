import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UserInterface } from './state'

const getters: GetterTree<UserInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default getters
