export interface FlavorInterface {
  id: string
  vcpus: number
  ram: number
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

// 配额申请接口
export interface ApplicationQuotaInterface {
  private_ip: number
  public_ip: number
  vcpu: number
  ram: number
  disk_size: number
  duration_days: number
  company: string
  contact: string
  purpose: string
  id: string
  creation_time: string
  status: string
  service: string
  deleted: boolean
  classification: 'personal' | 'vo'
  result_desc: string // 拒绝理由

  // 来自补充
  vo_id?: string
}

// 赠送配额活动
export interface QuotaActivity {
  'id': string
  'got_count': number
  'service': string // service id
  'user': string // user id
  'creation_time': string
  'name': string
  'name_en': string
  'start_time': string
  'end_time': string
  'count': number
  'times_per_user': number
  'status': string
  'tag': string
  'cpus': number
  'private_ip': number
  'public_ip': number
  'ram': number
  'disk_size': number
  'expiration_time': string
  'duration_days': number
}

export interface ServerModuleInterface {
  pages: {
    // pages
  }
  tables: {
    // 所有人一样的云主机配置选项
    fedFlavorTable: {
      byId: Record<string, FlavorInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 联邦配额赠送活动
    fedQuotaActivityTable: {
      byId: Record<string, QuotaActivity>
      allIds: string[]
      isLoaded: boolean
    }
    // 服务内通行的网络配置
    serviceNetworkTable: {
      byLocalId: Record<string, NetworkInterface>
      allLocalIds: string[]
      isLoaded: boolean
    }
    // 服务内通行的镜像配置
    serviceImageTable: {
      byLocalId: Record<string, ImageInterface>
      allLocalIds: string[]
      isLoaded: boolean
    }
    // 用户全部的Vpn -> 依赖fed/serviceTable
    userVpnTable: {
      byId: Record<string, VpnInterface> // 原始数据没有id，自加id，与serviceId同。service不一定有vpn
      allIds: string[]
      isLoaded: boolean
    }
    // 个人云主机配额申请
    personalQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 个人云主机配额
    personalQuotaTable: {
      byId: Record<string, QuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 个人云主机
    personalServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 项目组云主机配额申请
    groupQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 项目组云主机配额
    groupQuotaTable: {
      byId: Record<string, QuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 项目组云主机
    groupServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

function state (): ServerModuleInterface {
  return {
    pages: {},
    tables: {
      fedFlavorTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      fedQuotaActivityTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      serviceNetworkTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      serviceImageTable: {
        byLocalId: {},
        allLocalIds: [],
        isLoaded: false
      },
      userVpnTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      personalQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      personalQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      personalServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      groupQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      groupQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      groupServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
