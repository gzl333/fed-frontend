import { Module } from 'vuex'
import { StateInterface } from '../index'
import state, { AccountInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const account: Module<AccountInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default account
