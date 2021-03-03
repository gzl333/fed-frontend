import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosError } from 'axios'
import { Loading, Notify } from 'quasar'

const errorNotifier = (error: AxiosError) => {
  const errorRespMap: Map<number, string> = new Map([
    [400, '请求错误'],
    [401, '认证失败，请核实电子邮箱地址或密码后重新登录'],
    [403, '拒绝访问'],
    [404, '请求地址出错'],
    [408, '请求超时'],
    [500, '服务器内部错误'],
    [501, '服务未实现'],
    [502, '网关错误'],
    [503, '服务不可用'],
    [505, 'HTTP版本不受支持']
  ])
  let notifyMsg: Record<string, string | number>
  if (error.response && error.response.data) { // 有响应时
    const errorStatus = error.response.status
    const errorInfo = errorRespMap.get(errorStatus) || ''
    const errorMsg: string = error.response.data.message
    // const errorCode:string = error.response.data.code
    notifyMsg = {
      type: 'negative',
      message: errorStatus,
      caption: `${errorInfo}
                ${errorMsg}`
    }
  } else { // 没有响应时
    notifyMsg = {
      type: 'negative',
      message: error.message
    }
  }
  Notify.create(notifyMsg)
}

axios.interceptors.request.use(config => {
  Loading.show()
  return config
}, error => {
  Loading.hide()
  errorNotifier(error)
  throw error
})
axios.interceptors.response.use(config => {
  Loading.hide()
  return config
}, error => {
  Loading.hide()
  errorNotifier(error)
  throw error
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create(/* { timeout: 1000 , baseURL: 'https://api.example.com'} */)

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
