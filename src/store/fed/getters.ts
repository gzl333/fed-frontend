import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { FedModuleInterface } from './state'
import { i18n } from 'boot/i18n'

const getters: GetterTree<FedModuleInterface, StateInterface> = {
  getPrivateNum (state): { private_ip_total: number; public_ip_used: number; public_ip_total: number; private_ip_used: number; vcpu_total: number; ram_total: number; disk_size_total: number; vcpu_used: number; ram_used: number; disk_size_used: number } {
    let public_ip_total = 0
    let public_ip_used = 0
    let private_ip_total = 0
    let private_ip_used = 0
    let vcpu_total = 0
    let vcpu_used = 0
    let ram_total = 0
    let ram_used = 0
    let disk_size_total = 0
    let disk_size_used = 0
    for (const item of state.tables.serviceAllocationTable.allIds) {
      public_ip_total = public_ip_total + state.tables.serviceAllocationTable.byId[item].public_ip_total
      public_ip_used = public_ip_used + state.tables.serviceAllocationTable.byId[item].public_ip_used
      private_ip_total = private_ip_total + state.tables.serviceAllocationTable.byId[item].private_ip_total
      private_ip_used = private_ip_used + state.tables.serviceAllocationTable.byId[item].private_ip_used
      vcpu_total = vcpu_total + state.tables.serviceAllocationTable.byId[item].vcpu_total
      vcpu_used = vcpu_used + state.tables.serviceAllocationTable.byId[item].vcpu_used
      ram_total = ram_total + state.tables.serviceAllocationTable.byId[item].ram_total
      ram_used = ram_used + state.tables.serviceAllocationTable.byId[item].ram_used
      disk_size_total = disk_size_total + state.tables.serviceAllocationTable.byId[item].disk_size_total
      disk_size_used = disk_size_used + state.tables.serviceAllocationTable.byId[item].disk_size_used
    }
    return {
      public_ip_total,
      public_ip_used,
      private_ip_total,
      private_ip_used,
      vcpu_total,
      vcpu_used,
      ram_total,
      ram_used,
      disk_size_total,
      disk_size_used
    }
  },
  getShareNum (state): { private_ip_total: number; public_ip_used: number; public_ip_total: number; private_ip_used: number; vcpu_total: number; ram_total: number; disk_size_total: number; vcpu_used: number; ram_used: number; disk_size_used: number } {
    let public_ip_total = 0
    let public_ip_used = 0
    let private_ip_total = 0
    let private_ip_used = 0
    let vcpu_total = 0
    let vcpu_used = 0
    let ram_total = 0
    let ram_used = 0
    let disk_size_total = 0
    let disk_size_used = 0
    for (const item of state.tables.fedAllocationTable.allIds) {
      public_ip_total = public_ip_total + state.tables.fedAllocationTable.byId[item].public_ip_total
      public_ip_used = public_ip_used + state.tables.fedAllocationTable.byId[item].public_ip_used
      private_ip_total = private_ip_total + state.tables.fedAllocationTable.byId[item].private_ip_total
      private_ip_used = private_ip_used + state.tables.fedAllocationTable.byId[item].private_ip_used
      vcpu_total = vcpu_total + state.tables.fedAllocationTable.byId[item].vcpu_total
      vcpu_used = vcpu_used + state.tables.fedAllocationTable.byId[item].vcpu_used
      ram_total = ram_total + state.tables.fedAllocationTable.byId[item].ram_total
      ram_used = ram_used + state.tables.fedAllocationTable.byId[item].ram_used
      disk_size_total = disk_size_total + state.tables.fedAllocationTable.byId[item].disk_size_total
      disk_size_used = disk_size_used + state.tables.fedAllocationTable.byId[item].disk_size_used
    }
    return {
      public_ip_total,
      public_ip_used,
      private_ip_total,
      private_ip_used,
      vcpu_total,
      vcpu_used,
      ram_total,
      ram_used,
      disk_size_total,
      disk_size_used
    }
  },
  getPieCpuNum (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    if (state.tables.fedAllocationTable.allIds.length > state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.fedAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.serviceAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.vcpu_total + state.tables.serviceAllocationTable.byId[item]?.vcpu_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.vcpu_total
        }
        dataArr.push(dataObj)
      }
    } else if (state.tables.fedAllocationTable.allIds.length < state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.fedAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.vcpu_total + state.tables.serviceAllocationTable.byId[item]?.vcpu_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.serviceAllocationTable.byId[item]?.vcpu_total
        }
        dataArr.push(dataObj)
      }
    } else {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        dataObj.name = state.tables.serviceTable.byId[item]?.name
        dataObj.value = state.tables.fedAllocationTable.byId[item]?.vcpu_total + state.tables.serviceAllocationTable.byId[item]?.vcpu_total
        dataArr.push(dataObj)
      }
    }
    return dataArr
  },
  getPieRamNum (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    if (state.tables.fedAllocationTable.allIds.length > state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.fedAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.serviceAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.ram_total + state.tables.serviceAllocationTable.byId[item]?.ram_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.ram_total
        }
        dataArr.push(dataObj)
      }
    } else if (state.tables.fedAllocationTable.allIds.length < state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.fedAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.ram_total + state.tables.serviceAllocationTable.byId[item]?.ram_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.serviceAllocationTable.byId[item]?.ram_total
        }
        dataArr.push(dataObj)
      }
    } else {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        dataObj.name = state.tables.serviceTable.byId[item]?.name
        dataObj.value = state.tables.fedAllocationTable.byId[item]?.ram_total + state.tables.serviceAllocationTable.byId[item]?.ram_total
        dataArr.push(dataObj)
      }
    }
    return dataArr
  },
  getPieDiskNum (state): Record<string, string | number>[] {
    const dataArr: Record<string, string | number>[] = []
    if (state.tables.fedAllocationTable.allIds.length > state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.fedAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.serviceAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.disk_size_total + state.tables.serviceAllocationTable.byId[item]?.disk_size_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.disk_size_total
        }
        dataArr.push(dataObj)
      }
    } else if (state.tables.fedAllocationTable.allIds.length < state.tables.serviceAllocationTable.allIds.length) {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        if (state.tables.fedAllocationTable.allIds.indexOf(item) !== -1) {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.fedAllocationTable.byId[item]?.disk_size_total + state.tables.serviceAllocationTable.byId[item]?.disk_size_total
        } else {
          dataObj.name = state.tables.serviceTable.byId[item]?.name
          dataObj.value = state.tables.serviceAllocationTable.byId[item]?.disk_size_total
        }
        dataArr.push(dataObj)
      }
    } else {
      for (const item of state.tables.serviceAllocationTable.allIds) {
        const dataObj: Record<string, string | number> = {}
        dataObj.name = state.tables.serviceTable.byId[item]?.name
        dataObj.value = state.tables.fedAllocationTable.byId[item]?.disk_size_total + state.tables.serviceAllocationTable.byId[item]?.disk_size_total
        dataArr.push(dataObj)
      }
    }
    return dataArr
  },
  getMechanismOptions (state): { value: string; label: string; }[] {
    const groupOptions = []
    for (const group of Object.values(state.tables.dataCenterTable.byId)) {
      groupOptions.push(
        {
          label: group.name,
          value: group.id
        }
      )
    }
    return groupOptions
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
