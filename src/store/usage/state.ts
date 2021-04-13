export interface ServerInterface_old {
  // 以下结构来自api response
  id: string;
  name?: string;
  vcpus?: number;
  ram?: number;
  ipv4?: string;
  public_ip?: boolean;
  image?: string;
  creation_time?: string;
  remarks?: string;
  endpoint_url?: string;
  service?: {
    id: string;
    name: string;
    service_type: string;
  },
  user_quota?: {
    id?: string;
    tag?: {
      value: number;
      display: string;
    },
    expiration_time?: string;
    deleted?: boolean;
    display?: string;
  },
  center_quota?: number;

  // 以下结构是本地所需，额外添加
  status?: string; // 设备状态
}

export interface ReqServerListInterface {
  page?: number;
  page_size?: number;
  service_id?: string;
}

// api响应数据接口
export interface ResServiceResultInterface {
  id: string;
  name: string;
  service_type: string;
  add_time: string;
  need_vpn: boolean;
  status: number;
  data_center: {
    id: string;
    name: string;
  }
}

export interface ResServiceInterface {
  count: number | null;
  next: number | null;
  previous: number | null,
  results: ResServiceResultInterface[]
}

// 机构树组件所需数据接口
export interface DataPointNetworkInterface {
  id: string; // network id
  name: string;
  public: boolean;
  segment: string;
}

export interface DataPointInterface {
  key: string;
  label: string;
  icon?: string;
  serviceType: string;
  networks: DataPointNetworkInterface[]
}

export interface DataCenterInterface_old {
  key: string; // 应该与label值相同，避免tree组件中与dataPoint的id重合
  label: string;
  selectable: false;
  children: DataPointInterface[];
}

export interface TreeRootInterface {
  key: '0';
  label: '全部节点';
  icon?: string;
  children: DataCenterInterface_old[]
}

// service_id对应各种服务
export interface FlavorInterface_old {
  id: string;
  vcpus: number;
  ram: number;
}

export interface ImageInterface_old {
  id: string;
  name: string;
  system: string;
  systemType: string;
  creationTime: string;
  desc: string;
}

export interface ServiceInterface_old {
  serviceId: string;
  serviceName: string;
  networks: {
    public: DataPointNetworkInterface[];
    private: DataPointNetworkInterface[];
  };
  images: ImageInterface_old[];
  flavors: FlavorInterface_old[]
}

export interface VpnInterface_old {
  // 来自api
  username: string;
  password: string;
  active: boolean;
  create_time: string;
  modified_time: string;
  // 以下结构是本地所需，额外添加
  serviceId: string;
  serviceName?: string;
}

/* 以上interface应全部删除 */

/*
重构后的interface
*/

export interface DataCenterInterface {
  // 来自registry接口
  'id': string
  'name': string
  'endpoint_vms': string
  'endpoint_object': never // null 待细化
  'endpoint_compute': never // null 待细化
  'endpoint_monitor': never // null 待细化
  'creation_time': string
  'status': {
    'code': number
    'message': string
  },
  'desc': string

  // 来自service接口
  services: string[]
}

export interface ServiceInterface {
  // 来自service接口
  id: string
  name: string
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
  endpoint_url: string
  service: string
  user_quota: string
  center_quota: number

  // 来自status接口 根据status_code映射为文字状态
  status?: string
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
  // 来自server接口补充
  servers?: string[] // serverId
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

// Usage总接口
export interface UsageInterface {
  pages: { // 各个页面所需vuex数据
    vmList: {
      filter: string // serviceId 用于筛选显示server列表，'0'为显示全部
    }
    vmCreate: {
      serviceId: string // serviceId serviceId选择结果影响后面所有选项的options
    }
  }
  tables: { // 扁平的data table
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
    /*  未实现，暂不需使用
      globalServiceTable: {
        byId: Record<string, ServiceInterface>
        allIds: string[]
        isLoaded: boolean
      } */
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
      byId: Record<string, VpnInterface> // 后端没有id，自加id，与serviceId同
      allIds: string[]
      isLoaded: boolean
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
  }
}

function state ():
  UsageInterface {
  return {
    pages: {
      vmList: {
        filter: '0'
      },
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
        isLoaded: false
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
      }
      // , userArchivedServerTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // }
    }
  }
}

export default state
