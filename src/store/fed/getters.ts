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
  // todo 修改为只提供有quota的service列表,并放入server模块
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
    for (const service of Object.values(state.tables.serviceTable.byId)) {
      serviceOptions.push(
        {
          value: service.id,
          label: i18n.global.locale === 'zh' ? state.tables.dataCenterTable.byId[service.data_center].name + ' - ' + service.name : state.tables.dataCenterTable.byId[service.data_center].name_en + ' - ' + service.name_en
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
