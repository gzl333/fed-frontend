import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { GroupModuleInterface } from './state'

const getters: GetterTree<GroupModuleInterface, StateInterface> = {
  someGetter (/* context */) {
    // your code
  }
}

export default getters
