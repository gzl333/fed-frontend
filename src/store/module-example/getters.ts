import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ExampleStateInterface } from './state'

const getters: GetterTree<ExampleStateInterface, StateInterface> = {
  someAction (/* state */) {
    // your code
  }
}

export default getters
