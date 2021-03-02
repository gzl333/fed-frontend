import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface, UquotaResponseInterface, ProviderInterface } from './state'
import axios from 'axios'

const baseAPI = 'http://gosc.cstcloud.cn/api/'
// context.state -> store.state.quota
const actions: ActionTree<QuotaInterface, StateInterface> = {
  async fetchQuota (context) {
    // console.log('in fetchQuota')
    const response: UquotaResponseInterface = await (await axios.get(baseAPI + 'u-quota/')).data
    // console.log(response)
    const providers: ProviderInterface[] = []
    response.results.forEach((responseResult) => {
      const provider = {
        name: responseResult.service.name,
        type: responseResult.tag.display,
        privateIpTotal: responseResult.private_ip_total,
        privateIpUsed: responseResult.private_ip_used,
        publicIpTotal: responseResult.public_ip_total,
        publicIpUsed: responseResult.public_ip_used,
        vCpuTotal: responseResult.vcpu_total,
        vCpuUsed: responseResult.vcpu_used,
        ramTotal: responseResult.ram_total,
        ramUsed: responseResult.ram_used,
        diskTotal: responseResult.disk_size_total,
        diskUsed: responseResult.disk_size_used
      }
      providers.push(provider)
    })
    const payload:QuotaInterface = {
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
