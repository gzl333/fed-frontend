import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { FedModuleInterface } from './state'
import api from '../api'
import { normalize, schema } from 'normalizr'

const actions: ActionTree<FedModuleInterface, StateInterface> = {
  /* fed模块起点 */
  loadFedModuleTable (context) {
    if (!context.state.tables.dataCenterTable.isLoaded) {
      void context.dispatch('loadDataCenterTable').then(() => {
        if (!context.state.tables.serviceTable.isLoaded) {
          void context.dispatch('loadServiceTable').then(() => {
            if (!context.state.tables.autonomousAllocationTable.isLoaded) {
              void context.dispatch('loadAutonomousAllocationTable')
            }
            if (!context.state.tables.fedAllocationTable.isLoaded) {
              void context.dispatch('loadFedAllocationTable')
            }
          })
        }
      })
    }
  },
  /* dataCenterTable */
  async loadDataCenterTable (context) {
    // 清空table
    context.commit('clearTable', context.state.tables.dataCenterTable)
    const respDataCenter = await api.registry.getRegistry()
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
    const respService = await api.service.getService()
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
  /* autonomousAllocationTable */
  async loadAutonomousAllocationTable (context) {
    context.commit('clearTable', context.state.tables.autonomousAllocationTable)
    const respPQuota = await api.vms.getVmsServicePQuota()
    const service = new schema.Entity('service')
    const allocation = new schema.Entity('allocation', { service })
    for (const data of respPQuota.data.results) {
      Object.assign(data, { id: data.service.id })
      const normalizedData = normalize(data, allocation)
      context.commit('storeTable', {
        table: context.state.tables.autonomousAllocationTable,
        tableObj: normalizedData.entities.allocation
      })
    }
  },
  /* fedAllocationTable */
  async loadFedAllocationTable (context) {
    context.commit('clearTable', context.state.tables.fedAllocationTable)
    const respSQuota = await api.vms.getVmsServiceSQuota()
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
