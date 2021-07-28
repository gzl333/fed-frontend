import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  try {
    console.log(window.location.origin)
    await store.dispatch('account/reloadCstToken')
    await store.dispatch('account/retainCstToken')
  } catch (e) {
    console.log('Boot login error:', e)
  }
})
