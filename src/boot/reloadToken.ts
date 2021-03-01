import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  await store.dispatch('user/reloadToken')
  await store.dispatch('user/retainToken')
})
