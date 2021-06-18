import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerInterface, VmInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import { Dialog, Notify } from 'quasar'

const apiBase = 'https://vms.cstcloud.cn/api'
// const apiBase = 'http://223.193.2.211:88/api'
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
const actionMap = new Map<string, string>(
  [
    ['start', '开机'],
    ['reboot', '重启'],
    ['shutdown', '关机'],
    ['poweroff', '强制断电'],
    ['delete', '删除'],
    ['delete_force', '强制删除']
  ]
)

const actions: ActionTree<VmInterface, StateInterface> = {
  /* 初次获取全部Vm模块Table，已loaded则自动忽略 */
  updateVmTable (context) {
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
            // userServerTable虽然不依赖userServiceTable，但是userVpnTable的更新依赖userServiceTable
            if (!context.state.tables.userServerTable.isLoaded) {
              void context.dispatch('updateUserServerTable').then(() => {
                if (!context.state.tables.userVpnTable.isLoaded.server) {
                  void context.dispatch('updateUserVpnTableFromServer')
                }
              })
            }

            if (!context.state.tables.userVpnTable.isLoaded.service) {
              void context.dispatch('updateUserVpnTableFromService')
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
  deleteAndUpdateUserQuotaTable (context, quotaId: string) {
    // 操作的确认提示
    Dialog.create({
      title: '删除配额',
      message:
        '删除后的配额无法恢复。 确认删除此配额？',
      ok: {
        label: '确认',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respDelete = await context.dispatch('deleteUserQuota', quotaId)
      if (respDelete.status === 204) {
        context.commit('deleteUserQuotaTable', quotaId)
      }
    })
  },
  async deleteUserQuota (context, quotaId: string) {
    const api = apiBase + '/u-quota/' + quotaId + '/'
    const response = await axios.delete(api)
    return response
  },
  // todo 当前根据userServiceTable更新quotatable，应改为直接列举userQuota
  async updateUserQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加
    context.commit('clearUserQuotaTable')
    // 将响应normalize
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      const respQuota = await context.dispatch('fetchUserQuota', serviceId)
      for (const data of respQuota.data.results) {
        // 获取quota下对应的server列表
        const respQuotaServers = await context.dispatch('fetchUserQuotaServers', data.id)
        const servers: string[] = []
        respQuotaServers.data.results.forEach((server: ServerInterface) => {
          servers.push(server.id)
        })
        // 先把servers字段赋给data再normalize
        Object.assign(data, { servers })
        const normalizedData = normalize(data, quota)
        context.commit('storeUserQuotaTable', normalizedData.entities.quota)
      }
    }
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
    const api = apiBase + '/u-quota/' + serviceId + '/servers/'
    const response = await axios.get(api)
    return response
  },
  /* userQuotaTable */

  /* userVpnTable */
  // 根据userServerTable补充vpn列表，共补充两次
  async updateUserVpnTableFromServer (context) {
    for (const server of Object.values(context.state.tables.userServerTable.byId)) {
      const serviceId = server.service
      // service不一定需要vpn访问，需要的service才去取vpn信息 && 并且table中没有该serviceId时
      if (context.state.tables.globalServiceTable.byId[serviceId].need_vpn && !context.state.tables.userVpnTable.allIds.includes(serviceId)) {
        const respVpn = await context.dispatch('fetchVpn', serviceId)
        // 将id补充进vpn对象
        Object.assign(respVpn.data.vpn, { id: serviceId })
        context.commit('storeUserVpnTableFromServer', respVpn.data.vpn)
      }
    }
    // console.log(context.state.tables.userVpnTable)
  },
  // 根据userServiceTable补充vpn列表，共补充两次
  async updateUserVpnTableFromService (context) {
    for (const serviceId of context.state.tables.userServiceTable.allIds) {
      // service不一定需要vpn访问，需要的service才去取vpn信息 && 并且table中没有该serviceId时
      if (context.state.tables.globalServiceTable.byId[serviceId].need_vpn && !context.state.tables.userVpnTable.allIds.includes(serviceId)) {
        const respVpn = await context.dispatch('fetchVpn', serviceId)
        // 将id补充进vpn对象
        Object.assign(respVpn.data.vpn, { id: serviceId })
        context.commit('storeUserVpnTableFromService', respVpn.data.vpn)
      }
    }
    // console.log(context.state.tables.userVpnTable)
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
  // 暂时没有启用
  async fetchVpnCa (context, serviceId: string) {
    const api = apiBase + '/vpn/' + serviceId + '/ca/'
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
  vmOperation (context, payload: { id: string; action: string }) {
    // 操作的确认提示 todo 输入删除两个字
    Dialog.create({
      title: `${actionMap.get(payload.action) || ''}`,
      message:
        `${payload.action === 'delete' || payload.action === 'delete_force' ? '被删除的云主机将无法自行恢复，如需恢复请联系云联邦管理员。' : ''}确认执行？`,
      ok: {
        label: '确认',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        flat: true,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      // 发送请求
      const server = context.state.tables.userServerTable.byId[payload.id]
      const api = server.endpoint_url.endsWith('/') ? server.endpoint_url + 'api/server/' + payload.id + '/action/' : server.endpoint_url + '/api/server/' + payload.id + '/action/'
      const data = { action: payload.action }
      const response = await axios.post(api, data)

      // 将主机状态清空，界面将显示loading
      context.commit('storeUserServerTableSingleStatus', {
        serverId: payload.id,
        status_code: ''
      })

      // 如果删除主机，重新获取userServerTable
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        Notify.create({
          spinner: true,
          timeout: 3000,
          color: 'primary',
          message: `正在删除IP地址为：${server.ipv4 || ''} 的云主机，请稍候`,
          closeBtn: false
        })
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新userServerTable
        void await context.dispatch('updateUserServerTable')
      } else {
        // 其它操作只更新该主机状态
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新单个server status
        void await context.dispatch('updateUserServerTableSingleStatus', payload.id)
      }
      return response
    })
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
