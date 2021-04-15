import { createStore } from 'vuex'

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state'

import account from './account'
import { AccountInterface } from 'src/store/account/state'

import vm from './vm'
import { VmInterface } from 'src/store/vm/state'

import applyQuota from './applyQuota'
import { ApplyQuotaInterface } from 'src/store/applyQuota/state'

// to delete
import quota from './quota'
import { QuotaInterface } from 'src/store/quota/state'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  // example: ExampleStateInterface

  account: AccountInterface,
  vm: VmInterface,
  applyQuota: ApplyQuotaInterface,

  // to delete
  quota: QuotaInterface
}

const store = createStore<StateInterface>({
  modules: {
    // example
    account,
    vm,
    applyQuota,

    // to delete
    quota
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
})
export default store
