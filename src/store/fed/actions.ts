import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { FedModuleInterface } from './state'
import { $api } from 'boot/api'
import { normalize, schema } from 'normalizr'

const actions: ActionTree<FedModuleInterface, StateInterface> = {
  /* $store加载总起点 */
  loadAllTables (context) {
    if (!context.state.tables.dataCenterTable.isLoaded) {
      void context.dispatch('loadDataCenterTable').then(() => {
        if (!context.state.tables.serviceTable.isLoaded) {
          void context.dispatch('loadServiceTable').then(() => {
            if (!context.state.tables.serviceAllocationTable.isLoaded) {
              void context.dispatch('loadServiceAllocationTable')
            }
            if (!context.state.tables.fedAllocationTable.isLoaded) {
              void context.dispatch('loadFedAllocationTable')
            }
            if (!context.rootState.server.tables.userVpnTable.isLoaded) {
              void context.dispatch('server/loadUserVpnTable', null, { root: true })
            }
            if (!context.rootState.server.tables.serviceNetworkTable.isLoaded) {
              void context.dispatch('server/loadServiceNetworkTable', null, { root: true })
            }
            if (!context.rootState.server.tables.serviceImageTable.isLoaded) {
              void context.dispatch('server/loadServiceImageTable', null, { root: true })
            }
            if (!context.rootState.server.tables.personalServerTable.isLoaded) {
              void context.dispatch('server/loadPersonalServerTable', null, { root: true })
            }
          })
        }
      })
    }

    if (!context.rootState.server.tables.fedFlavorTable.isLoaded) {
      void context.dispatch('server/loadFedFlavorTable', null, { root: true })
    }
    if (!context.rootState.server.tables.personalQuotaTable.isLoaded) {
      void context.dispatch('server/loadPersonalQuotaTable', null, { root: true })
    }
    if (!context.rootState.server.tables.personalQuotaApplicationTable.isLoaded) {
      void context.dispatch('server/loadPersonalQuotaApplicationTable', null, { root: true })
    }
    if (!context.rootState.server.tables.fedQuotaActivityTable.isLoaded) {
      void context.dispatch('server/loadFedQuotaActivityTable', null, { root: true })
    }

    if (!context.rootState.account.tables.groupTable.isLoaded) {
      void context.dispatch('account/loadGroupTable', null, { root: true }).then(() => {
        // groupMemberTable 依赖 groupTable, 根据每个groupId建立一个groupMember对象
        if (!context.rootState.account.tables.groupMemberTable.isLoaded) {
          void context.dispatch('account/loadGroupMemberTable', null, { root: true }).then(() => {
            // 注意：此表依赖groupTable中的myRole字段，而该字段是loadGroupMemberTableFromGroup副产品，所以产生依赖
            if (!context.rootState.server.tables.groupQuotaApplicationTable.isLoaded) {
              void context.dispatch('server/loadGroupQuotaApplicationTable', null, { root: true })
            }
          })
        }
        if (!context.rootState.server.tables.groupServerTable.isLoaded) {
          void context.dispatch('server/loadGroupServerTable', null, { root: true })
        }
        if (!context.rootState.server.tables.groupQuotaTable.isLoaded) {
          void context.dispatch('server/loadGroupQuotaTable', null, { root: true })
        }
      })
    }

    if (!context.rootState.provider.tables.adminQuotaApplicationTable.isLoaded) {
      void context.dispatch('provider/loadAdminQuotaApplicationTable', null, { root: true })
    }
  },
  /* $store加载总起点 */

  /* dataCenterTable */
  async loadDataCenterTable (context) {
    // 清空table
    context.commit('clearTable', context.state.tables.dataCenterTable)
    const respDataCenter = await $api.registry.getRegistry()
    const dataCenter = new schema.Entity('dataCenter', {})
    respDataCenter.data.registries.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, dataCenter)
      // 添加上services/personalServices空字段
      Object.values(normalizedData.entities.dataCenter!)[0].services = []
      Object.values(normalizedData.entities.dataCenter!)[0].personalServices = []
      context.commit('storeTable', {
        table: context.state.tables.dataCenterTable,
        tableObj: normalizedData.entities.dataCenter
      })
    })
  },
  /* serviceTable */
  async loadServiceTable (context) {
    // 清空table
    context.commit('clearTable', context.state.tables.serviceTable)
    const respService = await $api.service.getService()
    // 将响应normalize，存入state里的serviceTable
    const data_center = new schema.Entity('data_center')
    const service = new schema.Entity('service', { data_center })
    respService.data.results.forEach((data: Record<string, never>) => {
      const normalizedData = normalize(data, service)
      // context.commit('storeServiceTable', normalizedData.entities.service)
      context.commit('storeTable', {
        table: context.state.tables.serviceTable,
        tableObj: normalizedData.entities.service
      })
      // 将本serviceId补充进对应dataCenter的services字段
      context.commit('storeDataCenterTableServices', {
        dataCenterId: Object.values(normalizedData.entities.service!)[0].data_center,
        serviceId: Object.values(normalizedData.entities.service!)[0].id
      })
    })
  },
  /* serviceAllocationTable */
  async loadServiceAllocationTable (context) {
    context.commit('clearTable', context.state.tables.serviceAllocationTable)
    const respPQuota = await $api.vms.getVmsServicePQuota()
    const service = new schema.Entity('service')
    const allocation = new schema.Entity('allocation', { service })
    for (const data of respPQuota.data.results) {
      Object.assign(data, { id: data.service.id })
      const normalizedData = normalize(data, allocation)
      context.commit('storeTable', {
        table: context.state.tables.serviceAllocationTable,
        tableObj: normalizedData.entities.allocation
      })
    }
  },
  /* fedAllocationTable */
  async loadFedAllocationTable (context) {
    context.commit('clearTable', context.state.tables.fedAllocationTable)
    const respSQuota = await $api.vms.getVmsServiceSQuota()
    const service = new schema.Entity('service')
    const allocation = new schema.Entity('allocation', { service })
    for (const data of respSQuota.data.results) {
      Object.assign(data, { id: data.service.id })
      const normalizedData = normalize(data, allocation)
      context.commit('storeTable', {
        table: context.state.tables.fedAllocationTable,
        tableObj: normalizedData.entities.allocation
      })
    }
  }
}

export default actions
