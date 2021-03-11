import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface, UquotaResponseInterface, ProviderInterface, TypeInterface } from './state'
import axios from 'axios'

const baseAPI = 'http://gosc.cstcloud.cn/api/'
// context.state -> store.state.quota
const actions: ActionTree<QuotaInterface, StateInterface> = {
  async fetchQuota () {
    const response = await axios.get(baseAPI + 'u-quota/')
    return response
  },
  async updateQuota (context) {
    // console.log('in fetchQuota')
    const response: UquotaResponseInterface = (await context.dispatch('fetchQuota')).data
    // console.log(response)
    const providersTemp: ProviderInterface[] = []

    response.results.forEach((responseResult) => {
      const serviceTypes: TypeInterface[] = []
      response.results.forEach((item) => {
        if (item.service.name === responseResult.service.name) {
          const type = {
            type: item.tag.display,
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
      const provider = {
        name: responseResult.service.name,
        serviceTypes: serviceTypes
      }
      providersTemp.push(provider)
    })

    // providersTemp:按照机构去重
    const res = new Map()
    const providers = providersTemp.filter((providersTemp) => !res.has(providersTemp.name) && res.set(providersTemp.name, 1))

    const payload: QuotaInterface = {
      userQuota: {
        userEmail: response.results[0].user.username,
        providers: providers
      }
    }
    // console.log('before storeQuota', payload)
    context.commit('storeQuota', payload)
    // console.log('back in fetch', context.state)
  }
}

export default actions
