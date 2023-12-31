import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { FedModuleInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const fedModule: Module<FedModuleInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default fedModule
