import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import {
  UsageInterface,
  TreeRootInterface,
  ResServiceResultInterface,
  ReqServerListInterface,
  // ResServerInterface,
  // ServerInterface_old,
  ReqServerNote, DataPointNetworkInterface, ReqServerCreate
  // ServiceInterface_old
  // , PaginationInterface
} from './state'
import axios, { AxiosResponse } from 'axios'
import { normalize, schema } from 'normalizr'

const apiBase = 'https://vms.cstcloud.cn/api'
const statusCodeMap = new Map<number, string>(
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

const actions: ActionTree<UsageInterface, StateInterface> = {
  // vmlist页面中的云主机操作
  async vmOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeAllServerTableSingleStatus', {
      serverId: payload.id,
      status_code: ''
    })

    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 如果删除主机，重新获取allServerTable
    if (payload.action === 'delete' || payload.action === 'delete_force') {
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 更新allServerTable
      void await context.dispatch('updateAllServerTable')
    } else {
      // 其它操作只更新该主机状态
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 更新单个server status
      void await context.dispatch('updateAllServerTableSingleStatus', payload.id)
    }
    return response
  },
  // allServerTable 更新单个server的status
  async updateAllServerTableSingleStatus (context, serverId: string) {
    const respStatus = await context.dispatch('fetchServerStatus', serverId)
    context.commit('storeAllServerTableSingleStatus', {
      serverId,
      status_code: statusCodeMap.get(respStatus.data.status.status_code)
    })
  },
  // allServerTable
  async updateAllServerTable (context) {
    // 先清空allServerTable，避免多次更新时数据累加
    context.commit('clearAllServerTable')

    // 发送请求
    const respServers = await context.dispatch('fetchServers')
    // 将响应normalize，存入state里的allServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('suer_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    for (const data of respServers.data.servers) {
      const normalizedData = normalize(data, server)
      context.commit('storeAllServerTable', normalizedData.entities.server)
    }
    // console.log(context.state.allServerTable)
    // 建立allServerTable之后，分别更新每个server status
    for (const serverId of context.state.allServerTable.allIds) {
      void await context.dispatch('updateAllServerTableSingleStatus', serverId)
    }
  },
  async fetchServerStatus (context, serverId: string) {
    const api = apiBase + '/server/' + serverId + '/status/'
    const response = await axios.get(api)
    return response
  },
  async fetchServerVNC (context, serverId: string) {
    const api = apiBase + '/server/' + serverId + '/vnc/'
    const response = await axios.get(api)
    return response
  },
  async fetchServers (context, payload?: { page?: number; page_size?: number; service_id?: string; }) {
    const api = apiBase + '/server/'
    let response
    if (payload) {
      const config = {
        params: payload
      }
      response = await axios.get(api, config)
    } else {
      response = await axios.get(api)
    }
    return response
  },
  // allDataCenterTable
  async updateAllDataCenterTable (context) {
    const respDataCenters = await context.dispatch('fetchDataCenters')
    const dataCenter = new schema.Entity('dataCenter', {})
    respDataCenters.data.registries.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, dataCenter)
      context.commit('storeAllDataCenterTable', normalizedData.entities.dataCenter)
    })
    // console.log(context.state.allDataCenterTable)
  },
  async fetchDataCenters () {
    const api = apiBase + '/registry/'
    const response = await axios.get(api)
    return response
  },
  // userServiceTable
  async updateUserServiceTable (context) {
    // 发送请求
    const respServices = await context.dispatch('fetchServices', { available_only: true })
    // 将响应normalize，存入state里的serviceTable
    const data_center = new schema.Entity('data_center')
    const service = new schema.Entity('service', { data_center })
    respServices.data.results.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, service)
      context.commit('storeUserServiceTable', normalizedData.entities.service)
    })
    // 标注serviceTable isLoaded
    // context.commit('storeServiceTable', { isLoaded: true })
    // console.log(context.state.userServiceTable)
  },
  async fetchServices (context, payload?: { page?: number; page_size?: number; center_id?: string; available_only?: boolean; }) {
    const api = apiBase + '/service/'
    let response
    if (payload) {
      const config = {
        params: payload
      }
      response = await axios.get(api, config)
    } else {
      response = await axios.get(api)
    }
    return response
  },
  /*
  以上为重构数据结构
  */
  async serverDetailOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // todo 将主机状态清空，界面将显示loading 待验证
    context.commit('storeAllServerTableSingleStatus', {
      serverId: payload.id,
      status_code: ''
    })

    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 状态更新应延时获取
    void await new Promise(resolve => (
      setTimeout(resolve, 3000)
    ))
    // todo 更新单个server status 待验证
    void await context.dispatch('updateAllServerTableSingleStatus', payload.id)
    // const respFetchServerStatus = await context.dispatch('fetchServerStatus', payload.id)
    // const status = codeMap.get(respFetchServerStatus.data.status.status_code)
    // context.commit('storeServerDetailStatus', status)

    return response
  },
  async patchVpnPassword (context, payload: { serviceId: string; password: string }) {
    const api = apiBase + '/vpn/' + payload.serviceId
    const data = {
      password: payload.password
    }
    const response = await axios.patch(api, data)
    return response
  },
  // 获取并存储全部用户有关的vpn信息
  async updateVpnAll (context) {
    // 获取用户全部相关service
    const respFetchService = await context.dispatch('fetchService', { available_only: true })
    for (const service of respFetchService.data.results) {
      // 拿到每个service， 用service.id获取并更新单个vpn信息
      void await context.dispatch('updateVpn', {
        serviceId: service.id,
        serviceName: service.name
      })
    }
  },
  // 获取并存储单个vpn信息
  async updateVpn (context, payload: { serviceId: string; serviceName: string }) {
    const respFetchVpn = await context.dispatch('fetchVpn', payload.serviceId)
    context.commit('storeVpn', {
      ...payload,
      vpn: respFetchVpn.data.vpn
    })
  },
  async fetchVpn (context, serviceId: string) {
    const api = apiBase + '/vpn/' + serviceId
    const response = await axios.get(api)
    return response
  },

  // async updateServerInfo (context, serverId: string) {
  //   // serverDetail中： id='0'是直接进入页面，应重定向；id=''是在读取中，应loading，其它状态则显示信息
  //   // 先清空已有的server detail
  //   void context.commit('clearServerDetail')
  //   // 获取新的server detail
  //   const respFetchServerInto = await context.dispatch('fetchServerInfo', serverId)
  //   context.commit('storeServerDetail', respFetchServerInto.data.server)
  //   // 为server detail 获取status
  //   const respFetchServerStatus = await context.dispatch('fetchServerStatus', serverId)
  //   const status = codeMap.get(respFetchServerStatus.data.status.status_code)
  //   context.commit('storeServerDetailStatus', status)
  // },

  async fetchServerInfo (context, id: string) {
    const api = apiBase + '/server/' + id
    const response = axios.get(api)
    return response
  },
  async createServer (context, payload: ReqServerCreate) {
    const api = apiBase + '/server/'
    const data = payload
    const response = axios.post(api, data)
    return response
  },
  async fetchFlavor (/* context */) {
    const api = apiBase + '/flavor/'
    const response = await axios.get(api)
    return response
  },
  // async updateServiceList (context) {
  //   if (context.state.dataPointTree[0].children.length === 0) {
  //     void await context.dispatch('updateDataPointTree')
  //   }
  //   for (const dataCenter of context.state.dataPointTree[0].children) {
  //     for (const dataPoint of dataCenter.children) {
  //       const service: ServiceInterface_old = {
  //         serviceId: dataPoint.key,
  //         serviceName: dataPoint.label,
  //         networks: {
  //           public: [],
  //           private: []
  //         },
  //         images: [],
  //         flavors: []
  //       }
  //
  //       // 根据dataPointTree上建立的network信息来构建
  //       // todo 将networks单独建立一个表
  //       dataPoint.networks.forEach((network) => {
  //         if (network.public) {
  //           service.networks.public.unshift(network)
  //         } else {
  //           service.networks.private.unshift(network)
  //         }
  //       })
  //
  //       const resImage = await context.dispatch('fetchImage', dataPoint.key)
  //       service.images = resImage.data
  //       const resFlavor = await context.dispatch('fetchFlavor')
  //       service.flavors = resFlavor.data.flavors
  //       context.commit('storeService', service)
  //     }
  //   }
  //   // console.log(context.state.serviceList)
  // },
  async fetchImage (context, payload: string) {
    const api = apiBase + '/image/'
    const config = {
      params: {
        service_id: payload
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  async fetchNetwork (context, payload: string) {
    const api = apiBase + '/network/'
    const config = {
      params: {
        service_id: payload
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  async patchNote (context, payload: ReqServerNote) {
    // const api = apiBase + '/server/' + payload.id + '/remark/'
    const api = `${apiBase}/server/${payload.id}/remark/`
    const config = { params: { remark: payload.remark } }
    const response = await axios.patch(api, null, config)
    return response
  },
  async fetchService (context, payload?: { page?: number; page_size?: number; center_id?: string; available_only?: boolean; }) {
    const api = apiBase + '/service/'
    let response
    if (payload) {
      const config = {
        params: payload
      }
      response = await axios.get(api, config)
    } else {
      response = await axios.get(api)
    }
    return response
  },
  async updateDataPointTree (context) {
    // 获取全部与用户有关的service
    const response = await context.dispatch('fetchService', { available_only: true })
    const results: ResServiceResultInterface[] = response.data.results
    // translate response to dataPointTree
    const dataPointTree: TreeRootInterface[] = [{
      key: '0',
      label: '全部节点',
      icon: 'storage',
      children: []
    }]
    results.forEach((resPoint) => {
      let hasCenter = false
      dataPointTree[0].children.forEach((treeCenter) => {
        if (treeCenter.label === resPoint.data_center.name) {
          hasCenter = true
        }
      })
      if (!hasCenter) {
        dataPointTree[0].children.unshift({
          key: resPoint.data_center.name, // 因为datacenter和datapoint的key都是数值，这里避免与datapoint key重复
          label: resPoint.data_center.name,
          selectable: false,
          children: []
        })
      }
    })
    // second iteration to add dataPoints to dataCenters
    for (const resPoint of results) {
      for (const treeCenter of dataPointTree[0].children) {
        if (treeCenter.label === resPoint.data_center.name) {
          // 建立dataPointTree时，额外添加的network信息，共serviceList使用
          // todo 优化结构，此处不再存储network，或者单独建立network表，或者在serviceList建立时再取数据
          const resNetwork: AxiosResponse = await context.dispatch('fetchNetwork', resPoint.id)
          const networks: DataPointNetworkInterface[] = []
          resNetwork.data.forEach((network: DataPointNetworkInterface) => {
            networks.unshift(network)
          })

          treeCenter.children.unshift({
            key: resPoint.id,
            label: resPoint.name,
            serviceType: resPoint.service_type,
            icon: 'storage',
            networks: networks
          })
        }
      }
    }
    context.commit('storeDataPointTree', dataPointTree)
    // console.log(context.state.dataPointTree)
  },
  async fetchServerList (context, payload?: ReqServerListInterface) {
    const api = apiBase + '/server/'
    const config = {
      params: { ...payload }
    }
    const response = await axios.get(api, config)
    // console.log(config)
    return response
  }
  // ,
  // async updateServerList (context) {
  //   // 每次获取serverList之前先从store.pagination取得当前分页信息
  //   const payload: ReqServerListInterface = {
  //     page: context.state.pagination.page,
  //     page_size: context.state.pagination.pageSize
  //   }
  //   // serviceId 不为0时才有config发出，为0就是获取全部list，没有config发出
  //   if (context.state.pagination.serviceId !== '0') {
  //     payload.service_id = context.state.pagination.serviceId
  //   }
  //   // console.log('ajax req', payload)
  //   // 根据payload发送请求
  //   const resServerList = await context.dispatch('fetchServerList', payload)
  //
  //   // console.log('res', resServerList)
  //   // 保存resp中分页信息，分页store中count的来源
  //   context.commit('storePagination', { count: resServerList.data.count })
  //   // console.log(resServerList.data)
  //   // 保存resp中server信息
  //   // console.log(resServers)
  //   const serverList: ServerInterface_old[] = []
  //   for (const resServer of resServerList.data.servers) {
  //     serverList.push(resServer)
  //   }
  //   context.commit('storeServerList', serverList)
  //   // console.log(context.state.serverList)
  //
  //   // 给每个server一个初始空status，启动loading按钮进行占位，防止页面抖动
  //   for (const server of context.state.serverList) {
  //     context.commit('storeServerStatus', {
  //       id: server.id,
  //       status: ''
  //     })
  //   }
  //
  //   // 更新每个server的status
  //   for (const server of context.state.serverList) {
  //     void context.dispatch('fetchServerStatus', server.id).then((value) => {
  //       const payload = {
  //         id: server.id,
  //         status: codeMap.get(value.data.status.status_code)
  //       }
  //       context.commit('storeServerStatus', payload)
  //       // console.log(server.status)
  //     })
  //   }
  //
  //   // console.log(context.state.serverList)
  //   // console.log('end update list')
  // }
}

export default actions
