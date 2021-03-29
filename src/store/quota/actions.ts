import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface, UquotaResponseInterface, ServiceInterface, TypeInterface, UserQuotaInterface } from './state'
import axios from 'axios'
import { ReqServerListInterface, ServerInterface } from '../usage/state'
const codeMap = new Map<number, string>(
  [
    [0, '无法获取状态'],
    [1, '运行中'],
    [2, '已屏蔽'],
    [3, '已暂停'],
    [4, '正在关机'],
    [5, '已关机'],
    [6, '已崩溃'],
    [7, '被电源管理器挂起'],
    [9, '与宿主机通讯失败'],
    [10, '已丢失'],
    [11, '正在创建'],
    [12, '创建失败']
  ]
)
const baseAPI = 'http://vms.gosc.cstcloud.cn/api/'
// context.state -> store.state.quota
const actions: ActionTree<QuotaInterface, StateInterface> = {
  async fetchQuota () {
    const response = await axios.get(baseAPI + 'u-quota/')
    return response
  },
  async fetchQuotaServers (context, payload: string) {
    const api = baseAPI + 'u-quota/' + payload + '/servers/'
    const response = await axios.get(api)
    return response
  },
  async updateQuota (context) {
    // console.log('in fetchQuota')
    const response: UquotaResponseInterface = (await context.dispatch('fetchQuota')).data
    // console.log(response)
    const servicesTemp: ServiceInterface[] = []
    response.results.forEach((responseResult) => {
      const serviceTypes: TypeInterface[] = []
      response.results.forEach((item) => {
        if (item.service.name === responseResult.service.name) {
          const type = {
            type: item.tag.display,
            id: item.id,
            privateIpTotal: item.private_ip_total,
            privateIpUsed: item.private_ip_used,
            publicIpTotal: item.public_ip_total,
            publicIpUsed: item.public_ip_used,
            vCpuTotal: item.vcpu_total,
            vCpuUsed: item.vcpu_used,
            ramTotal: item.ram_total,
            ramUsed: item.ram_used,
            diskTotal: item.disk_size_total,
            diskUsed: item.disk_size_used,
            expirationTime: item.expiration_time,
            deleted: item.deleted,
            display: item.display
          }
          serviceTypes.push(type)
        }
      })
      const service = {
        name: responseResult.service.name,
        id: responseResult.service.id,
        serviceTypes: serviceTypes
      }
      servicesTemp.push(service)
    })

    // servicesTemp:按照service去重
    const res = new Map()
    const services = servicesTemp.filter((servicesTemp) => !res.has(servicesTemp.name) && res.set(servicesTemp.name, 1))

    const payload: {userQuota: UserQuotaInterface;} = {
      userQuota: {
        userEmail: response.results[0].user.username,
        services: services
      }
    }
    // console.log('before storeQuota', payload)
    context.commit('storeQuota', payload)
    // console.log('back in fetch', context.state)

    // 更新每个配额下的server数量
    // for (const server of context.state.userQuota.services) {}
  },
  async fetchServerList (context, payload?: ReqServerListInterface) {
    const api = baseAPI + 'server/'
    const config = {
      params: { ...payload }
    }
    const response = await axios.get(api, config)
    // console.log(config)
    // console.log('response in fetchServerList:', response)
    return response
  },
  async fetchServerStatus (context, payload: string) {
    const api = baseAPI + 'server/' + payload + '/status/'
    const response = await axios.get(api)
    return response
  },
  async updateServerList (context) {
    // 每次获取serverList之前先从store.pagination取得当前分页信息
    const payload: ReqServerListInterface = {
      page: context.state.pagination.page,
      page_size: context.state.pagination.pageSize
    }
    // console.log('ajax req in quota actions:', payload)
    // 根据payload发送请求
    const resServerList = await context.dispatch('fetchServerList', payload)
    // console.log('res', resServerList)

    // 保存resp中分页信息，分页store中count的来源
    context.commit('storePagination', { count: resServerList.data.count })
    // console.log('resServerList.data:', resServerList.data)
    // 保存resp中server信息
    // const resServers: ServerInterface[] = resServerList.data.servers
    // console.log(resServers)
    const serverList: ServerInterface[] = []
    for (const resServer of resServerList.data.servers) {
      serverList.push(resServer)
    }
    context.commit('storeServerList', serverList)
    // console.log(context.state.serverList)

    // 给每个server一个初始空status，启动loading按钮进行占位，防止页面抖动
    for (const server of context.state.serverList) {
      context.commit('storeServerStatus', {
        id: server.id,
        status: ''
      })
    }

    // 更新每个server的status
    for (const server of context.state.serverList) {
      void context.dispatch('fetchServerStatus', server.id).then((value) => {
        const payload = {
          id: server.id,
          status: codeMap.get(value.data.status.status_code)
        }
        context.commit('storeServerStatus', payload)
        // console.log(server.status)
      })
    }

    // console.log(context.state.serverList)
    // console.log('end update list')
  },
  async vmOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeServerStatus', {
      id: payload.id,
      status: ''
    })
    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 状态更新应延时获取
    void await new Promise(resolve => (
      setTimeout(resolve, 3000)
    ))
    const resServerStatus = await context.dispatch('fetchServerStatus', payload.id)
    context.commit('storeServerStatus', {
      id: payload.id,
      status: codeMap.get(resServerStatus.data.status.status_code)
    })
    // console.log('vmOperaton', context.state.serverList)

    return response
  }
}

export default actions
