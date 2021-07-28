import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { ApplyQuotaInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const applyQuota: Module<ApplyQuotaInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default applyQuota
