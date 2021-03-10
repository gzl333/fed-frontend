import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderInterface, QuotaInterface, TypeInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  serviceName (state) {
    const serviceName: {name: string; number: string}[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const name = item.name
        const num = item.serviceTypes.length.toString()
        let flag = true
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) { // 包含没有deleted的机构，均展示配额
            flag = true
          } else {
            flag = false
          }
        })
        if (flag === true) {
          const service = {
            name: name,
            number: num
          }
          serviceName.push(service)
        }
      })
    }
    return serviceName
  },
  servicetype (state) {
    const serviceType: ProviderInterface[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const name = item.name
        const arrType: TypeInterface[] = []
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const time = it.expirationTime as string
            let timeJoin = ''
            if (time != null) {
              const time1 = time.slice(0, 10)
              const time2 = time.slice(11, 19)
              timeJoin = time1 + ' ' + time2
            } else {
              timeJoin = it.expirationTime as string
            }
            const type:TypeInterface = {
              type: it.type, // 配额类型
              privateIpTotal: it.privateIpTotal,
              privateIpUsed: it.privateIpUsed,
              publicIpTotal: it.publicIpTotal,
              publicIpUsed: it.publicIpUsed,
              vCpuTotal: it.vCpuTotal,
              vCpuUsed: it.vCpuUsed,
              ramTotal: it.ramTotal,
              ramUsed: it.ramUsed,
              diskTotal: it.diskTotal,
              diskUsed: it.diskUsed,
              expirationTime: timeJoin,
              deleted: it.deleted
            }
            arrType.push(type)
          }
        })
        const temp:ProviderInterface = {
          name: name,
          serviceTypes: arrType
        }
        serviceType.push(temp)
      })
    }
    return serviceType
  },
  toptab (state) {
    // console.log('in toptab getter')
    if (state.userQuota.providers) {
      // console.log('in getter if', state.userQuota.providers)
      // console.log('name:', state.userQuota.providers[0].name)
      return state.userQuota.providers[0].name
    }
  }
}

export default getters
