// 当前展示的云主机数据接口
export interface DataCenterOnShowInterface {
  centers: string[];
}

// api响应数据接口
export interface ApiServiceResResultInterface {
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
}}
export interface ApiServiceResInterface {
  count: number;
  next: number | null;
  previous: number | null,
  results: ApiServiceResResultInterface[]
}
export interface ApiServerListResServersInterface{
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
export interface ApiServerListResInterface {
  next: number;
  previous: number;
  servers: ApiServerListResServersInterface[];
}
export interface ApiServerListReqInterface {
  cursor?: string;
  'page-size'?: number;
  // eslint-disable-next-line camelcase
  service_id?: string;
}

// 机构树组件所需数据接口
export interface DataPointInterface{
  id: string;
  name: string;
}
export interface DataCenterInterface {
  id: string; // 应该与name值相同，避免tree组件中与dataPoint的id重合
  name: string;
  dataPoints: DataPointInterface[];
}
export interface UsageInterface {
  dataPointTree: DataCenterInterface[];
  dataCenterOnSow: DataCenterOnShowInterface;
}

function state (): UsageInterface {
  return {
    dataPointTree: [
      {
        id: '',
        name: '',
        dataPoints: [
          {
            id: '',
            name: ''
          }
        ]
      }
    ],
    dataCenterOnSow: {
      centers: []
    }
  }
}

export default state
