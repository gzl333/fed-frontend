import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { VmModuleInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const vmModule: Module<VmModuleInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default vmModule
