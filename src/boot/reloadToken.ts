import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  await store.dispatch('account/reloadCstToken')
  await store.dispatch('account/retainCstToken')
})
