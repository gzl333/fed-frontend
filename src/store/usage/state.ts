export interface ReqServerCreate {
  service_id: string;
  network_id: string;
  image_id: string;
  flavor_id: string;
  quota_id: string;
  remarks?: string;
}

export interface ReqServerNote {
  id: string;
  remark: string;
}

// 当前展示的云主机数据接口
export interface ResServerStatusInterface {
  status: {
    status_code: number;
    status_text: string;
  }
}

export interface PaginationInterface {
  count?: number;
  page?: number;
  pageSize?: number;
  serviceId?: string;
  serviceName?: string;
  next?: string | null;
  previous?: string | null;
}

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

export interface ResServerInterface {
  id: string;
  name: string;
  vcpus: number;
  ram: number;
  ipv4: string;
  public_ip: boolean;
  image: string;
  creation_time: string;
  remarks: string;
  endpoint_url: string;
  service: {
    id: string;
    name: string;
    service_type: string;
  }
}

export interface ResServerListInterface {
  count?: number;
  next?: string | null;
  previous?: string | null,
  servers: ResServerInterface[]
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
export interface FlavorInterface {
  id: string;
  vcpus: number;
  ram: number;
}

export interface ImageInterface {
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
  images: ImageInterface[];
  flavors: FlavorInterface[]
}

export interface VpnInterface {
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

/*
重构后的interface
*/
export interface DataCenterInterface {
  // 来自registry接口
  'id': string;
  'name': string;
  'endpoint_vms': string;
  'endpoint_object': never; // 待细化
  'endpoint_compute': never; // 待细化
  'endpoint_monitor': never; // 待细化
  'creation_time': string;
  'status': {
    'code': number;
    'message': string;
  },
  'desc': string;

  // 来自service接口
  services?: string[];
}

export interface ServiceInterface {
  // 来自service接口
  id: string;
  name: string;
  service_type: string;
  add_time: string;
  need_vpn: boolean;
  status: number;
  data_center: string;
}

export interface ServerInterface {
  // 来自server接口
  id: string;
  name: string;
  vcpus: number;
  ram: number;
  ipv4: string;
  public_ip: boolean;
  image: string;
  creation_time: string;
  remarks: string;
  endpoint_url: string;
  service: string;
  user_quota: string;
  center_quota: number;

  // 来自status接口 根据status_code映射为文字状态
  status?: string;
}

// Usage总接口
export interface UsageInterface {
  // 机构树 -> 此数据结构是q-tree组件的要求，无法更改
  dataPointTree: TreeRootInterface[];
  // // -->待重构
  // // 云主机列表
  // serverList: ServerInterface_old[];
  // // 云主机分页
  // pagination: PaginationInterface;

  // 新建云主机
  serviceList: ServiceInterface_old[]; // 当前用户全部可用service
  // 云主机详情页
  serverDetail: ServerInterface_old;
  // vpn
  vpn: Map<string, VpnInterface>;
  // <-- 待重构

  /* 扁平的数据结构 */

  // 全部的datacenter
  allDataCenterTable: {
    byId: Record<string, DataCenterInterface>,
    allIds: string[],
    isLoaded: boolean
  };
  // 与用户有关的service
  userServiceTable: {
    byId: Record<string, ServiceInterface>,
    allIds: string[],
    isLoaded: boolean
  };
  // 全部的server
  allServerTable: {
    filter: string;
    byId: Record<string, ServerInterface>,
    allIds: string[],
    isLoaded: boolean
  }
}

function state ():
  UsageInterface {
  return {
    dataPointTree: [{
      key: '0',
      label: '全部节点',
      icon: 'storage',
      children: []
    }],
    // serverList: [],
    // pagination: {
    //   count: 1,
    //   page: 1,
    //   pageSize: 1,
    //   serviceId: '0',
    //   serviceName: '全部节点'
    // },

    serviceList: [],
    serverDetail: {
      id: '0' // serverDetail中： id='0'是直接进入页面，应重定向；id=''是在读取中，应loading，其它状态则显示信息
    },
    vpn: new Map(),

    /*
    重构后的数据结构
    */
    allDataCenterTable: {
      byId: {},
      allIds: [],
      isLoaded: false
    },
    userServiceTable: {
      byId: {},
      allIds: [],
      isLoaded: false
    },
    allServerTable: {
      filter: '0',
      byId: {},
      allIds: [],
      isLoaded: false
    }
  }
}

export default state
