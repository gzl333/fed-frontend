import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { QuotaModuleInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const quotaModule: Module<QuotaModuleInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default quotaModule
