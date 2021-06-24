import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import {
  NetworkInterface,
  ServerInterface,
  VmInterface,
  ImageInterface,
  QuotaInterface
} from './state'
import { i18n } from '../../boot/i18n' // vue组件外取i18n对象的方法

const getters: GetterTree<VmInterface, StateInterface> = {

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
    // vue组件外取i18n中locale字段的方法
    const serviceOptions = [
      {
        value: '0',
        label: i18n.global.locale === 'zh' ? '全部服务节点' : 'All Service Nodes'
      }
    ]

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
    return serviceOptions
  },
  getServersByServiceId (state): ServerInterface[] {
    // 根据用户选择的serviceId来返回server数组
    // 当前选择的serviceId位于state.vm.pages.vmlist.filter，利用vmlist中的watch来修改
    if (state.pages.vmList.filter === '0') {
      return Object.values(state.tables.userServerTable.byId)
    } else {
      const rows: ServerInterface[] = []
      for (const server of Object.values(state.tables.userServerTable.byId)) {
        if (server.service === state.pages.vmList.filter) {
          rows.push(server)
        }
      }
      return rows
    }
  },
  /* vmlist 使用 */

  /* quotaList使用 */
  // 根据用户选择的filter来返回application数组
  getUserQuotasByFilter (state): QuotaInterface[] {
    // 当前选择的filter位于state.applyQuota.applicationList.filter，利用applicationList页面中的watch来修改
    if (state.pages.quotaList.filter === '0') {
      return Object.values(state.tables.userQuotaTable.byId)
    } else {
      const rows: QuotaInterface[] = []
      for (const quota of Object.values(state.tables.userQuotaTable.byId)) {
        if (state.pages.quotaList.filter === null && quota.expiration_time === null) { // 筛选出长期的quota
          console.log(quota)
          rows.push(quota)
        } else if (state.pages.quotaList.filter === 'valid' && !!quota.expiration_time && (new Date(quota.expiration_time).getTime() - new Date().getTime()) > 0) { // 筛选出未过期的quota
          rows.push(quota)
        } else if (state.pages.quotaList.filter === 'invalid' && !!quota.expiration_time && (new Date(quota.expiration_time).getTime() - new Date().getTime()) <= 0) { // 筛选出过期的quota
          rows.push(quota)
        }
      }
      return rows
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
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userQuotaTable.byId).filter(quota => {
      if (!quota.deleted && quota.service === serviceId) {
        // 有过期时间则判断是否过期
        if (quota.expiration_time) {
          return Boolean(new Date(quota.expiration_time).getTime() - new Date().getTime())
        } else {
          // 没有过期时间则quota可用
          return true
        }
      } else {
        return false
      }
    })
  },
  /* vmcreate使用 */

  /* 首页-在用云主机资源展示（最多8个） */
  getServers (state): ServerInterface[] {
    const rows: ServerInterface[] = []
    let number = 0
    for (const server of Object.values(state.tables.userServerTable.byId)) {
      if (number < 8) {
        rows.push(server)
        number = number + 1
      }
    }
    return rows
  },
  /* 首页-在用云主机资源展示 */

  /* 首页-获取所有机构下的服务的数量 */
  getServicesNumber (state): number {
    let num = 0
    for (const dataCenter of Object.values(state.tables.globalDataCenterTable.byId)) {
      num = num + dataCenter.globalServices.length
    }
    const servicesNum = num
    return servicesNum
  }
  /* 首页-获取所有机构下的服务的数量 */

}

export default getters
