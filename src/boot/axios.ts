import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosError } from 'axios'
import qs from 'qs'
import { i18n } from 'boot/i18n'
import { Notify } from 'quasar'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// const api = axios.create(/* { timeout: 1000 , baseURL: 'https://api.example.com'} */)

// APIBASE的唯一配置。 包装好接口api base地址的axios实例
// 每一个前端部署要单独设置
const apiFed = axios.create({
  baseURL: window.location.protocol + '//vms.cstcloud.cn/api',
  // 序列化器，没有这个无法在query里发送数组参数。body里的数组不需要序列化器。 https://github.com/axios/axios/issues/604#issuecomment-321460450
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'comma' })
  }
})
const apiLogin = axios.create({
  baseURL: window.location.protocol + '//gosc-login.cstcloud.cn'
})

// 自己写的，把错误打印到console的helper函数，对业务无影响
const errorNotifier = (error: AxiosError) => {
  const errorRespMap: Map<number, string> = new Map([
    [400, i18n.global.tc('请求错误')],
    [401, '认证失败，请重新登录'],
    [403, '拒绝访问'],
    [404, '请求地址出错'],
    [408, '请求超时'],
    [409, i18n.global.tc('请求冲突')],
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
    console.log('error status: ', errorStatus + '-' + errorInfo)
    console.log('error message: ', error.response.data.message)

    // 无需通知用户的特殊情况
    if (error.response.data.code === 'NoMonitorJob') {
      // 没有配置监控
    } else {
      // 用户通知
      Notify.create({
        classes: 'notification-negative shadow-15',
        icon: 'mdi-alert',
        textColor: 'negative',
        message: errorStatus + '-' + errorInfo,
        caption: error.response.data.message,
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
    }
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

/* axios的拦截器 */ // 这个被server operation 使用
axios.interceptors.request.use(config => {
  // console.log('REQ-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('axios-REQ-Rejected')
  errorNotifier(error)
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
axios.interceptors.response.use(config => {
  // console.log('RESP-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('axios-RESP-Rejected')
  errorNotifier(error)
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
/* apiLogin的拦截器 */

/* apiFed的拦截器 */
apiFed.interceptors.request.use(config => {
  // console.log('REQ-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('apiFed-REQ-Rejected')
  errorNotifier(error)
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
apiFed.interceptors.response.use(config => {
  // console.log('RESP-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('apiFed-RESP-Rejected')
  errorNotifier(error)
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
/* apiFed的拦截器 */

/* apiLogin的拦截器 */
apiLogin.interceptors.request.use(config => {
  // console.log('REQ-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('apiLogin-REQ-Rejected')
  errorNotifier(error)
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
apiLogin.interceptors.response.use(config => {
  // console.log('RESP-Fulfilled')
  return config
}, (error: AxiosError) => {
  console.log('apiLogin-RESP-Rejected')
  errorNotifier(error)
  // 响应里的error信息在error.response.data里面，被包成了axios error对象
  // return error
  throw error // throw error就无法把错误传递给发送请求处
})
/* apiLogin的拦截器 */

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$axios = axios // 原生axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$apiFed = apiFed
  app.config.globalProperties.$apiLogin = apiLogin
})

// 项目里使用的axios全部从这里导出（已经带拦截器），不要使用原生axios
export { axios, apiFed, apiLogin }
