// 当前展示的云主机数据接口
export interface ResServerStatusInterface {
  status: {
    // eslint-disable-next-line camelcase
    status_code: number;
    // eslint-disable-next-line camelcase
    status_text: string;
  }
}

export interface ServerInterface {
  id: string;
  name: string;
  isIpPublic: boolean;
  ip: string;
  dataCenter?: string;
  serviceType?: string;
  image: string;
  cpu: string;
  ram: string;
  endPoint: string;
  daysRemain?: number; // 到期时间
  source?: string; // 资源来源
  note?: string; // 备注
  status?: string; // 设备状态
  timeCreate?: string; // 创建时间
  charge?: string; // 计费
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
}

export interface ResServerListInterface {
  next: number | null;
  previous: number | null,
  servers: ResServerInterface[]
}

export interface ReqServerListInterface {
  cursor?: string;
  'page-size'?: number;
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
export interface DataPointInterface {
  key: string;
  label: string;
  icon?: string;
  serviceType: string;
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

export interface DataPointOnShowInterface {
  key: string;
  label: string;
}

// Usage总接口
export interface UsageInterface {
  dataPointTree: DataRootInterface[];
  serverList: ServerInterface[];
  dataPointOnShow: DataPointOnShowInterface;
}

function state (): UsageInterface {
  return {
    dataPointTree: [{
      key: '0',
      label: '全部节点',
      icon: 'storage',
      children: []
    }],
    dataPointOnShow: {
      key: '0',
      label: '全部节点'
    },
    serverList: []
  }
}

export default state
