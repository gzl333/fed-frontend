import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import {
  NetworkInterface,
  ServerInterface,
  VmModuleInterface,
  ImageInterface,
  QuotaInterface, UserPersonalServerInterface
} from './state'
import { i18n } from '../../boot/i18n'

const getters: GetterTree<VmModuleInterface, StateInterface> = {

  /* join federation使用 */
  getDataCenterOptions (state): { value: string; label: string; }[] {
    const dataCenterOptions = []
    for (const dataCenter of Object.values(state.tables.globalDataCenterTable.byId)) {
      dataCenterOptions.push(
        {
          value: dataCenter.id,
          label: dataCenter.name
        }
      )
    }
    return dataCenterOptions
  },
  /* join federation使用 */

  /* vmlist 使用 */
  getServiceOptions (state): { value: string; label: string; }[] {
    /*    数据结构如下
        const serviceOptions = [
          {
            label: '全部节点',
            value: '0'
          },
          {
            label: '中国科学院计算机网络信息中心 - HR_204机房',
            value: '1'
          },
          {
            label: '地球大数据科学工程专项 - 怀柔机房一层',
            value: '2'
          }
        ]
    */

    let serviceOptions = []

    // const serviceOptions = []
    for (const service of Object.values(state.tables.userServiceTable.byId)) {
      serviceOptions.push(
        {
          value: service.id,
          label: i18n.global.locale === 'zh' ? state.tables.globalDataCenterTable.byId[service.data_center].name + ' - ' + service.name : state.tables.globalDataCenterTable.byId[service.data_center].name_en + ' - ' + service.name_en
          // label: `${state.globalDataCenterTable.byId[service.id].name} - ${service.name}`
        }
      )
    }
    // 排序
    serviceOptions = serviceOptions.sort((a, b) => -a.label.localeCompare(b.label, 'zh-CN'))
    // // vue组件外取i18n中locale字段的方法
    serviceOptions.unshift({
      value: '0',
      label: i18n.global.locale === 'zh' ? '全部服务节点' : 'All Service Nodes'
    })

    return serviceOptions
  },
  // https://github.com/vuejs/vuex/issues/456
  // 根据用户选择的serviceId来返回server数组
  getServersByServiceId: (state) => (serviceId: string): ServerInterface[] => {
    // 排序函数，根据云主机创建时间降序排列
    const sortFn = (a: ServerInterface, b: ServerInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()

    if (serviceId === '0') {
      return Object.values(state.tables.userServerTable.byId).sort(sortFn)
    } else {
      const rows: ServerInterface[] = []
      for (const server of Object.values(state.tables.userServerTable.byId)) {
        if (server.service === serviceId) {
          rows.push(server)
        }
      }
      return rows.sort(sortFn)
    }
  },
  /* vmlist 使用 */

  /* quotaList使用 */
  // 根据用户选择的filter来返回application数组
  getUserQuotasByFilter: (state) => (filter: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()

    if (filter === '0') {
      // 返回quota对象的数组，并以过期时间降序排序
      return Object.values(state.tables.userQuotaTable.byId).sort(sortFn)
    } else {
      const rows: QuotaInterface[] = []
      for (const quota of Object.values(state.tables.userQuotaTable.byId)) {
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

  /* server deploy card使用 */
  getPublicNetworksByServiceId: (state) => (serviceId: string): NetworkInterface[] => {
    return Object.values(state.tables.globalNetworkTable.byLocalId).filter(network => network.public && network.service === serviceId)
  },
  getPrivateNetworksByServicedId: (state) => (serviceId: string): NetworkInterface[] => {
    return Object.values(state.tables.globalNetworkTable.byLocalId).filter(network => !network.public && network.service === serviceId)
  },
  getImagesByServiceId: (state) => (serviceId: string): ImageInterface[] => {
    return Object.values(state.tables.globalImageTable.byLocalId).filter(image => image.service === serviceId)
  },
  // 只返回未删除guota
  getPersonalValidQuotasByServiceId: (state) => (serviceId: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    return Object.values(state.tables.userQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && !quota.expired && !quota.exhausted).sort(sortFn)
  },
  getPersonalInvalidQuotasByServiceId: (state) => (serviceId: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    return Object.values(state.tables.userQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && (quota.expired || quota.exhausted)).sort(sortFn)
  },
  getGroupValidQuotasByServiceId: (state) => (serviceId: string, groupId?: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    return Object.values(state.tables.groupQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && quota.vo_id === groupId && !quota.expired && !quota.exhausted).sort(sortFn)
  },
  getGroupInvalidQuotasByServiceId: (state) => (serviceId: string, groupId?: string): QuotaInterface[] => {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    return Object.values(state.tables.groupQuotaTable.byId).filter(quota => !quota.deleted && quota.service === serviceId && quota.vo_id === groupId && (quota.expired || quota.exhausted)).sort(sortFn)
  },
  /* server deploy card使用 */

  /* 获取所有server */
  getServers (state): ServerInterface[] {
    const rows: ServerInterface[] = []
    for (const server of Object.values(state.tables.userServerTable.byId)) {
      rows.push(server)
    }
    return rows
  },
  /* 获取所有server */

  /* groupList页面用 */
  getGroupOptions (state, getters, rootState/*, rootGetters */): { value: string; label: string; }[] {
    let groupOptions = []
    for (const group of Object.values(rootState.group.tables.groupTable.byId)) {
      groupOptions.push(
        {
          value: group.id,
          label: group.name
        }
      )
    }
    // 排序
    groupOptions = groupOptions.sort((a, b) => -a.label.localeCompare(b.label, 'zh-CN'))
    // // vue组件外取i18n中locale字段的方法
    groupOptions.unshift({
      value: '0',
      label: i18n.global.locale === 'zh' ? '全部项目组' : 'All Groups'
    })

    return groupOptions
  },
  // 排序用户个人服务器资源 todo
  getUserCreateTime: (state) => (): UserPersonalServerInterface[] => {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: UserPersonalServerInterface, b: UserPersonalServerInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    const rows: UserPersonalServerInterface[] = []
    for (const application of Object.values(state.tables.userPersonalServerTable.byId)) {
      rows.push(application)
    }
    // console.log('111111', rows)
    return rows.sort(sortFn)
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
  getGroupQuotasByGroupIdByStatus: (state) => (groupId: string) => (status: string): QuotaInterface[] => {
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time).getTime() - new Date(a.expiration_time).getTime()
    if (status === 'all') {
      return Object.values(state.tables.groupQuotaTable.byId).sort(sortFn)
    } else {
      const quotasByGroupId: QuotaInterface[] = []
      for (const quota of Object.values(state.tables.groupQuotaTable.byId)) {
        if (quota.vo_id === groupId) {
          quotasByGroupId.push(quota)
        }
      }
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
  }
  /* groupList页面用 */

}

export default getters
