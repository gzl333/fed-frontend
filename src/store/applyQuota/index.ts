import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { ApplyQuotaModuleInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const applyQuotaModule: Module<ApplyQuotaModuleInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default applyQuotaModule
