import { ActionTree } from 'vuex'
import { StateInterface, apiBase } from '../index'
import { ServerInterface, VmModuleInterface, VpnInterface } from './state'
import axios from 'axios'
import { normalize, schema } from 'normalizr'
import { Dialog, Notify } from 'quasar'
import { i18n } from '../../boot/i18n'

/* const statusCodeMap = new Map<number, string>(
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
) */
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

const actions: ActionTree<VmModuleInterface, StateInterface> = {
  /* 初次获取全部Vm模块Table，已loaded则自动忽略 */
  updateVmTable (context) {
    if (!context.state.tables.globalFlavorTable.isLoaded) {
      void context.dispatch('updateGlobalFlavorTable')
    }
    if (!context.state.tables.userQuotaTable.isLoaded) {
      void context.dispatch('updateUserQuotaTable')
    }
    if (!context.state.tables.globalDataCenterTable.isLoaded) {
      void context.dispatch('updateGlobalDataCenterTable').then(() => {
        // globalServiceTable依赖globalDataCenterTable。更新serviceTable时会补充globalServices内容
        if (!context.state.tables.globalServiceTable.isLoaded) {
          void context.dispatch('updateGlobalServiceTable').then(() => {
            // if (!context.state.tables.privateServiceQuotaStatTable.isLoaded) {
            //   void context.dispatch('loadPrivateServiceQuotaStatTable')
            // }
            // if (!context.state.tables.sharedServiceQuotaStatTable.isLoaded) {
            //   void context.dispatch('loadSharedServiceQuotaStatTable')
            // }
          })
          void context.dispatch('updateGlobalServiceTable').then(() => {
            if (!context.state.tables.globalNetworkTable.isLoaded) {
              void context.dispatch('loadGlobalNetworkTable')
            }
            if (!context.state.tables.globalNetworkTable.isLoaded) {
              void context.dispatch('loadGlobalImageTable')
            }
          })
        }
        // userServiceTable依赖globalDataCenterTable的存在，更新serviceTable时会补充userServices内容
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
          })
        }
      })
    }
  },
  /* 初次获取全部Vm模块Table，已有则自动忽略 */

  /* 强制更新全部vmtable */
  forceUpdateVmTable (context) {
    void context.dispatch('updateGlobalFlavorTable')
    void context.dispatch('updateUserQuotaTable')
    void context.dispatch('updateGlobalDataCenterTable').then(() => {
      // globalServiceTable依赖globalDataCenterTable。更新serviceTable时会补充globalServices内容
      void context.dispatch('updateGlobalServiceTable').then(() => {
        void context.dispatch('loadGlobalNetworkTable')
        void context.dispatch('loadGlobalImageTable')
      })
      // userServiceTable依赖globalDataCenterTable的存在，更新serviceTable时会补充userServices内容
      void context.dispatch('updateUserServiceTable').then(() => {
        // 获取依赖userServiceTable的表
        // userServerTable虽然不依赖userServiceTable，但是userVpnTable的更新依赖userServiceTable
        void context.dispatch('updateUserServerTable').then(() => {
          void context.dispatch('updateUserVpnTableFromServer')
        })
        void context.dispatch('updateUserVpnTableFromService')
        void context.dispatch('updateUserNetworkTable')
        void context.dispatch('updateUserImageTable')
      })
    })
  },
  /* 强制更新全部vmtable */

  /* userQuotaTable */
  // deleteAndUpdateUserQuotaTable (context, quotaId: string) {
  //   // 把整个对话框对象包在promise里。删除成功、失败包装为promise结果值。
  //   return new Promise((resolve, reject) => {
  //     // 操作的确认提示
  //     Dialog.create({
  //       class: 'dialog-primary',
  //       title: '删除配额',
  //       message:
  //         '删除后的配额无法恢复。 确认删除此配额？',
  //       focus: 'cancel',
  //       ok: {
  //         label: '确认',
  //         push: false,
  //         outline: true,
  //         color: 'primary'
  //       },
  //       cancel: {
  //         label: '放弃',
  //         push: false,
  //         unelevated: true,
  //         color: 'primary'
  //       }
  //     }).onOk(async () => {
  //       const respDelete = await context.dispatch('deleteUserQuota', quotaId)
  //       if (respDelete.status === 204) {
  //         context.commit('deleteUserQuotaTable', quotaId)
  //         resolve(true)
  //       } else {
  //         reject(false) // 都是resolve，信息用boolean表达是否删除。因为接收处用的await语法，用reject会被catch。
  //       }
  //     })
  //   })
  // },
  deleteQuotaDialog (context, payload: { quotaId: string; isGroup: boolean }) {
    // 把整个对话框对象包在promise里。删除成功、失败包装为promise结果值。
    const promise = new Promise((resolve, reject) => {
      // 操作的确认提示
      Dialog.create({
        class: 'dialog-primary',
        title: '删除配额',
        message:
          '删除后的配额无法恢复。 确认删除此配额？',
        focus: 'cancel',
        ok: {
          label: '确认',
          push: false,
          outline: true,
          color: 'primary'
        },
        cancel: {
          label: '放弃',
          push: false,
          unelevated: true,
          color: 'primary'
        }
      }).onOk(async () => {
        const respDelete = await context.dispatch('deleteQuota', payload.quotaId)
        if (respDelete.status === 204) {
          payload.isGroup ? context.commit('deleteGroupQuotaTableSingleQuota', payload.quotaId) : context.commit('deleteUserQuotaTableSingleQuota', payload.quotaId)
          // 通知
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'mdi-check-circle',
            textColor: 'light-green',
            message: '配额删除成功',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          resolve(true)
        } else {
          Notify.create({
            classes: 'notification-negative shadow-15',
            icon: 'mdi-alert',
            textColor: 'negative',
            message: '配额删除失败，请重试',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          reject(false) // 都是resolve? 信息用boolean表达是否删除。因为接收处用的await语法，用reject会被catch。
        }
      })
    })
    return promise
  },
  async deleteQuota (context, quotaId: string) {
    const api = apiBase + '/quota/' + quotaId + '/'
    return axios.delete(api)
  },
  async updateUserQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearUserQuotaTable')
    // 将响应normalize
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    const respQuota = await context.dispatch('getQuota', { query: { deleted: false } })
    // quota数组
    for (const data of respQuota.data.results) {
      /* 增加补充字段 */
      // 获取quota下对应的server列表
      const respQuotaServers = await context.dispatch('getQuotaServers', {
        path: {
          quotaId: data.id
        }
      })
      const servers: string[] = []
      respQuotaServers.data.results.forEach((server: ServerInterface) => {
        servers.push(server.id)
      })
      // 给data增加servers字段
      Object.assign(data, { servers })
      // 给data增加expired字段
      const expired = !!data.expiration_time && (new Date(data.expiration_time).getTime() < new Date().getTime())
      Object.assign(data, { expired })
      // 给data增加exhausted字段,该字段的判断方式可能后期更改
      const exhausted = data.vcpu_used === data.vcpu_total ||
        data.ram_used === data.ram_total ||
        (data.private_ip_used === data.private_ip_total && data.public_ip_used === data.public_ip_total)
      Object.assign(data, { exhausted })
      /* 增加补充字段 */

      // normalize data
      const normalizedData = normalize(data, quota)
      context.commit('storeUserQuotaTable', normalizedData.entities.quota)
    }
  },
  getQuota (context, payload?: { query: { page?: number; page_size?: number; service?: string; usable?: boolean; deleted?: boolean } }) {
    const api = apiBase + '/quota/'
    const config = {
      params: payload?.query
    }
    return axios.get(api, config)
  },
  getQuotaServers (context, payload: { path: { quotaId: string }, query: { page?: number; page_size?: number; } }) {
    const api = apiBase + '/quota/' + payload.path.quotaId + '/servers/'
    const config = {
      params: payload.query
    }
    return axios.get(api, config)
  },
  /* userQuotaTable */

  /* groupQuotaTable -> 依赖groupTable,根据组列表来分别获取组的配额，调用点在group模块里 */
  // 所有groupQuota根据quotaId存在一个对象里，不区分group，getter里区分group取
  async loadGroupQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearGroupQuotaTable')
    // 根据groupTable,建立groupQuotaTable
    for (const groupId of context.rootState.group.tables.groupTable.allIds) {
      // 获取响应
      const respGroupQuota = await context.dispatch('fetchGroupQuota', { vo_id: groupId })
      // 将响应normalize
      const service = new schema.Entity('service')
      const quota = new schema.Entity('quota', { service })
      // quota数组
      for (const data of respGroupQuota.data.results) {
        /* 增加补充字段 */
        // 补充vo_id字段
        Object.assign(data, { vo_id: groupId })
        // 获取quota下对应的server列表
        const respQuotaServers = await context.dispatch('getQuotaServers', {
          path: {
            quotaId: data.id
          }
        })
        const servers: string[] = []
        respQuotaServers.data.results.forEach((server: ServerInterface) => {
          servers.push(server.id)
        })
        // 给data增加servers字段
        Object.assign(data, { servers })
        // 给data增加expired字段
        const expired = !!data.expiration_time && (new Date(data.expiration_time).getTime() < new Date().getTime())
        Object.assign(data, { expired })
        // 给data增加exhausted字段,该字段的判断方式可能后期更改
        const exhausted = data.vcpu_used === data.vcpu_total ||
          data.ram_used === data.ram_total ||
          (data.private_ip_used === data.private_ip_total && data.public_ip_used === data.public_ip_total)
        Object.assign(data, { exhausted })
        /* 增加补充字段 */

        // normalize data
        const normalizedData = normalize(data, quota)
        // 存入groupQuotaTable
        context.commit('storeGroupQuotaTable', normalizedData.entities.quota)
      }
    }
  },
  async fetchGroupQuota (context, payload: { vo_id: string; page?: number; page_size?: number; service?: string; usable?: boolean }) {
    const api = apiBase + '/quota/vo/' + payload.vo_id + '/'
    return axios.get(api)
  },
  /* groupQuotaTable */

  /* vpn操作 */
  // 修改vpn密码
  popEditVpnPass (context, vpn: VpnInterface) {
    Dialog.create({
      class: 'dialog-primary',
      title: `修改${context.state.tables.globalServiceTable.byId[vpn.id].name}的VPN密码`,
      message: '新密码长度为6-64位',
      prompt: {
        model: `${vpn.password}`,
        counter: true,
        maxlength: 64,
        isValid: (val: string) => {
          return !(val.trim().length < 6 || val.trim().length > 64)
        },
        type: 'text' // optional
      },
      color: 'primary',
      ok: {
        label: i18n.global.tc('确认'),
        push: false,
        // flat: true,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: i18n.global.tc('放弃'),
        push: false,
        flat: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk((data: string) => {
      const payload = {
        serviceId: vpn.id,
        password: data.trim()
      }
      void context.dispatch('patchVpnPassword', payload).then((value) => {
        // 把响应的新vpn信息补充id信息，并更新至table
        context.commit('storeUserVpnTableSingle', Object.assign(value.data.vpn, { id: vpn.id }))
      })
    })
  },
  // 下载vpn ca
  fetchCa (context, serviceId: string) {
    const url = apiBase + '/vpn/' + serviceId + '/ca/'
    window.open(url)
  },
  // 下载vpn config
  fetchConfig (context, serviceId: string) {
    const url = apiBase + '/vpn/' + serviceId + '/config/'
    window.open(url)
  },
  /* vpn操作 */

  /* userVpnTable */
  // 根据userServerTable补充vpn列表，共补充两次
  async updateUserVpnTableFromServer (context) {
    for (const server of Object.values(context.state.tables.userServerTable.byId)) {
      const serviceId = server.service
      // service不一定需要vpn访问，需要的service才去取vpn信息 && 并且table中没有该serviceId时
      if (!context.state.tables.userVpnTable.allIds.includes(serviceId) && context.state.tables.globalServiceTable.byId[serviceId]?.need_vpn) {
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
      if (!context.state.tables.userVpnTable.allIds.includes(serviceId) && context.state.tables.globalServiceTable.byId[serviceId]?.need_vpn) {
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
    return axios.get(api)
  },
  /* globalFlavorTable */

  /* globalImageTable -> 依赖 globalServiceTable */
  async loadGlobalImageTable (context) {
    for (const serviceId of context.state.tables.globalServiceTable.allIds) {
      const respImage = await context.dispatch('getImage', { query: { service_id: serviceId } })
      for (const image of respImage.data) {
        // 将service 和 localId补充进image对象
        Object.assign(image, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${image.id}`
        })
        context.commit('storeGlobalImageTable', image)
      }
    }
    // console.log(context.state.userImageTable)
  },
  getImage (context, payload: { query: { service_id: string } }) {
    const api = apiBase + '/image/'
    const config = {
      params: {
        service_id: payload.query.service_id
      }
    }
    return axios.get(api, config)
  },
  /* globalImageTable */

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

  /* globalNetworkTable -> 依赖 globalServiceTable */
  async loadGlobalNetworkTable (context) {
    for (const serviceId of context.state.tables.globalServiceTable.allIds) {
      const respNetwork = await context.dispatch('getNetwork', { query: { service_id: serviceId } })
      for (const network of respNetwork.data) {
        // 将service 和 localId补充进network对象
        Object.assign(network, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${network.id}`
        })
        context.commit('storeGlobalNetworkTable', network)
      }
    }
    // console.log(context.state.userNetworkTable)
  },
  getNetwork (context, payload: { query: { service_id: string } }) {
    const api = apiBase + '/network/'
    const config = {
      params: {
        service_id: payload.query.service_id
      }
    }
    return axios.get(api, config)
  },
  /* globalNetworkTable */

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

  /*  userServerTable */
  // 更新整个userServerTable
  async updateUserServerTable (context) {
    // 先清空userServerTable，避免多次更新时数据累加
    context.commit('clearUserServerTable')
    // 发送请求
    const respServer = await context.dispatch('fetchUserServer')
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
    const api = apiBase + '/server/' + payload.id + '/remark/'
    const config = { params: { remark: payload.remark } }
    return axios.patch(api, null, config)
  },
  // 更新单个server的信息
  async updateServerTableSingleServer (context, payload: { serverId: string; isGroup: boolean }) {
    const respSingleServer = await context.dispatch('fetchSingleServer', payload.serverId)
    // 将响应normalize，存入state里的userServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    const normalizedData = normalize(respSingleServer.data.server, server)
    if (payload.isGroup) {
      context.commit('storeGroupServerTable', normalizedData.entities.server)
      void context.dispatch('updateGroupServerTableSingleStatus', payload.serverId)
    } else {
      context.commit('storeUserServerTable', normalizedData.entities.server)
      void context.dispatch('updateUserServerTableSingleStatus', payload.serverId)
    }
  },
  // 获取并保存单个server的status
  async updateUserServerTableSingleStatus (context, serverId: string) {
    // 先清空server status，让状态变为空，UI则显示为获取中
    context.commit('storeUserServerTableSingleStatus', {
      serverId,
      status_code: '' // 有状态的状态码为integer
    })
    const respStatus = await context.dispatch('fetchServerStatus', serverId)
    context.commit('storeUserServerTableSingleStatus', {
      serverId,
      status_code: respStatus.data.status.status_code
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
  async fetchUserServer (context, payload?: { page?: number; page_size?: number; service_id?: string; }) {
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
  postServer (context, payload: { body: { service_id: string; network_id?: string; image_id: string; flavor_id: string; quota_id: string; remarks?: string; } }) {
    const api = apiBase + '/server/'
    const data = payload.body
    return axios.post(api, data)
  },
  /*  userServerTable */

  /* groupServerTable */
  // 更新整个groupServerTable，调用点在group模块里
  async loadGroupServerTable (context) {
    // 先清空groupServerTable，避免多次更新时数据累加
    context.commit('clearGroupServerTable')
    // 根据groupTable,建立groupServerTable
    for (const groupId of context.rootState.group.tables.groupTable.allIds) {
      // 发送请求
      const respGroupServer = await context.dispatch('fetchGroupServer', { vo_id: groupId })
      // 将响应normalize
      const service = new schema.Entity('service')
      const user_quota = new schema.Entity('user_quota')
      const server = new schema.Entity('server', {
        service,
        user_quota
      })
      for (const data of respGroupServer.data.servers) {
        const normalizedData = normalize(data, server)
        context.commit('storeGroupServerTable', normalizedData.entities.server)
      }
      // console.log(context.state.userServerTable)
      // 建立groupServerTable之后，分别更新每个server status, 并发更新，无需await
      for (const serverId of context.state.tables.groupServerTable.allIds) {
        void context.dispatch('updateGroupServerTableSingleStatus', serverId)
      }
    }
  },
  async fetchGroupServer (context, payload: { vo_id: string; page?: number; page_size?: number; service_id?: string; }) {
    const api = apiBase + '/server/vo/' + payload.vo_id + '/'
    const config = {
      params: payload
    }
    const response = await axios.get(api, config)
    return response
  },
  // duyukuan
  getServer (context, payload?: { query?: { page?: number; page_size?: number; service_id?: string; user_id?: string; vo_id?: string; 'as-admin'?: boolean } }) {
    const api = apiBase + '/server/'
    const config = {
      params: payload?.query
    }
    return axios.get(api, config)
  },
  async loadUserServerTable (context, payload: { page?: number; page_size?: number }) {
    context.commit('clearProviderServerTable')
    const respGroupServer = await context.dispatch('getServer', { query: payload })
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    if (respGroupServer.data) {
      for (const data of respGroupServer.data.servers) {
        const normalizedData = normalize(data, server)
        context.commit('storeProviderServerTable', normalizedData.entities.server)
        if (normalizedData.entities.user_quota) {
          context.commit('storeProviderQuotaTable', normalizedData.entities.user_quota)
        }
      }
    }
    return respGroupServer
  },
  // 服务私有配额actions
  getServicePQuota (context, payload: { path: { id: string } }) {
    const api = apiBase + '/service/' + payload.path.id + '/p-quota/'
    return axios.get(api)
  },
  async loadPrivateServiceQuotaStatTable (context) {
    for (const id of context.state.tables.globalServiceTable.allIds) {
      const respQuota = await context.dispatch('getServicePQuota', { path: { id } })
      if (respQuota.data) {
        Object.assign(respQuota.data, { id: id })
        const quota = new schema.Entity('quota')
        const normalizedData = normalize(respQuota.data, quota)
        context.commit('storePrivateServiceQuotaStatTable', normalizedData.entities.quota)
      }
    }
  },
  // 服务共享配额actions
  getServiceSQuota (context, payload: { path: { id: string } }) {
    const api = apiBase + '/service/' + payload.path.id + '/s-quota/'
    return axios.get(api)
  },
  async loadSharedServiceQuotaStatTable (context) {
    for (const id of context.state.tables.globalServiceTable.allIds) {
      const respQuota = await context.dispatch('getServiceSQuota', { path: { id } })
      if (respQuota.data) {
        Object.assign(respQuota.data, { id: id })
        const quota = new schema.Entity('quota')
        const normalizedData = normalize(respQuota.data, quota)
        context.commit('storeSharedServiceQuotaStatTable', normalizedData.entities.quota)
      }
    }
  },
  // 获取并保存单个server的status
  async updateGroupServerTableSingleStatus (context, serverId: string) {
    // 先清空server status，让状态变为空，UI则显示为获取中
    context.commit('storeGroupServerTableSingleStatus', {
      serverId,
      status_code: '' // 有状态的状态码为integer
    })
    const respStatus = await context.dispatch('fetchServerStatus', serverId)
    context.commit('storeGroupServerTableSingleStatus', {
      serverId,
      status_code: respStatus.data.status.status_code
    })
  },
  /* groupServerTable */

  /*  globalDataCenterTable */
  async updateGlobalDataCenterTable (context) {
    const respDataCenters = await context.dispatch('fetchDataCenters')
    const dataCenter = new schema.Entity('dataCenter', {})
    respDataCenters.data.registries.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, dataCenter)
      // 添加上userServices/globalServices空字段
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
    const respService = await context.dispatch('getService')
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
    const respService = await context.dispatch('getService', { available_only: true }) // 配额失效则用户看不到相关service信息
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
  getService (context, payload?: { query: { page?: number; page_size?: number; center_id?: string; available_only?: boolean; } }) {
    const api = apiBase + '/service/'
    const config = {
      params: payload
    }
    return axios.get(api, config)
  },
  /*  userServiceTable */

  /* vmlist页面中的云主机操作 */
  vmOperation (context, payload: { id: string; action: string; isGroup?: boolean }) {
    // 操作的确认提示 todo 输入删除两个字以确认
    Dialog.create({
      class: 'dialog-primary',
      title: `${i18n.global.tc(actionMap.get(payload.action) as string) || ''}`,
      focus: 'cancel',
      message:
        `${payload.action === 'delete' || payload.action === 'delete_force' ? '被删除的云主机将无法自行恢复，如需恢复请联系云联邦管理员。' : ''}确认执行？`,
      ok: {
        label: i18n.global.tc('确认'),
        push: false,
        // flat: true,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: i18n.global.tc('放弃'),
        push: false,
        flat: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      // 将主机状态清空，界面将显示loading
      context.commit('storeUserServerTableSingleStatus', {
        serverId: payload.id,
        status_code: ''
      })

      // 发送请求
      const server = context.state.tables.userServerTable.byId[payload.id]
      // 去掉协议
      const endpoint_url = server.endpoint_url.substr(server.endpoint_url.indexOf('//'))
      // 判断结尾有没有'/'，并加上当前用户使用的协议
      const api = window.location.protocol + endpoint_url.endsWith('/') ? endpoint_url + 'api/server/' + payload.id + '/action/' : endpoint_url + '/api/server/' + payload.id + '/action/'
      const data = { action: payload.action }
      const response = await axios.post(api, data)

      // 如果删除主机，重新获取userServerTable
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        Notify.create({
          classes: 'notification-primary shadow-15',
          textColor: 'black',
          spinner: true,
          message: `正在删除云主机${server.ipv4 || ''} ，请稍候`,
          position: 'bottom',
          closeBtn: true,
          timeout: 3000,
          multiLine: false
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
  serverOperationDialog (context, payload: { serverId: string; action: string; isGroup?: boolean }) {
    // 操作的确认提示 todo 输入删除两个字以确认
    Dialog.create({
      class: 'dialog-primary',
      title: `${i18n.global.tc(actionMap.get(payload.action) as string) || ''}`,
      focus: 'cancel',
      message:
        `${payload.action === 'delete' || payload.action === 'delete_force' ? '被删除的云主机将无法自行恢复，如需恢复请联系云联邦管理员。' : ''}确认执行？`,
      ok: {
        label: i18n.global.tc('确认'),
        push: false,
        // flat: true,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: i18n.global.tc('放弃'),
        push: false,
        flat: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      // 将主机状态清空，界面将显示loading
      if (!payload.isGroup) {
        context.commit('storeUserServerTableSingleStatus', {
          serverId: payload.serverId,
          status_code: ''
        })
      } else {
        context.commit('storeGroupServerTableSingleStatus', {
          serverId: payload.serverId,
          status_code: ''
        })
      }
      // 发送请求
      const server = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId] : context.state.tables.userServerTable.byId[payload.serverId]
      // 去掉协议
      const endpoint_url = server.endpoint_url.substr(server.endpoint_url.indexOf('//'))
      // 判断结尾有没有'/'，并加上当前用户使用的协议
      const api = window.location.protocol + endpoint_url.endsWith('/') ? endpoint_url + 'api/server/' + payload.serverId + '/action/' : endpoint_url + '/api/server/' + payload.serverId + '/action/'
      const data = { action: payload.action }
      void await axios.post(api, data)

      // 如果删除主机，重新获取userServerTable或groupServerTable
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        Notify.create({
          classes: 'notification-primary shadow-15',
          textColor: 'primary',
          spinner: true,
          message: `正在删除云主机${server.ipv4 || ''} ，请稍候`,
          position: 'bottom',
          closeBtn: true,
          timeout: 3000,
          multiLine: false
        })
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新userServerTable或groupServerTable
        payload.isGroup ? void await context.dispatch('loadGroupServerTable') : void await context.dispatch('updateUserServerTable')
      } else {
        // 其它操作只更新该主机状态
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新单个server status
        payload.isGroup ? await context.dispatch('updateGroupServerTableSingleStatus', payload.serverId) : await context.dispatch('updateUserServerTableSingleStatus', payload.serverId)
      }
    })
  },
  // 编辑云主机备注
  editServerNoteDialog (context, payload: { serverId: string; isGroup?: boolean }) {
    Dialog.create({
      class: 'dialog-primary',
      title: `编辑${payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId].ipv4 : context.state.tables.userServerTable.byId[payload.serverId].ipv4}的备注信息`,
      // message: '长度限制为30个字',
      prompt: {
        model: `${payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId].remarks : context.state.tables.userServerTable.byId[payload.serverId].remarks}`,
        counter: true,
        maxlength: 30,
        type: 'text' // optional
      },
      color: 'primary',
      cancel: true
    }).onOk(async (data: string) => {
      const payload2: { id: string; remark: string; } = {
        id: payload.serverId,
        remark: data.trim()
      }
      const respPatchRemark = await context.dispatch('patchRemarks', payload2)

      if (respPatchRemark.status === 200) {
        if (!payload.isGroup) {
          // 保存个人云主机remark
          context.commit('storeUserServerTableSingleRemarks', {
            serverId: payload.serverId,
            remarks: respPatchRemark.data.remarks
          })
        } else {
          // 保存组云主机remark
          context.commit('storeGroupServerTableSingleRemarks', {
            serverId: payload.serverId,
            remarks: respPatchRemark.data.remarks
          })
        }
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '成功修改云主机备注为：' + respPatchRemark.data.remarks,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        // 弹出通知
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '修改云主机备注失败，请重试',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  // 打开vnc
  async gotoVNC (context, id: string) {
    const response = await context.dispatch('fetchServerVNC', id)
    const url = response.data.vnc.url
    window.open(url)
  }
  /* vmlist页面中的云主机操作 */

}

export default actions
