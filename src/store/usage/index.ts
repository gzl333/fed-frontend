import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { UsageInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const usage: Module<UsageInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default usage
