import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { NetworkInterface, ServerInterface, VmInterface, ImageInterface, QuotaInterface } from './state'

const getters: GetterTree<VmInterface, StateInterface> = {
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
    const serviceOptions = [
      {
        value: '0',
        label: '全部服务节点'
      }
    ]
    for (const service of Object.values(state.tables.userServiceTable.byId)) {
      serviceOptions.push(
        {
          value: service.id,
          label: state.tables.globalDataCenterTable.byId[service.data_center].name + ' - ' + service.name
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
  // 只返回有效guota
  getQuotasByServiceId (state): QuotaInterface[] {
    const serviceId = state.pages.vmCreate.serviceId
    return Object.values(state.tables.userQuotaTable.byId).filter(quota => {
      if (!quota.deleted && quota.service === serviceId) {
        // 有过期时间则判断是否过期
        if (quota.expiration_time) {
          const diff = Math.abs(new Date(quota.expiration_time).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
          const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
          return days > 1
        } else {
          // 没有过期时间则quota可用
          return true
        }
      } else {
        return false
      }
    })
  }
  /* vmcreate使用 */

}

export default getters
