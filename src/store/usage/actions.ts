import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UsageInterface, DataRootInterface, ApiServiceResResultInterface, ApiServerListReqInterface } from './state'
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
    const results: ApiServiceResResultInterface[] = response.data.results
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
          key: resPoint.data_center.name, // 因为datacenter和datapoint的key都是数值，这里避免与datapointkey重复
          label: resPoint.data_center.name,
          selectable: false,
          children: []
        })
      }
    })
    // second iteration to add dataPoints to dataCenters
    results.forEach((resPoint: ApiServiceResResultInterface) => {
      dataPointTree[0].children.forEach((treeCenter) => {
        if (treeCenter.label === resPoint.data_center.name) {
          treeCenter.children.unshift({
            key: resPoint.id,
            label: resPoint.name,
            icon: 'storage'
          })
        }
      })
    })
    context.commit('storeDataPointTree', dataPointTree)
    // console.log(context.state.dataPointTree)
  },
  async fetchServerList (context, payload:ApiServerListReqInterface) {
    const api = apiBase + '/server/'
    const config = {
      params: { ...payload }
    }
    const response = await axios.get(api, config)
    console.log(response)
  },
  async fetchMultiServerList (context, payload) {
    // 多个
  }
}

export default actions
