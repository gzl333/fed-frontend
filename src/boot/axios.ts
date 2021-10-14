import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosError } from 'axios'
import { Loading, Notify } from 'quasar'

// 自己写的，把错误打印到console的helper函数，对业务无影响
const errorNotifier = (error: AxiosError) => {
  const errorRespMap: Map<number, string> = new Map([
    [400, '请求错误'],
    [401, '认证失败，请重新登录'],
    [403, '拒绝访问'],
    [404, '请求地址出错'],
    [408, '请求超时'],
    [500, '服务器内部错误'],
    [501, '服务未实现'],
    [502, '网关错误'],
    [503, '服务不可用'],
    [505, 'HTTP版本不受支持']
  ])

  if (error.response && error.response.data) { // 有响应时
    // console打印
    const errorStatus = error.response.status
    const errorInfo = errorRespMap.get(errorStatus) || ''
    console.log('error status: ', errorInfo)
    console.log('error message: ', error.response.data.message)
    // 用户通知
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: errorStatus + errorInfo,
      caption: error.response.data.message,
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  } else { // 没有响应时
    // console打印
    console.log(error.message)
    // 用户通知
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'mdi-alert',
      textColor: 'negative',
      message: error.message,
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  }
}

axios.interceptors.request.use(config => {
  // todo /server/相关请求节流：记录请求及时间，固定秒数内对同一id的操作请求被拦截并提示：  errorNotifier('msg') throw error
  // 使用server status的api时延时较长，关闭全局loading bar，使用组件自己的loading状态
  if (config.url?.indexOf('/status/')) {
    return config
  }
  Loading.show()
  return config
}, error => {
  Loading.hide()
  errorNotifier(error)
  return error
})

axios.interceptors.response.use(config => {
  Loading.hide()
  return config
}, (error: AxiosError) => {
  Loading.hide()
  errorNotifier(error)
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  return error // throw error就无法把错误传递给发送请求处
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// 原本的api是一个axios对象
const api = axios.create(/* { timeout: 1000 , baseURL: 'https://api.example.com'} */)
// APIBASE的唯一配置。 包装好接口api base地址的axios实例
const apiFed = axios.create({ baseURL: window.location.protocol + '//vms.cstcloud.cn/api' })
const apiLogin = axios.create({ baseURL: window.location.protocol + '//gosc-login.cstcloud.cn' })

export { axios, api, apiFed, apiLogin }

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})
