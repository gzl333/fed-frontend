import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { FedModuleInterface } from './state'

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
  }
}

export default getters
