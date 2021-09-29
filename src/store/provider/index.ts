import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { ProviderModuleInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const providerModule: Module<ProviderModuleInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default providerModule
