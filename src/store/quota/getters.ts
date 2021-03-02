import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
}

export default getters
