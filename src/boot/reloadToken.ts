import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  try {
    await store.dispatch('account/reloadCstToken')
    await store.dispatch('account/retainCstToken')
  } catch (e) {
    console.log('Boot login error:', e)
  }
})
