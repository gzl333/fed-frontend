export interface ServersInterface {
  id: string;
  ip: string;
}
export interface TypeInterface {
  type: string; // 配额类型
  id: string; // quota id
  privateIpTotal: number;
  privateIpUsed: number;
  publicIpTotal: number;
  publicIpUsed: number;
  vCpuTotal: number;
  vCpuUsed: number;
  ramTotal: number;
  ramUsed: number;
  diskTotal: number;
  diskUsed: number;
  expirationTime: string;
  deleted?: boolean;
  display:string;
  usedServersCount?:number;
  usedServers?:ServersInterface[];
}

export interface ServiceInterface {
  name: string; // service名称
  id: string; // serviceid
  serviceTypes : TypeInterface[]; // 多个服务类型
}

export interface UserQuotaInterface {
  userEmail: string;
  services?: ServiceInterface[]; // 数据提供机构
}

export interface QuotaInterface {
  userQuota: UserQuotaInterface; // 用户配额
  groupQuota?: unknown;
}

export interface UquotaResponseResultsInterface {
  id: string;
  tag: {
    value: number;
    display: string;
  };
  user: {
    id: string;
    username: string;
  };
  service: {
    id: string;
    name: string;
  };
  // eslint-disable-next-line camelcase
  private_ip_total: number;
  // eslint-disable-next-line camelcase
  private_ip_used: number;
  // eslint-disable-next-line camelcase
  public_ip_total: number;
  // eslint-disable-next-line camelcase
  public_ip_used: number;
  // eslint-disable-next-line camelcase
  vcpu_total: number;
  // eslint-disable-next-line camelcase
  vcpu_used: number;
  // eslint-disable-next-line camelcase
  ram_total: number;
  // eslint-disable-next-line camelcase
  ram_used: number;
  // eslint-disable-next-line camelcase
  disk_size_total: number;
  // eslint-disable-next-line camelcase
  disk_size_used: number;
  // eslint-disable-next-line camelcase
  expiration_time: string;
  deleted: boolean;
  display: string;
}

export interface UquotaResponseInterface {
  count: number;
  next: unknown;
  previous: unknown;
  results: UquotaResponseResultsInterface[];
}

export interface UquotaServersResponseResultsInterface {
  id: string;
  name: string;
  vcpu: number;
  ipv4: string;
  // eslint-disable-next-line camelcase
  public_ip: boolean;
  image: string;
  // eslint-disable-next-line camelcase
  creation_time: string;
  remarks: string;
}

export interface UquotaServersResponseInterface {
  count: number;
  next: unknown;
  previous: unknown;
  results: UquotaServersResponseResultsInterface[];
}

function state (): QuotaInterface {
  return {
    userQuota: {
      userEmail: '',
      services: [{
        name: '',
        id: '',
        serviceTypes: [
          {
            type: '',
            id: '',
            privateIpTotal: 1,
            privateIpUsed: 0,
            publicIpTotal: 1,
            publicIpUsed: 0,
            vCpuTotal: 1,
            vCpuUsed: 0,
            ramTotal: 1,
            ramUsed: 0,
            diskTotal: 1,
            diskUsed: 0,
            expirationTime: '',
            display: '',
            usedServersCount: 0
          }
        ]
      }]
    }
  }
}

export default state
