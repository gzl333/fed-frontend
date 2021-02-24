import { boot } from 'quasar/wrappers'

export default boot(({ store }) => {
  void store.dispatch('user/reloadToken')
})
