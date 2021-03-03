import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { Loading, Dialog } from 'quasar'

axios.interceptors.request.use(config => {
  Loading.show()
  return config
}, error => {
  // 以下错误提示暂未测试
  Dialog.create({
    title: error.response.data.code,
    message: error.response.data.message
  })
  throw error
})
axios.interceptors.response.use(config => {
  Loading.hide()
  return config
}, error => {
  Loading.hide()
  throw error
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create(/* { baseURL: 'https://api.example.com' } */)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
