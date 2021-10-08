import { createStore } from 'vuex'

// old modules
import accountModule from './account'
import { AccountModuleInterface } from 'src/store/account/state'
import vmModule from './vm'
import { VmModuleInterface } from 'src/store/vm/state'
// import applyQuotaModule from './applyQuota_obsolete'
// import { ApplyQuotaModuleInterface } from 'src/store/applyQuota_obsolete/state'
import groupModule from './group'
import { GroupModuleInterface } from 'src/store/group/state'

// new modules
import fedModule from './fed'
import { FedModuleInterface } from './fed/state'
import providerModule from 'src/store/provider'
import { ProviderModuleInterface } from 'src/store/provider/state'
import serverModule from './server'
import { ServerModuleInterface } from './server/state'

/* 全局API BASE */
// todo api整理结束后删除
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
  account: AccountModuleInterface,
  vm: VmModuleInterface,
  // applyQuota: ApplyQuotaModuleInterface,
  group: GroupModuleInterface,

  // new modules
  fed: FedModuleInterface
  provider: ProviderModuleInterface
  server: ServerModuleInterface
}

const store = createStore<StateInterface>({
  modules: {
    // old
    account: accountModule,
    vm: vmModule,
    // applyQuota: applyQuotaModule,
    group: groupModule,

    // new modules
    fed: fedModule,
    provider: providerModule,
    server: serverModule
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
})
export default store
