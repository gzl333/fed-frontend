import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface } from './state'
import api from '../api'
import { normalize, schema } from 'normalizr'
import { ServerInterface } from 'src/store/vm/state'

const actions: ActionTree<ServerModuleInterface, StateInterface> = {

  loadServerModuleTable (context) {
    if (!context.state.tables.fedFlavorTable.isLoaded) {
      void context.dispatch('loadFedFlavorTable')
    }
    if (!context.state.tables.personalQuotaTable.isLoaded) {
      void context.dispatch('loadPersonalQuotaTable')
    }
  },
  async loadFedFlavorTable (context) {
    context.commit('clearTable', context.state.tables.fedFlavorTable)
    const respFlavor = await api.flavor.getFlavor()
    for (const flavor of respFlavor.data.flavors) {
      context.commit('storeTable', {
        table: context.state.tables.fedFlavorTable,
        tableObj: { [flavor.id]: flavor }
      })
    }
  },
  async loadServiceNetworkTable (context) {
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respNetwork = await api.network.getNetwork({ query: { service_id: serviceId } })
      for (const network of respNetwork.data) {
        // 将service 和 localId补充进network对象
        Object.assign(network, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${network.id}`
        })
        context.commit('storeTableLocalId', {
          table: context.state.tables.serviceNetworkTable,
          tableObj: { [network.localId]: network }
        })
      }
    }
  },
  async loadServiceImageTable (context) {
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respImage = await api.image.getImage({ query: { service_id: serviceId } })
      for (const image of respImage.data) {
        // 将service 和 localId补充进image对象
        Object.assign(image, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${image.id}`
        })
        context.commit('storeTableLocalId', {
          table: context.state.tables.serviceImageTable,
          tableObj: { [image.localId]: image }
        })
      }
    }
  },
  async loadUserVpnTable (context) {
    context.commit('clearTable', context.state.tables.userVpnTable)
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respVpn = await api.vpn.getVpn({ path: { service_id: serviceId } })
      Object.assign(respVpn.data.vpn, { id: serviceId })
      context.commit('storeTable', {
        table: context.state.tables.userVpnTable,
        tableObj: { [serviceId]: respVpn.data.vpn }
      })
    }
  },
  async loadPersonalQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.personalQuotaTable)
    // 将响应normalize
    const respQuota = await api.quota.getQuota({ query: { deleted: false } })
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    // quota数组
    for (const data of respQuota.data.results) {
      /* 增加补充字段 */
      // 获取quota下对应的server列表
      const respQuotaServers = await api.quota.getQuotaServers({ path: { id: data.id } })
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
      const exhausted = data.vcpu_used === data.vcpu_total || data.ram_used === data.ram_total || (data.private_ip_used === data.private_ip_total && data.public_ip_used === data.public_ip_total)
      Object.assign(data, { exhausted })
      /* 增加补充字段 */

      // normalize data
      const normalizedData = normalize(data, quota)
      context.commit('storeTable', {
        table: context.state.tables.personalQuotaTable,
        tableObj: normalizedData.entities.quota
      })
    }
  }
}

export default actions
