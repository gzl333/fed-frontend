import { createStore } from 'vuex'
import accountModule from './account'
import { AccountModuleInterface } from 'src/store/account/state'
import fedModule from './fed'
import { FedModuleInterface } from './fed/state'
import providerModule from 'src/store/provider'
import { ProviderModuleInterface } from 'src/store/provider/state'
import serverModule from './server'
import { ServerModuleInterface } from './server/state'

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
  fed: FedModuleInterface
  provider: ProviderModuleInterface
  server: ServerModuleInterface
}

const store = createStore<StateInterface>({
  modules: {
    account: accountModule,
    fed: fedModule,
    provider: providerModule,
    server: serverModule
  },
  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
})
export default store
