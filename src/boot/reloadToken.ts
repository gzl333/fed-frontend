import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  await store.dispatch('user/reloadCstToken')
  await store.dispatch('user/retainCstToken')
})
