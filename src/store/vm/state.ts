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
  userServices: string[] // 用户可用services
  globalServices: string[] // 全部services
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

export interface ServerInterface {
  // 来自server接口
  id: string
  name: string
  vcpus: number
  ram: number
  ipv4: string
  public_ip: boolean
  image: string
  creation_time: string
  expiration_time: string | null
  remarks: string
  classification: string
  image_id: string
  image_desc: string
  default_user: string
  default_password: string
  endpoint_url: string
  service: string
  user_quota: string
  center_quota: number
  vo_id: string | null
  user: {
    id: string
    username: string
  }
  lock: string

  // 来自status接口 根据status_code映射为文字状态
  vnc?: string
  status?: string
}
// duyukuan
export interface PersonalUserQuota {
  id: string
  tag: {
    value: number
    display: string
  }
  expiration_time: string,
  deleted: boolean,
  display: string
}
// 服务私有配额 duyukuan
export interface ServiceQuotaStatInterface {
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
  creation_time: number
  enable: number
}

export interface NetworkInterface {
  // 来自network接口
  id: string
  name: string
  public: boolean
  segment: string
  // 根据查询时所填的serviceId补充
  service: string
  localId: string
}

export interface ImageInterface {
  // 来自image接口
  id: string // 原始id
  name: string
  system: string
  system_type: string
  creation_time: string
  desc: string
  default_user: string
  default_password: string
  // 根据查询时所填的serviceId补充
  service: string
  localId: string
}

export interface FlavorInterface {
  id: string
  vcpus: number
  ram: number
}

export interface VpnInterface {
  username: string
  password: string
  active: boolean
  create_time: string
  modified_time: string
  // vpn接口中无id信息，其id与所在service_id相同
  id: string
}

export interface QuotaInterface {
  id: string
  tag: { // 提出去单做table无用，暂时保留，不拍平
    value: number
    display: string
  },
  user: { // 提出去单做table无用，暂时保留，不拍平
    id: string
    username: string
  },
  service: string
  private_ip_total: number
  private_ip_used: number
  public_ip_total: number
  public_ip_used: number
  vcpu_total: number
  vcpu_used: number
  ram_total: number
  ram_used: number
  disk_size_total: number
  disk_size_used: number
  expiration_time: never // null 待细化
  deleted: boolean
  display: string
  duration_days: number
  classification: 'vo' | 'personal' // 配额类型，二选一

  // 来自vo/quota接口的补充
  vo_id?: string // groupId

  // 来自server接口补充
  servers?: string[] // serverId

  // 以下为根据上述字段自行判断填充
  expired: boolean
  exhausted: boolean
}

export interface ArchivedServerInterface {
  id: string
  service: string // 与serviceTable关联
  user_quota: string // 与userQuotaTable关联
  name: string
  vcpus: number
  ram: number
  ipv4: string
  public_ip: boolean
  image: string
  creation_time: string
  remarks: string
  center_quota: number // 1: 服务的私有资源配额，"user_quota"=null; 2: 服务的分享资源配额
  deleted_time: string
}

// Vm总接口
export interface VmModuleInterface {
  pages: { // 各个页面所需vuex数据
    vmCreate: {
      serviceId: string // serviceId serviceId选择结果影响后面所有选项的options
    }
  }
  tables: { // 扁平的data table
    /* 全局table */
    // 全局统一的datacenter
    globalDataCenterTable: {
      byId: Record<string, DataCenterInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 全局统一的flavor
    globalFlavorTable: {
      byId: Record<string, FlavorInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 全局统一的service
    globalServiceTable: {
      byId: Record<string, ServiceInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 全局的network -> 依赖globalServiceTable
    globalNetworkTable: {
      byLocalId: Record<string, NetworkInterface> // ***与service_id拼接后的id*** 原始id在系统中不唯一
      allLocalIds: string[]
      isLoaded: boolean
    }
    // 全局image -> 依赖globalServiceTable
    globalImageTable: {
      byLocalId: Record<string, ImageInterface> // ***与service_id拼接后的id*** 原始id在系统中不唯一
      allLocalIds: string[]
      isLoaded: boolean
    }
    /* 全局table */

    /* 个人table */
    // 用户可用的service
    userServiceTable: {
      byId: Record<string, ServiceInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 用户可用的network -> 依赖userServiceTable
    userNetworkTable: {
      byLocalId: Record<string, NetworkInterface> // ***与service_id拼接后的id*** 原始id在系统中不唯一
      allLocalIds: string[]
      isLoaded: boolean
    }
    // 用户可用的image -> 依赖userServiceTable
    userImageTable: {
      byLocalId: Record<string, ImageInterface> // ***与service_id拼接后的id*** 原始id在系统中不唯一
      allLocalIds: string[]
      isLoaded: boolean
    }
    // 用户可用的Vpn -> 依赖userServiceTable
    userVpnTable: {
      byId: Record<string, VpnInterface> // 后端没有id，自加id，与serviceId同。service不一定有vpn
      allIds: string[]
      isLoaded: {
        service: boolean
        server: boolean
      }
    }
    // 用户可用的userQuota -> 依赖userServiceTable
    userQuotaTable: {
      byId: Record<string, QuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 用户可用的server -> api返回的天然是用户的server，不依赖serviceId，显示时可用serviceId筛选
    userServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 用户可用的archivedServer *暂未使用
    /*  userArchivedServerTable: {
        byId: Record<string, ArchivedServerInterface>
        allIds: string[]
        isLoaded: boolean
      } */
    /* 个人table */

    /* 组table */
    // 组quota，依赖globalServiceTable, groupTable, quotaId -> quota, 所有组quota存一起不区分group，在getter里区分
    groupQuotaTable: {
      byId: Record<string, QuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 组server, 依赖group/groupTable, serverId -> server, 所有组server存一起不区分group，在getter里区分
    groupServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
    /* 组table */

    /* provider table */
    // 个人服务器table duyukuan
    providerServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
    providerQuotaTable: {
      byId: Record<string, PersonalUserQuota>
      allIds: string[]
      isLoaded: boolean
    }
    /* provider table */

    /* federation management */
    // 服务私有配额 table
    privateServiceQuotaStatTable: {
      byId: Record<string, ServiceQuotaStatInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 服务共享配额 table
    sharedServiceQuotaStatTable: {
      byId: Record<string, ServiceQuotaStatInterface>
      allIds: string[]
      isLoaded: boolean
    }
    /* federation management */
  }
}

function state (): VmModuleInterface {
  return {
    pages: {
      vmCreate: {
        serviceId: '0'
      }
    },
    tables: {
      globalDataCenterTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      globalFlavorTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      globalServiceTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      globalNetworkTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      globalImageTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      userServiceTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      userNetworkTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      userImageTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      userVpnTable: {
        byId: {},
        allIds: [],
        isLoaded: {
          service: false,
          server: false
        }
      },
      userServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      userQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      //   userArchivedServerTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // }
      groupQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      groupServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      // duyukuan
      providerServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      providerQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      privateServiceQuotaStatTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      sharedServiceQuotaStatTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
