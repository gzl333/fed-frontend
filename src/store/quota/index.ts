import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { QuotaInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const quota: Module<QuotaInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default quota
