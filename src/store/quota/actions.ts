import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface, UquotaResponseInterface, ServiceInterface, TypeInterface } from './state'
import axios from 'axios'

const baseAPI = 'http://gosc.cstcloud.cn/api/'
// context.state -> store.state.quota
const actions: ActionTree<QuotaInterface, StateInterface> = {
  // eslint-disable-next-line camelcase
  async fetchQuota (/* context, page?:number, page_size?:number */) {
    const response = await axios.get(baseAPI + 'u-quota/')
    return response
  },
  async updateQuota (context) {
    // console.log('in fetchQuota')
    const response: UquotaResponseInterface = (await context.dispatch('fetchQuota')).data
    // console.log(response)
    const servicesTemp: ServiceInterface[] = []

    response.results.forEach((responseResult) => {
      const serviceTypes: TypeInterface[] = []
      response.results.forEach((item) => {
        if (item.service.name === responseResult.service.name) {
          const type = {
            type: item.tag.display,
            id: item.id,
            privateIpTotal: item.private_ip_total,
            privateIpUsed: item.private_ip_used,
            publicIpTotal: item.public_ip_total,
            publicIpUsed: item.public_ip_used,
            vCpuTotal: item.vcpu_total,
            vCpuUsed: item.vcpu_used,
            ramTotal: item.ram_total,
            ramUsed: item.ram_used,
            diskTotal: item.disk_size_total,
            diskUsed: item.disk_size_used,
            expirationTime: item.expiration_time,
            deleted: item.deleted
          }
          serviceTypes.push(type)
        }
      })
      const service = {
        name: responseResult.service.name,
        id: responseResult.service.id,
        serviceTypes: serviceTypes
      }
      servicesTemp.push(service)
    })

    // servicesTemp:按照service去重
    const res = new Map()
    const services = servicesTemp.filter((servicesTemp) => !res.has(servicesTemp.name) && res.set(servicesTemp.name, 1))

    const payload: QuotaInterface = {
      userQuota: {
        userEmail: response.results[0].user.username,
        services: services
      }
    }
    // console.log('before storeQuota', payload)
    context.commit('storeQuota', payload)
    // console.log('back in fetch', context.state)
  }
}

export default actions
