import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { VmInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'

// const apiBase = 'https://vms.cstcloud.cn/api'
const apiBase = 'http://223.193.2.211:88/api'
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

const actions: ActionTree<VmInterface, StateInterface> = {
  /* 初次获取全部Vm模块Table，已有则自动忽略 */
  updateVmTable (context) {
    if (!context.state.tables.userServerTable.isLoaded) {
      void context.dispatch('updateUserServerTable')
    }
    if (!context.state.tables.globalFlavorTable.isLoaded) {
      void context.dispatch('updateGlobalFlavorTable')
    }
    if (!context.state.tables.globalDataCenterTable.isLoaded) {
      void context.dispatch('updateGlobalDataCenterTable').then(() => {
        // globalServiceTable依赖globalDataCenterTable。更新serviceTable时会补充globalServices内容
        if (!context.state.tables.globalServiceTable.isLoaded) {
          void context.dispatch('updateGlobalServiceTable')
        }
        // userServiceTable依赖globalDataCenterTable。更新serviceTable时会补充userServices内容
        if (!context.state.tables.userServiceTable.isLoaded) {
          void context.dispatch('updateUserServiceTable').then(() => {
            // 获取依赖userServiceTable的表
            if (!context.state.tables.userVpnTable.isLoaded) {
              void context.dispatch('updateUserVpnTable')
            }
            if (!context.state.tables.userNetworkTable.isLoaded) {
              void context.dispatch('updateUserNetworkTable')
            }
            if (!context.state.tables.userImageTable.isLoaded) {
              void context.dispatch('updateUserImageTable')
            }
            if (!context.state.tables.userQuotaTable.isLoaded) {
              void context.dispatch('updateUserQuotaTable')
            }
          })
        }
      })
    }
  },
  /* 初次获取全部Vm模块Table，已有则自动忽略 */

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
      // service不一定需要vpn访问，需要的service才去取vpn信息
      if (context.state.tables.userServiceTable.byId[serviceId].need_vpn) {
        const respVpn = await context.dispatch('fetchVpn', serviceId)
        // 将id补充进vpn对象
        Object.assign(respVpn.data.vpn, { id: serviceId })
        context.commit('storeUserVpnTable', respVpn.data.vpn)
      }
    }
    // console.log(context.state.userVpnTable)
  },
  async fetchVpn (context, serviceId: string) {
    const api = apiBase + '/vpn/' + serviceId + '/'
    const response = await axios.get(api)
    return response
  },
  async patchVpnPassword (context, payload: { serviceId: string; password: string }) {
    const api = apiBase + '/vpn/' + payload.serviceId + '/'
    const data = {
      password: payload.password
    }
    const response = await axios.patch(api, data)
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
  // 更新整个userServerTable
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
  // 远程修改单个server的remarks
  async patchRemarks (context, payload: { id: string; remark: string; }) {
    // const api = apiBase + '/server/' + payload.id + '/remark/'
    const api = `${apiBase}/server/${payload.id}/remark/`
    const config = { params: { remark: payload.remark } }
    const response = await axios.patch(api, null, config)
    return response
  },
  // 更新单个server的信息
  async updateUserServerTableSingleServer (context, serverId: string) {
    const respSingleServer = await context.dispatch('fetchSingleServer', serverId)
    // 将响应normalize，存入state里的userServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    const normalizedData = normalize(respSingleServer.data.server, server)
    context.commit('storeUserServerTable', normalizedData.entities.server)
    // 获取新的server后都需要更新status，写在这里
    void await context.dispatch('updateUserServerTableSingleStatus', serverId)
  },
  // 获取并保存单个server的status
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
  async fetchSingleServer (context, id: string) {
    const api = apiBase + '/server/' + id + '/'
    const response = axios.get(api)
    return response
  },
  async createServer (context, payload: { service_id: string; network_id: string; image_id: string; flavor_id: string; quota_id: string; remarks?: string; }) {
    const api = apiBase + '/server/'
    const data = payload
    const response = axios.post(api, data)
    return response
  },
  /*  userServerTable */

  /*  globalDataCenterTable */
  async updateGlobalDataCenterTable (context) {
    const respDataCenters = await context.dispatch('fetchDataCenters')
    const dataCenter = new schema.Entity('dataCenter', {})
    respDataCenters.data.registries.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, dataCenter)
      // 添加上userServices/globalServices字段
      Object.values(normalizedData.entities.dataCenter!)[0].userServices = []
      Object.values(normalizedData.entities.dataCenter!)[0].globalServices = []
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

  /*  globalServiceTable */
  async updateGlobalServiceTable (context) {
    // 发送请求
    const respService = await context.dispatch('fetchService')
    // 将响应normalize，存入state里的serviceTable
    const data_center = new schema.Entity('data_center')
    const service = new schema.Entity('service', { data_center })
    respService.data.results.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, service)
      context.commit('storeGlobalServiceTable', normalizedData.entities.service)

      // 将本serviceId补充进对应dataCenter的globalServices字段
      context.commit('storeGlobalDataCenterTableGlobalServices', {
        dataCenterId: Object.values(normalizedData.entities.service!)[0].data_center,
        serviceId: Object.values(normalizedData.entities.service!)[0].id
      })
    })
  },
  /*  globalServiceTable */

  /*  userServiceTable */
  async updateUserServiceTable (context) {
    // 发送请求
    const respService = await context.dispatch('fetchService', { available_only: true })
    // 将响应normalize，存入state里的serviceTable
    const data_center = new schema.Entity('data_center')
    const service = new schema.Entity('service', { data_center })
    respService.data.results.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, service)
      context.commit('storeUserServiceTable', normalizedData.entities.service)

      // 将本serviceId补充进对应dataCenter的userServices字段
      context.commit('storeGlobalDataCenterTableUserServices', {
        dataCenterId: Object.values(normalizedData.entities.service!)[0].data_center,
        serviceId: Object.values(normalizedData.entities.service!)[0].id
      })
    })
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
  }
  /*  userServiceTable */
}

export default actions
