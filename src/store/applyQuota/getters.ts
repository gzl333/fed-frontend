import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ApplyQuotaInterface } from './state'
// import { QuotaInterface } from 'src/store/vm/state'

const getters: GetterTree<ApplyQuotaInterface, StateInterface> = {
  // getUserQuotasByFilter (state, getters, rootstate): QuotaInterface[] {
  //   // 根据用户选择的filter来返回quota数组
  //   // 当前选择的filter位于state.vm.pages.quotaList.filter，利用quotaList中的watch来修改
  //   if (state.pages.quotaList.filter === '0') {
  //     return Object.values(rootstate.vm.tables.userQuotaTable.byId)
  //   } else {
  //     const rows: QuotaInterface[] = []
  //     for (const quota of Object.values(rootstate.vm.tables.userQuotaTable.byId)) {
  //       if (quota.status === state.pages.quotaList.filter) {
  //         rows.push(quota)
  //       }
  //     }
  //     return rows
  //   }
  // }
}

export default getters
