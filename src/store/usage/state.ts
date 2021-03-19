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
    // eslint-disable-next-line camelcase
    status_code: number;
    // eslint-disable-next-line camelcase
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

// export interface ServerInterface {
//   id: string;
//   name: string;
//   isIpPublic: boolean;
//   ip: string;
//   // dataCenterId?: string;
//   // dataCenterName?: string;
//   serviceId?: string;
//   serviceName?: string;
//   serviceType?: string;
//   image: string;
//   cpu: string;
//   ram: string;
//   endPoint: string;
//   vnc?: string;
//   daysRemain?: number; // 到期时间
//   source?: string; // 资源来源
//   note?: string; // 备注
//   status?: string; // 设备状态
//   timeCreate?: string; // 创建时间
//   charge?: string; // 计费
// }
export interface ServerInterface {
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
    expiration_time?:string;
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
  // eslint-disable-next-line camelcase
  public_ip: boolean;
  image: string;
  // eslint-disable-next-line camelcase
  creation_time: string;
  remarks: string;
  // eslint-disable-next-line camelcase
  endpoint_url: string;
  service: {
    id: string;
    name: string;
    // eslint-disable-next-line camelcase
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
  // eslint-disable-next-line camelcase
  page_size?: number;
  // eslint-disable-next-line camelcase
  service_id?: string;
}

// api响应数据接口
export interface ResServiceResultInterface {
  id: string;
  name: string;
  // eslint-disable-next-line camelcase
  service_type: string;
  // eslint-disable-next-line camelcase
  add_time: string;
  // eslint-disable-next-line camelcase
  need_vpn: boolean;
  status: number;
  // eslint-disable-next-line camelcase
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

export interface DataCenterInterface {
  key: string; // 应该与label值相同，避免tree组件中与dataPoint的id重合
  label: string;
  selectable: false;
  children: DataPointInterface[];
}

export interface DataRootInterface {
  key: '0';
  label: '全部节点';
  icon?: string;
  children: DataCenterInterface[]
}

// export interface DataPointOnShowInterface {
//   key: string;
//   label: string;
// }

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

export interface ServiceInterface {
  serviceId: string;
  serviceName: string;
  networks: {
    public: DataPointNetworkInterface[];
    private: DataPointNetworkInterface[];
  };
  images: ImageInterface[];
  flavors: FlavorInterface[]
}

// export interface ServerDetailInterface {
//   id: string;
//   name?: string;
//   vcpus?: number;
//   ram?: number;
//   ipv4?: string;
//   public_ip?: boolean;
//   image?: string;
//   creation_time?: string;
//   remarks?: string;
//   endpoint_url?: string;
//   service?: {
//     id: string;
//     name: string;
//     service_type: string;
//   }
// }

export interface VpnInterface {
  username: string;
  password: string;
  active: boolean;
  create_time: string;
  modified_time: string;
}

// Usage总接口
export interface UsageInterface {
  dataPointTree: DataRootInterface[];
  serverList: ServerInterface[];
  // dataPointOnShow: DataPointOnShowInterface;
  pagination: PaginationInterface;
  serviceList: ServiceInterface[]; // 当前用户全部可用service
  serverDetail: ServerInterface;
  vpn: Map<string, VpnInterface>;
}

function state (): UsageInterface {
  return {
    dataPointTree: [{
      key: '0',
      label: '全部节点',
      icon: 'storage',
      children: []
    }],
    // dataPointOnShow: {
    //   key: '0',
    //   label: '全部节点'
    // },
    serverList: [],
    pagination: {
      count: 1,
      page: 1,
      pageSize: 1,
      serviceId: '0',
      serviceName: '全部节点'
    },
    serviceList: [],
    serverDetail: {
      id: '0' // serverDetail中： id='0'是直接进入页面，应重定向；id=''是在读取中，应loading，其它状态则显示信息
    },
    vpn: new Map()
  }
}

export default state