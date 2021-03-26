import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import {
  UsageInterface,
  TreeRootInterface,
  ResServiceResultInterface,
  ReqServerListInterface,
  // ResServerInterface,
  ServerInterface, ReqServerNote, DataPointNetworkInterface, ServiceInterface, ReqServerCreate
  // , PaginationInterface
} from './state'
import axios, { AxiosResponse } from 'axios'

// 格式化数据结构工具 -> 将数据扁平化

// import { normalize, schema } from 'normalizr'
//
// const originData =
//   [
//     {
//       id: 'f6740e68-8862-11eb-ad18-c8009fe2eb02',
//       name: '6c660b3707304132a787fba87bbfb56b',
//       vcpus: 1,
//       ram: 1024,
//       ipv4: '159.226.235.62',
//       public_ip: true,
//       image: 'CentOS_Stream',
//       creation_time: '2021-03-19T03:26:58.793601Z',
//       remarks: 'zlguo@cnic.cn',
//       endpoint_url: 'http://gosc.cstcloud.cn/',
//       service: {
//         id: '1',
//         name: 'HR_204机房',
//         service_type: 'evcloud'
//       },
//       user_quota: {
//         id: '70ef572e-7fdf-11eb-b60f-c8009fe2eb02',
//         tag: {
//           value: 1,
//           display: '普通配额'
//         },
//         expiration_time: null,
//         deleted: false,
//         display: '[普通配额](vCPU: 50, RAM: 51200Mb, PublicIP: 50, PrivateIP: 50)'
//       },
//       center_quota: 2
//     }
//   ]
// const service = new schema.Entity('service')
// const user_quota = new schema.Entity('user_quota')
// const server = new schema.Entity('server', { service, user_quota })
// originData.forEach((data) => {
//   const normalizedData = normalize(data, server)
//   console.log(normalizedData)
// })

const apiBase = 'http://gosc.cstcloud.cn/api'
const codeMap = new Map<number, string>(
  [
    [0, '无法获取状态'],
    [1, '运行中'],
    [2, '已屏蔽'],
    [3, '已暂停'],
    [4, '正在关机'],
    [5, '已关机'],
    [6, '已崩溃'],
    [7, '被电源管理器挂起'],
    [9, '与宿主机通讯失败'],
    [10, '已丢失'],
    [11, '正在创建'],
    [12, '创建失败']
  ]
)

const actions: ActionTree<UsageInterface, StateInterface> = {
  async serverDetailOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeServerDetailStatus', '')

    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 状态更新应延时获取
    void await new Promise(resolve => (
      setTimeout(resolve, 3000)
    ))
    // 为server detail 获取status
    const respFetchServerStatus = await context.dispatch('fetchServerStatus', payload.id)
    const status = codeMap.get(respFetchServerStatus.data.status.status_code)
    context.commit('storeServerDetailStatus', status)

    return response
  },
  async patchVpnPassword (context, payload: { serviceId: string; password: string }) {
    const api = apiBase + '/vpn/' + payload.serviceId
    const data = {
      password: payload.password
    }
    const response = await axios.patch(api, data)
    return response
  },
  // 获取并存储全部用户有关的vpn信息
  async updateVpnAll (context) {
    // 获取用户全部相关service
    const respFetchService = await context.dispatch('fetchService', { available_only: true })
    for (const service of respFetchService.data.results) {
      // 拿到每个service， 用service.id获取并更新单个vpn信息
      void await context.dispatch('updateVpn', {
        serviceId: service.id,
        serviceName: service.name
      })
    }
  },
  // 获取并存储单个vpn信息
  async updateVpn (context, payload: { serviceId: string; serviceName: string }) {
    const respFetchVpn = await context.dispatch('fetchVpn', payload.serviceId)
    context.commit('storeVpn', {
      ...payload,
      vpn: respFetchVpn.data.vpn
    })
  },
  async fetchVpn (context, serviceId: string) {
    const api = apiBase + '/vpn/' + serviceId
    const response = await axios.get(api)
    return response
  },
  async updateServerInfo (context, serverId: string) {
    // serverDetail中： id='0'是直接进入页面，应重定向；id=''是在读取中，应loading，其它状态则显示信息
    // 先清空已有的server detail
    void context.commit('clearServerDetail')
    // 获取新的server detail
    const respFetchServerInto = await context.dispatch('fetchServerInfo', serverId)
    context.commit('storeServerDetail', respFetchServerInto.data.server)
    // 为server detail 获取status
    const respFetchServerStatus = await context.dispatch('fetchServerStatus', serverId)
    const status = codeMap.get(respFetchServerStatus.data.status.status_code)
    context.commit('storeServerDetailStatus', status)
  },
  async fetchServerInfo (context, id: string) {
    const api = apiBase + '/server/' + id
    const response = axios.get(api)
    return response
  },
  async createServer (context, payload: ReqServerCreate) {
    const api = apiBase + '/server/'
    const data = payload
    const response = axios.post(api, data)
    return response
  },
  async fetchFlavor (/* context */) {
    const api = apiBase + '/flavor/'
    const response = await axios.get(api)
    return response
  },
  async updateServiceList (context) {
    if (context.state.dataPointTree[0].children.length === 0) {
      void await context.dispatch('updateDataPointTree')
    }
    for (const dataCenter of context.state.dataPointTree[0].children) {
      for (const dataPoint of dataCenter.children) {
        const service: ServiceInterface = {
          serviceId: dataPoint.key,
          serviceName: dataPoint.label,
          networks: {
            public: [],
            private: []
          },
          images: [],
          flavors: []
        }

        // 根据dataPointTree上建立的network信息来构建
        // todo 将networks单独建立一个表
        dataPoint.networks.forEach((network) => {
          if (network.public) {
            service.networks.public.unshift(network)
          } else {
            service.networks.private.unshift(network)
          }
        })

        const resImage = await context.dispatch('fetchImage', dataPoint.key)
        service.images = resImage.data
        const resFlavor = await context.dispatch('fetchFlavor')
        service.flavors = resFlavor.data.flavors
        context.commit('storeService', service)
      }
    }
    // console.log(context.state.serviceList)
  },
  async fetchImage (context, payload: string) {
    const api = apiBase + '/image/'
    const config = {
      params: {
        service_id: payload
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  async fetchNetwork (context, payload: string) {
    const api = apiBase + '/network/'
    const config = {
      params: {
        service_id: payload
      }
    }
    const response = await axios.get(api, config)
    return response
  },
  async patchNote (context, payload: ReqServerNote) {
    // const api = apiBase + '/server/' + payload.id + '/remark/'
    const api = `${apiBase}/server/${payload.id}/remark/`
    const config = { params: { remark: payload.remark } }
    const response = await axios.patch(api, null, config)
    return response
  },
  async vmOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeServerStatus', {
      id: payload.id,
      status: ''
    })
    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const data = { action: payload.action }
    const response = await axios.post(api, data)

    // 如果删除主机，重新获取serverList
    if (payload.action === 'delete' || payload.action === 'delete_force') {
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 重新获取serverList
      const config = context.state.pagination.serviceId === '0' ? {} : { service_id: context.state.pagination.serviceId }
      void await context.dispatch('updateServerList', config)
    } else {
      // 其它操作只更新该主机状态
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      const resServerStatus = await context.dispatch('fetchServerStatus', payload.id)
      context.commit('storeServerStatus', {
        id: payload.id,
        status: codeMap.get(resServerStatus.data.status.status_code)
      })
      // console.log('vmOperaton', context.state.serverList)
    }
    return response
  },
  async fetchService (context, payload?: { page?: number; page_size?: number; center_id?: string; available_only?: boolean; }) { // todo 按照分页修改
    const api = apiBase + '/service/'
    let response
    if (payload) {
      const config = {
        params: payload
      }
      response = await axios.get(api, config)
    } else {
      response = await axios.get(api)
    }
    return response
  },
  async updateDataPointTree (context) {
    // 获取全部与用户有关的service
    const response = await context.dispatch('fetchService', { available_only: true })
    const results: ResServiceResultInterface[] = response.data.results
    // translate response to dataPointTree
    const dataPointTree: TreeRootInterface[] = [{
      key: '0',
      label: '全部节点',
      icon: 'storage',
      children: []
    }]
    results.forEach((resPoint) => {
      let hasCenter = false
      dataPointTree[0].children.forEach((treeCenter) => {
        if (treeCenter.label === resPoint.data_center.name) {
          hasCenter = true
        }
      })
      if (!hasCenter) {
        dataPointTree[0].children.unshift({
          key: resPoint.data_center.name, // 因为datacenter和datapoint的key都是数值，这里避免与datapoint key重复
          label: resPoint.data_center.name,
          selectable: false,
          children: []
        })
      }
    })
    // second iteration to add dataPoints to dataCenters
    for (const resPoint of results) {
      for (const treeCenter of dataPointTree[0].children) {
        if (treeCenter.label === resPoint.data_center.name) {
          // 建立dataPointTree时，额外添加的network信息，共serviceList使用
          // todo 优化结构，此处不再存储network，或者单独建立network表，或者在serviceList建立时再取数据
          const resNetwork: AxiosResponse = await context.dispatch('fetchNetwork', resPoint.id)
          const networks: DataPointNetworkInterface[] = []
          resNetwork.data.forEach((network: DataPointNetworkInterface) => {
            networks.unshift(network)
          })

          treeCenter.children.unshift({
            key: resPoint.id,
            label: resPoint.name,
            serviceType: resPoint.service_type,
            icon: 'storage',
            networks: networks
          })
        }
      }
    }
    context.commit('storeDataPointTree', dataPointTree)
    // console.log(context.state.dataPointTree)
  },
  async fetchServerList (context, payload?: ReqServerListInterface) {
    const api = apiBase + '/server/'
    const config = {
      params: { ...payload }
    }
    const response = await axios.get(api, config)
    // console.log(config)
    return response
  },
  async fetchServerStatus (context, serverId: string) {
    const api = apiBase + '/server/' + serverId + '/status/'
    const response = await axios.get(api)
    return response
  },
  async fetchServerVNC (context, payload: string) {
    const api = apiBase + '/server/' + payload + '/vnc/'
    const response = await axios.get(api)
    return response
  },
  async updateServerList (context) {
    // 每次获取serverList之前先从store.pagination取得当前分页信息
    const payload: ReqServerListInterface = {
      page: context.state.pagination.page,
      page_size: context.state.pagination.pageSize
    }
    // serviceId 不为0时才有config发出，为0就是获取全部list，没有config发出
    if (context.state.pagination.serviceId !== '0') {
      payload.service_id = context.state.pagination.serviceId
    }
    // console.log('ajax req', payload)
    // 根据payload发送请求
    const resServerList = await context.dispatch('fetchServerList', payload)

    // console.log('res', resServerList)
    // 保存resp中分页信息，分页store中count的来源
    context.commit('storePagination', { count: resServerList.data.count })
    // console.log(resServerList.data)
    // 保存resp中server信息
    // console.log(resServers)
    const serverList: ServerInterface[] = []
    for (const resServer of resServerList.data.servers) {
      serverList.push(resServer)
    }
    context.commit('storeServerList', serverList)
    // console.log(context.state.serverList)

    // 给每个server一个初始空status，启动loading按钮进行占位，防止页面抖动
    for (const server of context.state.serverList) {
      context.commit('storeServerStatus', {
        id: server.id,
        status: ''
      })
    }

    // 更新每个server的status
    for (const server of context.state.serverList) {
      void context.dispatch('fetchServerStatus', server.id).then((value) => {
        const payload = {
          id: server.id,
          status: codeMap.get(value.data.status.status_code)
        }
        context.commit('storeServerStatus', payload)
        // console.log(server.status)
      })
    }

    // console.log(context.state.serverList)
    // console.log('end update list')
  }
}

export default actions
