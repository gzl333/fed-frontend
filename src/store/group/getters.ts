import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupInterface } from './state'

const getters: GetterTree<GroupInterface, StateInterface> = {
  someGetter (/* context */) {
    // your code
  }
}

export default getters
