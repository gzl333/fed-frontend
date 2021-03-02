export interface ProviderInterface {
  name: string; // 机构名称
  type: string; // 配额类型
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
  expirationTime?: string;
  deleted?: boolean;
}

export interface UserQuotaInterface {
  userEmail: string;
  providers?: ProviderInterface[]; // 数据提供机构
}

export interface QuotaInterface {
  userQuota: UserQuotaInterface; // 用户配额
  groupQuota?: unknown;
}

export interface UquotaResponseResultsInterface {
  id: number;
  tag: {
    value: number;
    display: string;
  };

  user: {
    id: number;
    username: string;
  };
  service: {
    id: number;
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
  expiration_time: unknown;
  deleted: boolean;
  display: string;
}

export interface UquotaResponseInterface {
  count: number;
  next: unknown;
  previous: unknown;
  results: UquotaResponseResultsInterface[];
}

function state (): QuotaInterface {
  return {
    userQuota: {
      userEmail: '',
      providers: [{
        name: '',
        type: '',
        privateIpTotal: 1,
        privateIpUsed: 0,
        publicIpTotal: 1,
        publicIpUsed: 0,
        vCpuTotal: 1,
        vCpuUsed: 0,
        ramTotal: 1,
        ramUsed: 0,
        diskTotal: 1,
        diskUsed: 0
      }]
    }
  }
}

export default state
