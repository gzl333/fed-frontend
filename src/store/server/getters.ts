import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface, VpnInterface } from './state'
import {
  QuotaApplicationInterface,
  NetworkInterface,
  ImageInterface,
  QuotaInterface,
  ServerInterface
} from 'src/store/server/state'
// import { i18n } from 'boot/i18n'

const getters: GetterTree<ServerModuleInterface, StateInterface> = {
  // 根据用户选择的filter来返回application数组
  getPersonalApplicationsByFilter: (state) => (filter: string): QuotaApplicationInterface[] => {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: QuotaApplicationInterface, b: QuotaApplicationInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (filter === '0') {
      return Object.values(state.tables.personalQuotaApplicationTable.byId).sort(sortFn)
    } else {
      const rows: QuotaApplicationInterface[] = []
      for (const application of Object.values(state.tables.personalQuotaApplicationTable.byId)) {
        if (application.status === filter) {
          rows.push(application)
        }
      }
      return rows.sort(sortFn)
    }
  },
  // 根据用户选择的filter来返回application数组
  getGroupApplicationsByFilter: (state) => (filter: string): QuotaApplicationInterface[] => {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: QuotaApplicationInterface, b: QuotaApplicationInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (filter === '0') {
      return Object.values(state.tables.groupQuotaApplicationTable.byId).sort(sortFn)
    } else {
      const rows: QuotaApplicationInterface[] = []
      for (const application of Object.values(state.tables.groupQuotaApplicationTable.byId)) {
        if (application.status === filter) {
          rows.push(application)
        }
      }
      return rows.sort(sortFn)
    }
  },

  /* server deploy card使用 */
  getPublicNetworksByServiceId: (state) => (serviceId: string): NetworkInterface[] => {
    return Object.values(state.tables.serviceNetworkTable.byLocalId).filter(network => network.public && network.service === serviceId)
  },
  getPrivateNetworksByServicedId: (state) => (serviceId: string): NetworkInterface[] => {
    return Object.values(state.tables.serviceNetworkTable.byLocalId).filter(network => !network.public && network.service === serviceId)
  },
  getImagesByServiceId: (state) => (serviceId: string): ImageInterface[] => {
    return Object.values(state.tables.serviceImageTable.byLocalId).filter(image => image.service === serviceId).sort((a, b) => a.name.localeCompare(b.name, 'en'))
  },
  // 只返回未删除guota
  getPersonalValidQuotasByServiceId: (state) => (serviceId: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    // return Object.values(state.tables.userQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && !quota.expired && !quota.exhausted).sort(sortFn)
    return Object.values(state.tables.personalQuotaTable.byId).filter(quota => quota.service === serviceId && !quota.expired && !quota.exhausted).sort(sortFn)
  },
  getPersonalInvalidQuotasByServiceId: (state) => (serviceId: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    // return Object.values(state.tables.userQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && (quota.expired || quota.exhausted)).sort(sortFn)
    return Object.values(state.tables.personalQuotaTable.byId).filter(quota => quota.service === serviceId && (quota.expired || quota.exhausted)).sort(sortFn)
  },
  getGroupValidQuotasByServiceId: (state) => (serviceId: string, groupId?: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    // return Object.values(state.tables.groupQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && quota.vo_id === groupId && !quota.expired && !quota.exhausted).sort(sortFn)
    return Object.values(state.tables.groupQuotaTable.byId).filter(quota => quota.service === serviceId && quota.vo_id === groupId && !quota.expired && !quota.exhausted).sort(sortFn)
  },
  getGroupInvalidQuotasByServiceId: (state) => (serviceId: string, groupId?: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    // return Object.values(state.tables.groupQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && quota.vo_id === groupId && (quota.expired || quota.exhausted)).sort(sortFn)
    return Object.values(state.tables.groupQuotaTable.byId).filter(quota => quota.service === serviceId && quota.vo_id === groupId && (quota.expired || quota.exhausted)).sort(sortFn)
  },
  /* server deploy card使用 */

  getPersonalServers (state): ServerInterface[] {
    const rows: ServerInterface[] = []
    for (const server of Object.values(state.tables.personalServerTable.byId)) {
      rows.push(server)
    }
    return rows
  },
  // https://github.com/vuejs/vuex/issues/456
  // 根据用户选择的serviceId来返回server数组
  getPersonalServersByServiceId: (state) => (serviceId: string): ServerInterface[] => {
    // 排序函数，根据云主机创建时间降序排列
    const sortFn = (a: ServerInterface, b: ServerInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (serviceId === '0') {
      return Object.values(state.tables.personalServerTable.byId).sort(sortFn)
    } else {
      const rows: ServerInterface[] = []
      for (const server of Object.values(state.tables.personalServerTable.byId)) {
        if (server.service === serviceId) {
          rows.push(server)
        }
      }
      return rows.sort(sortFn)
    }
  },
  /* quotaList使用 */
  // 根据用户选择的filter来返回application数组
  getPersonalQuotasByFilter: (state) => (filter: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()

    if (filter === '0') {
      // 返回quota对象的数组，并以过期时间降序排序
      return Object.values(state.tables.personalQuotaTable.byId).sort(sortFn)
    } else {
      const rows: QuotaInterface[] = []
      for (const quota of Object.values(state.tables.personalQuotaTable.byId)) {
        if (filter === 'valid' && !quota.exhausted && !quota.expired) { // 可用的quota
          rows.push(quota)
        } else if (filter === 'invalid' && (quota.exhausted || quota.expired)) { // 不可用的quota
          rows.push(quota)
        } else if (filter === null && quota.expiration_time === null) { // 长期的quota
          rows.push(quota)
        } else if (filter === 'notExpired' && !quota.expired) { // 未过期的quota
          rows.push(quota)
        } else if (filter === 'expired' && quota.expired) { // 过期的quota
          rows.push(quota)
        } else if (filter === 'notExhausted' && !quota.exhausted) { // 未用尽的quota
          rows.push(quota)
        } else if (filter === 'exhausted' && quota.exhausted) { // 用尽的quota
          rows.push(quota)
        }
      }
      return rows.sort(sortFn)
    }
  },
  /* quotaList使用 */

  getGroupQuotaApplicationsByGroupId: (state) => (groupId: string): QuotaApplicationInterface[] => {
    const sortFn = (a: QuotaApplicationInterface, b: QuotaApplicationInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    if (groupId === '0') {
      return Object.values(state.tables.groupQuotaApplicationTable.byId).sort(sortFn)
    } else {
      const applications: QuotaApplicationInterface[] = []
      for (const server of Object.values(state.tables.groupQuotaApplicationTable.byId)) {
        if (groupId === server.vo_id) {
          applications.push(server)
        }
      }
      return applications.sort(sortFn)
    }
  },
  getGroupServersByGroupId: (state) => (groupId: string): ServerInterface[] => {
    const sortFn = (a: ServerInterface, b: ServerInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    if (groupId === '0') {
      return Object.values(state.tables.groupServerTable.byId).sort(sortFn)
    } else {
      const servers: ServerInterface[] = []
      for (const server of Object.values(state.tables.groupServerTable.byId)) {
        if (groupId === server.vo_id) {
          servers.push(server)
        }
      }
      return servers.sort(sortFn)
    }
  },
  // 有四种状态：all -> 全部, valid -> 可用， expired -> 过期, exhausted -> 用尽
  getGroupQuotasByGroupIdByStatus: (state) => (groupId: string, status: string): QuotaInterface[] => {
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time).getTime() - new Date(a.expiration_time).getTime()
    const quotasByGroupId: QuotaInterface[] = []
    for (const quota of Object.values(state.tables.groupQuotaTable.byId)) {
      if (quota.vo_id === groupId) {
        quotasByGroupId.push(quota)
      }
    }
    if (status === 'all') {
      return quotasByGroupId.sort(sortFn)
    } else {
      const quotasByStatus: QuotaInterface[] = []
      for (const quota of quotasByGroupId) {
        if (status === 'valid' && !quota.expired && !quota.exhausted) {
          quotasByStatus.push(quota)
        } else if (status === 'expired' && quota.expired) {
          quotasByStatus.push(quota)
        } else if (status === 'exhausted' && quota.exhausted) {
          quotasByStatus.push(quota)
        }
      }
      return quotasByStatus.sort(sortFn)
    }
  },
  getGroupQuotasByFilter: (state) => (filter: string): QuotaInterface[] => {
    // expiration_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()

    if (filter === '0') {
      // 返回quota对象的数组，并以过期时间降序排序
      return Object.values(state.tables.groupQuotaTable.byId).sort(sortFn)
    } else {
      const rows: QuotaInterface[] = []
      for (const quota of Object.values(state.tables.groupQuotaTable.byId)) {
        if (filter === 'valid' && !quota.exhausted && !quota.expired) { // 可用的quota
          rows.push(quota)
        } else if (filter === 'invalid' && (quota.exhausted || quota.expired)) { // 不可用的quota
          rows.push(quota)
        }
      }
      return rows.sort(sortFn)
    }
  },
  // 个人有quota(全部quota,包括过期和不可用)和server的serviceId
  getPersonalAvailableServiceIds: (state): string[] => {
    let services = [] as string[]
    state.tables.personalQuotaTable.allIds.forEach((id) => services.unshift(state.tables.personalQuotaTable.byId[id].service))
    state.tables.personalServerTable.allIds.forEach((id) => services.unshift(state.tables.personalServerTable.byId[id].service))
    services = [...new Set(services)]
    return services
  },
  // 全部quota和server对应的services
  getPersonalAvailableServices: (state, getters, rootState/*, rootGetters */): { value: string; label: string; }[] => {
    /*    数据结构如下
    const serviceOptions = [
      {        value: '0',
        label: '全部节点',
        labelEn: 'All Service Nodes'
      }
    ]
*/
    const serviceIds = getters.getPersonalAvailableServiceIds as string[]

    let serviceOptions = serviceIds.map((serviceId) => ({
      value: serviceId,
      label: rootState.fed.tables.dataCenterTable.byId[rootState.fed.tables.serviceTable.byId[serviceId]?.data_center]?.name + ' - ' + rootState.fed.tables.serviceTable.byId[serviceId]?.name,
      labelEn: rootState.fed.tables.dataCenterTable.byId[rootState.fed.tables.serviceTable.byId[serviceId]?.data_center]?.name_en + ' - ' + rootState.fed.tables.serviceTable.byId[serviceId]?.name_en
    }))

    // 排序
    serviceOptions = serviceOptions.sort((a, b) => -a.label.localeCompare(b.label, 'zh-CN'))
    // vue组件外取i18n中locale字段的方法
    // i18n.global.locale === 'zh'
    serviceOptions.unshift({
      value: '0',
      label: '全部服务节点',
      labelEn: 'All Service Nodes'
    })
    return serviceOptions
  },
  // 获取个人有quota/server的vpn对象
  getPersonalAvailableVpns: (state, getters, rootState): VpnInterface[] => {
    // service.need_vpn才加入
    const serviceIds = getters.getPersonalAvailableServiceIds.filter((serviceId: string) => rootState.fed.tables.serviceTable.byId[serviceId]?.need_vpn) as string[]
    // serviceId -> service对象
    const vpns = serviceIds.map((serviceId) => state.tables.userVpnTable.byId[serviceId])
    return vpns
  }
}

export default getters
