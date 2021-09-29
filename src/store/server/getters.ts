import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface } from './state'

const getters: GetterTree<ServerModuleInterface, StateInterface> = {
  someGetter (/* context */) {
    // your code
  }
}

export default getters
