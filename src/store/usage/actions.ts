import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { UsageInterface, DataCenterInterface, ApiServiceResResultInterface } from './state'
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
    // console.log(response)
    const results: ApiServiceResResultInterface[] = response.data.results
    // translate response to dataPointTree
    const dataPointTree: DataCenterInterface[] = []
    // first iteration to build dataCenters
    results.forEach((apiDataPoint: ApiServiceResResultInterface) => {
      // console.log('in first iteration')
      let hasCenter = false
      dataPointTree.forEach((treeDataCenter) => {
        if (treeDataCenter.name === apiDataPoint.data_center.name) {
          hasCenter = true
        }
      })
      if (!hasCenter) {
        dataPointTree.push({
          id: apiDataPoint.data_center.name,
          name: apiDataPoint.data_center.name,
          dataPoints: []
        })
      }
    })
    // console.log(dataPointTree)
    // second iteration to add dataPoints to dataCenters
    results.forEach((apiDataPoint: ApiServiceResResultInterface) => {
      // console.log('in second iteration')
      dataPointTree.forEach((treeDataCenter) => {
        if (treeDataCenter.name === apiDataPoint.data_center.name) {
          treeDataCenter.dataPoints.push({
            id: apiDataPoint.id,
            name: apiDataPoint.name
          })
        }
      })
    })
    context.commit('storeDataPointTree', dataPointTree)
    console.log(context.state.dataPointTree)
  }
}

export default actions
