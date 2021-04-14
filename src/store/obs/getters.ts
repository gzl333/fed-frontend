import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ObsStateInterface } from './state'

const getters: GetterTree<ObsStateInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
