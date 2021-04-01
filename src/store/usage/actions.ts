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
  /* 更新全部Usage模块Table */
  updateUsageTable (context) {
    if (!context.state.tables.userServerTable.isLoaded) {
      void context.dispatch('updateUserServerTable')
    }
    if (!context.state.tables.globalFlavorTable.isLoaded) {
      void context.dispatch('updateGlobalFlavorTable')
    }
    if (!context.state.tables.globalDataCenterTable.isLoaded) {
      void context.dispatch('updateGlobalDataCenterTable')
    }
    if (!context.state.tables.userServiceTable.isLoaded) {
      void context.dispatch('updateUserServiceTable').then(() => {
        // 获取依赖userServiceTable的表
        if (!context.state.tables.userNetworkTable.isLoaded) {
          void context.dispatch('updateUserNetworkTable')
        }
        if (!context.state.tables.userImageTable.isLoaded) {
          void context.dispatch('updateUserImageTable')
        }
        if (!context.state.tables.userVpnTable.isLoaded) {
          void context.dispatch('updateUserVpnTable')
        }
        if (!context.state.tables.userQuotaTable.isLoaded) {
          void context.dispatch('updateUserQuotaTable')
        }
      }).then(() => {
        console.log(context.state)
      })
    }
  },
  /* 更新全部Usage模块Table */

  /* todo userArchivedServerTable */
  // 该table暂未实现
  /*  userArchivedServerTable */

  /* userQuotaTable */
  async updateUserQuotaTable (context) {
    // 将响应normalize
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      const respQuota = await context.dispatch('fetchUserQuota', serviceId)
      for (const data of respQuota.data.results) {
        const normalizedData = normalize(data, quota)
        context.commit('storeUserQuotaTable', normalizedData.entities.quota)
      }
    }
    // console.log(context.state.userQuotaTable)
  },
  async fetchUserQuota (context, serviceId: string) {
    const api = apiBase + '/u-quota/'
    const config = {
      params: {
        service: serviceId
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  async fetchUserQuotaServers (context, serviceId: string) {
    const api = apiBase + 'u-quota/' + serviceId + '/servers/'
    const response = await axios.get(api)
    return response
  },
  /* userQuotaTable */

  /* userVpnTable */
  async updateUserVpnTable (context) {
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      const respVpn = await context.dispatch('fetchVpn', serviceId)
      // 将id补充进vpn对象
      Object.assign(respVpn.data.vpn, { id: serviceId })
      context.commit('storeUserVpnTable', respVpn.data.vpn)
    }
    // console.log(context.state.userVpnTable)
  },
  async fetchVpn (context, serviceId: string) {
    const api = apiBase + '/vpn/' + serviceId
    const response = await axios.get(api)
    return response
  },
  /* userVpnTable */

  /* globalFlavorTable */
  async updateGlobalFlavorTable (context) {
    const respFlavor = await context.dispatch('fetchFlavor')
    for (const flavor of respFlavor.data.flavors) {
      context.commit('storeGlobalFlavorTable', flavor)
    }
    // console.log(context.state.globalFlavorTable)
  },
  async fetchFlavor () {
    const api = apiBase + '/flavor/'
    const response = await axios.get(api)
    return response
  },
  /* globalFlavorTable */

  /* userImageTable -> 依赖 userServiceTable */
  async updateUserImageTable (context) {
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      const respImage = await context.dispatch('fetchImage', serviceId)
      for (const image of respImage.data) {
        // 将service 和 localId补充进image对象
        Object.assign(image, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${image.id}`
        })
        context.commit('storeUserImageTable', image)
      }
    }
    // console.log(context.state.userImageTable)
  },
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
  /* userImageTable */

  /* userNetworkTable -> 依赖 userServiceTable */
  async updateUserNetworkTable (context) {
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      const respNetwork = await context.dispatch('fetchNetwork', serviceId)
      for (const network of respNetwork.data) {
        // 将service 和 localId补充进network对象
        Object.assign(network, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${network.id}`
        })
        context.commit('storeUserNetworkTable', network)
      }
    }
    // console.log(context.state.userNetworkTable)
  },
  async fetchNetwork (context, serviceId: string) {
    const api = apiBase + '/network/'
    const config = {
      params: {
        service_id: serviceId
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  /* userNetworkTable */

  /* vmlist页面中的云主机操作 */
  async vmOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeUserServerTableSingleStatus', {
      serverId: payload.id,
      status_code: ''
    })

    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 如果删除主机，重新获取userServerTable
    if (payload.action === 'delete' || payload.action === 'delete_force') {
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 更新userServerTable
      void await context.dispatch('updateUserServerTable')
    } else {
      // 其它操作只更新该主机状态
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 更新单个server status
      void await context.dispatch('updateUserServerTableSingleStatus', payload.id)
    }
    return response
  },
  /* vmlist页面中的云主机操作 */

  /*  userServerTable */
  async updateUserServerTable (context) {
    // 先清空userServerTable，避免多次更新时数据累加
    context.commit('clearUserServerTable')

    // 发送请求
    const respServer = await context.dispatch('fetchServer')
    // 将响应normalize，存入state里的userServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    for (const data of respServer.data.servers) {
      const normalizedData = normalize(data, server)
      context.commit('storeUserServerTable', normalizedData.entities.server)
    }
    // console.log(context.state.userServerTable)
    // 建立userServerTable之后，分别更新每个server status, 并发更新，无需await
    for (const serverId of context.state.tables.userServerTable.allIds) {
      void context.dispatch('updateUserServerTableSingleStatus', serverId)
    }
  },
  // 更新单个server的status
  async updateUserServerTableSingleStatus (context, serverId: string) {
    const respStatus = await context.dispatch('fetchServerStatus', serverId)
    context.commit('storeUserServerTableSingleStatus', {
      serverId,
      status_code: statusCodeMap.get(respStatus.data.status.status_code)
    })
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
  async fetchServer (context, payload?: { page?: number; page_size?: number; service_id?: string; }) {
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
  /*  userServerTable */

  /*  globalDataCenterTable */
  async updateGlobalDataCenterTable (context) {
    const respDataCenters = await context.dispatch('fetchDataCenters')
    const dataCenter = new schema.Entity('dataCenter', {})
    respDataCenters.data.registries.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, dataCenter)
      context.commit('storeGlobalDataCenterTable', normalizedData.entities.dataCenter)
    })
    // console.log(context.state.globalDataCenterTable)
  },
  async fetchDataCenters () {
    const api = apiBase + '/registry/'
    const response = await axios.get(api)
    return response
  },
  /*  globalDataCenterTable */

  /*  userServiceTable */
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
  /*  userServiceTable */
  /*

  以上为重构数据结构

  */
  async serverDetailOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // todo 将主机状态清空，界面将显示loading 待验证
    context.commit('storeUserServerTableSingleStatus', {
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
    void await context.dispatch('updateUserServerTableSingleStatus', payload.id)
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
