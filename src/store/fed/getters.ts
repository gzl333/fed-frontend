import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { FedModuleInterface } from './state'
import { i18n } from 'boot/i18n'

const getters: GetterTree<FedModuleInterface, StateInterface> = {
  getServiceCpuPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.serviceAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.serviceAllocationTable.byId[item]?.vcpu_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getServiceRamPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.serviceAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.serviceAllocationTable.byId[item]?.ram_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getServiceDiskPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.serviceAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.serviceAllocationTable.byId[item]?.disk_size_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getFedCpuPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.fedAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.fedAllocationTable.byId[item]?.vcpu_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getFedRamPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.fedAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.fedAllocationTable.byId[item]?.ram_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getFedDiskPie (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    for (const item of state.tables.fedAllocationTable.allIds) {
      const dataObj: Record<string, string | number> = {}
      dataObj.name = state.tables.serviceTable.byId[item]?.name
      dataObj.value = state.tables.fedAllocationTable.byId[item]?.disk_size_total
      dataArr.push(dataObj)
    }
    return dataArr
  },
  getMechanismTree (state): any {
    const treeData = []
    for (const item of state.tables.dataCenterTable.allIds) {
      const treeObj: any = {}
      treeObj.label = state.tables.dataCenterTable.byId[item]?.name
      treeObj.id = state.tables.dataCenterTable.byId[item]?.id
      const dataArr = []
      for (const childItem of state.tables.dataCenterTable.byId[item]?.services) {
        const dataObj: Record<string, string | boolean> = {}
        dataObj.label = state.tables.serviceTable.byId[childItem]?.name
        dataObj.id = state.tables.serviceTable.byId[childItem]?.id
        dataObj.noTick = true
        dataArr.push(dataObj)
      }
      treeObj.children = dataArr
      treeData.push(treeObj)
    }
    return treeData
  },
  getServices (state): { value: string; label: string; }[] {
    const serviceOptions = []
    for (const group of Object.values(state.tables.serviceTable.byId)) {
      serviceOptions.push(
        {
          value: group.id,
          label: group.name
        }
      )
    }
    serviceOptions.unshift({
      value: '',
      label: i18n.global.locale === 'zh' ? '全部服务' : 'All Groups'
    })
    return serviceOptions
  },
  /* join federation使用 */
  getDataCenterOptions (state): { value: string; label: string; }[] {
    const dataCenterOptions = []
    for (const dataCenter of Object.values(state.tables.dataCenterTable.byId)) {
      dataCenterOptions.push(
        {
          value: dataCenter.id,
          label: dataCenter.name
        }
      )
    }
    return dataCenterOptions
  }
  /* join federation使用 */
}

export default getters
