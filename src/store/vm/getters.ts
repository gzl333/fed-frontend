import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import {
  NetworkInterface,
  ServerInterface,
  VmModuleInterface,
  ImageInterface,
  QuotaInterface
} from './state'
import { i18n } from '../../boot/i18n' // vue组件外取i18n对象的方法

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

  /* vmcreate使用 */
  getPublicNetworksByServiceId (state): NetworkInterface[] {
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userNetworkTable.byLocalId).filter(network => network.public && network.service === serviceId)
  },
  getPrivateNetworksByServicedId (state): NetworkInterface[] {
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userNetworkTable.byLocalId).filter(network => !network.public && network.service === serviceId)
  },
  getImagesByServiceId (state): ImageInterface[] {
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userImageTable.byLocalId).filter(image => image.service === serviceId)
  },
  // 只返回未过期guota
  getQuotasByServiceId (state): QuotaInterface[] {
    // expirtation_time字段为null时为长期配额，应视为最大时间
    const sortFn = (a: QuotaInterface, b: QuotaInterface) => new Date(b.expiration_time || 9999999999999).getTime() - new Date(a.expiration_time || 9999999999999).getTime()
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userQuotaTable.byId).filter(quota => {
      if (!quota.deleted && quota.service === serviceId) {
        return !quota.expired
      } else {
        return false
      }
    }).sort(sortFn)
  },
  /* vmcreate使用 */

  /* 获取所有server */
  getServers (state): ServerInterface[] {
    const rows: ServerInterface[] = []
    for (const server of Object.values(state.tables.userServerTable.byId)) {
      rows.push(server)
    }
    return rows
  }
  /* 获取所有server */

}

export default getters
