/*
* 作者：
* 描述：
* 修改者：
* 修改时间：
* 修改内容：
* */

export interface DataCenterInterface {
  // 来自registry接口
  id: string
  name: string
  name_en: string
  endpoint_vms: string
  endpoint_object: never // null 待细化
  endpoint_compute: never // null 待细化
  endpoint_monitor: never // null 待细化
  creation_time: string
  status: {
    code: number
    message: string
  },
  desc: string

  // 来自service接口
  services: string[] // 全部services汇总
  personalServices: string[] // 用户可用services汇总
}

export interface ServiceInterface {
  // 来自service接口
  id: string
  name: string
  name_en: string
  service_type: string
  add_time: string
  need_vpn: boolean
  status: number
  data_center: string
}

// 资源配置接口： 服务提供给联邦的配额用 资源配置 来描述
export interface AllocationInterface {
  private_ip_total: number
  public_ip_total: number
  vcpu_total: number
  ram_total: number
  disk_size_total: number
  private_ip_used: number
  public_ip_used: number
  vcpu_used: number
  ram_used: number
  disk_size_used: number
  creation_time: string
  enable: boolean
  service: string
}

export interface FedModuleInterface {
  pages: {
    // 页面所需数据
  },
  tables: {
    // 联邦层级datacenter
    dataCenterTable: {
      byId: Record<string, DataCenterInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 联邦层级service
    serviceTable: {
      byId: Record<string, ServiceInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 全部service的 自主资源配置(autonomous resource allocation)，服务各自管理
    autonomousAllocationTable: {
      byId: Record<string, AllocationInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 全部service的 联邦资源配置(federation resource allocation)，联邦统一管理
    fedAllocationTable: {
      byId: Record<string, AllocationInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

function state (): FedModuleInterface {
  return {
    pages: {},
    tables: {
      dataCenterTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      serviceTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      autonomousAllocationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      fedAllocationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
