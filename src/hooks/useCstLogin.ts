import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default function () {
  const $store = useStore<StateInterface>()

  return async () => {
    // loginCard 只负责获取科技云通行证登录页面地址，并跳转。 code及token处理、/login路由跳转逻辑处理，均放在router.beforeEach中
    const respUrl = await $store.dispatch('account/fetchCstLoginUrl')
    window.location.href = respUrl.data.data
    console.log(respUrl.data.data)
  }
}
