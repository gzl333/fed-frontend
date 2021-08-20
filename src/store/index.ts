import { createStore } from 'vuex'
// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state'
import accountModule from './account'
import { AccountModuleInterface } from 'src/store/account/state'
import vmModule from './vm'
import { VmModuleInterface } from 'src/store/vm/state'
import applyQuotaModule from './applyQuota'
import { ApplyQuotaModuleInterface } from 'src/store/applyQuota/state'
import groupModule from './group'
import { GroupModuleInterface } from 'src/store/group/state'

/* 全局API BASE */
// 根据用户访问协议来决定api地址的https/http
export const apiBase = window.location.protocol + '//vms.cstcloud.cn/api'
/* 全局API BASE */

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

  account: AccountModuleInterface,
  vm: VmModuleInterface,
  applyQuota: ApplyQuotaModuleInterface,
  group: GroupModuleInterface
}

const store = createStore<StateInterface>({
  modules: {
    // example
    account: accountModule,
    vm: vmModule,
    applyQuota: applyQuotaModule,
    group: groupModule
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
})
export default store
