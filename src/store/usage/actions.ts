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

const actions: ActionTree<UsageInterface, StateInterface> = {
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
        cpu: resServer.vcpus,
        ram: resServer.ram,
        endPoint: resServer.endpoint_url,
        note: resServer.remarks,
        id: resServer.id,
        name: resServer.name,
        isIpPublic: resServer.public_ip,
        timeCreate: resServer.creation_time
      })
    })
    context.commit('storeServerList', serverList)
    console.log(context.state.serverList)

    // 更新每个server的status
    for (const server of context.state.serverList) {
      const resServerStatus = await context.dispatch('fetchServerStatus', server.id)
      // console.log(resServerStatus.data.status)
      const codeMap = new Map<number, string>(
        [
          [1, 'one'],
          [2, 'two'],
          [3, 'three'],
          [4, 'four'],
          [5, 'five'],
          [6, 'six']
        ]
      )
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
