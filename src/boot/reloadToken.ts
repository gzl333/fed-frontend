import { boot } from 'quasar/wrappers'

export default boot(async ({ store }) => {
  try {
    console.log(window.location.origin)
    await store.dispatch('account/reloadToken')
    await store.dispatch('account/retainToken')
  } catch (e) {
    console.log('Boot login error:', e)
  }
})
