import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import {
  UsageInterface,
  DataRootInterface,
  ResServiceResultInterface,
  ReqServerListInterface,
  ResServerInterface,
  ServerInterface
} from './state'
import axios from 'axios'

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
  async vmOperation (context, payload: { endPoint: string; id: string; action: string }) {
    // 将主机状态清空，界面将显示loading
    context.commit('storeServerStatus', {
      id: payload.id,
      status: ''
    })
    const api = payload.endPoint.endsWith('/') ? payload.endPoint + 'api/server/' + payload.id + '/action/' : payload.endPoint + '/api/server/' + payload.id + '/action/'
    const config = { action: payload.action }
    const response = await axios.post(api, config)

    // 如果删除主机，重新获取serverList
    if (payload.action === 'delete' || payload.action === 'delete_force') {
      // 状态更新应延时获取
      void await new Promise(resolve => (
        setTimeout(resolve, 3000)
      ))
      // 重新获取serverList
      const config = context.state.dataPointOnShow.key === '0' ? {} : { service_id: context.state.dataPointOnShow.key }
      void await context.dispatch('updateServerList', config)
      console.log('in deleting vm', context.state.dataPointOnShow.key)
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
  async fetchService () {
    const api = apiBase + '/service/'
    const response = await axios.get(api)
    return response
  },
  async updateDataPointTree (context) {
    const response = await context.dispatch('fetchService')
    const results: ResServiceResultInterface[] = response.data.results
    // translate response to dataPointTree
    const dataPointTree: DataRootInterface[] = [{
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
    results.forEach((resPoint: ResServiceResultInterface) => {
      dataPointTree[0].children.forEach((treeCenter) => {
        if (treeCenter.label === resPoint.data_center.name) {
          treeCenter.children.unshift({
            key: resPoint.id,
            label: resPoint.name,
            serviceType: resPoint.service_type,
            icon: 'storage'
          })
        }
      })
    })
    context.commit('storeDataPointTree', dataPointTree)
    // console.log(context.state.dataPointTree)
  },
  async fetchServerList (context, payload?: ReqServerListInterface) {
    const api = apiBase + '/server/'
    const config = {
      params: { ...payload }
    }
    const response = await axios.get(api, config)
    return response
  },
  async fetchServerStatus (context, payload: string) {
    const api = apiBase + '/server/' + payload + '/status/'
    const response = await axios.get(api)
    return response
  },
  async updateServerList (context, payload?: ReqServerListInterface) {
    const resServerList = await context.dispatch('fetchServerList', payload)
    const resServers: ResServerInterface[] = resServerList.data.servers
    // console.log(res)
    const serverList: ServerInterface[] = []
    resServers.forEach((resServer) => {
      serverList.push({
        ip: resServer.ipv4,
        // dataCenter: // todo 需求：server list响应中增加该server所在dataCenter/serviceType信息
        // serviceType:
        image: resServer.image,
        cpu: `${resServer.vcpus}核`,
        ram: `${resServer.ram}MB`,
        endPoint: resServer.endpoint_url,
        note: resServer.remarks,
        id: resServer.id,
        name: resServer.name,
        isIpPublic: resServer.public_ip,
        timeCreate: resServer.creation_time
      })
    })
    context.commit('storeServerList', serverList)
    // console.log(context.state.serverList)

    // 更新每个server的status
    for (const server of context.state.serverList) {
      const resServerStatus = await context.dispatch('fetchServerStatus', server.id)
      // console.log(resServerStatus.data.status, codeMap.get(resServerStatus.data.status.status_code))
      const payload = {
        id: server.id,
        status: codeMap.get(resServerStatus.data.status.status_code)
      }
      context.commit('storeServerStatus', payload)
      // console.log(server.status)
    }
  }
}

export default actions
