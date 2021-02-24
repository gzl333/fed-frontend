import { createStore } from 'vuex'

// import example from './module-example'
// import { ExampleStateInterface } from './module-example/state'

import user from './user'
import { UserInterface } from 'src/store/user/state'

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
  user: UserInterface
  // example: ExampleStateInterface
}

const store = createStore<StateInterface>({
  modules: {
    user
    // example
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING
})
export default store
