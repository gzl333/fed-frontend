import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ServiceInterface, QuotaInterface, TypeInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  serviceName (state) {
    const serviceName: {name: string; number: number}[] = []
    if (state.userQuota.services) {
      state.userQuota.services.forEach((item) => {
        const name = item.name
        let num = 0
        let flag = true
        if (item.serviceTypes.length !== 0) {
          // 没有deleted的配额 && 且机构下的配额没有过期
          item.serviceTypes.forEach((it) => {
            if (it.deleted === false) {
              // 未过期 && 或者没有时间限制的配额
              if ((new Date(it.expirationTime).getTime() > new Date().getTime()) || it.expirationTime === null) {
                num += 1
              }
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
        }
      })
    }
    // console.log('in getter serviceName:', serviceName)
    return serviceName
  },
  servicetype (state) {
    const serviceType: ServiceInterface[] = []
    if (state.userQuota.services) {
      state.userQuota.services.forEach((item) => {
        const arrType: TypeInterface[] = []
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            // 未过期 && 或者没有时间限制的配额
            if ((new Date(it.expirationTime).getTime() > new Date().getTime()) || it.expirationTime === null) {
              const time = it.expirationTime
              let timeJoin = ''
              if (time != null) {
                const time1 = time.slice(0, 10)
                const time2 = time.slice(11, 19)
                timeJoin = time1 + ' ' + time2
              } else {
                timeJoin = it.expirationTime
              }
              const type:TypeInterface = {
                type: it.type, // 配额类型
                id: it.id,
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
                deleted: it.deleted,
                display: it.display
              }
              arrType.push(type)
            }
          }
        })
        const temp:ServiceInterface = {
          name: item.name,
          id: item.id,
          serviceTypes: arrType
        }
        serviceType.push(temp)
      })
    }
    // console.log('in getter serviceType:', serviceType)
    return serviceType
  },
  toptab (state) {
    // console.log('in toptab getter')
    if (state.userQuota.services) {
      // console.log('in getter if', state.userQuota.providers)
      // console.log('name:', state.userQuota.providers[0].name)
      return state.userQuota.services[0].name
    }
  },
  lessOneWeek (state) {
    let lessOneWeekNum = 0
    let quotaName = ''
    const lessOneWeek : {quotaName:string;lessOneWeekNum:number}[] = []
    if (state.userQuota.services) {
      let index = 1
      state.userQuota.services.forEach((item) => {
        let name = ''
        let flag = true
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) { // 没有deleted的配额
            flag = true
          } else {
            flag = false
          }
          if (flag === true) {
            // 未过期
            if (it.expirationTime && (new Date(it.expirationTime).getTime() > new Date().getTime())) {
              const diff = Math.abs(new Date(it.expirationTime).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
              const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
              // console.log('in getter days:', it.type, '+', it.expirationTime, '+', days)
              if (days > 0 && days <= 7) {
                lessOneWeekNum += 1
                name = `${index}、${item.name}：${it.type}。`
              }
            }
          }
        })
        index += 1
        quotaName += name
      })
      const quotaWarning = {
        quotaName: quotaName,
        lessOneWeekNum: lessOneWeekNum
      }
      lessOneWeek.push(quotaWarning)
      // console.log('in getters lessOneWeek:', lessOneWeek)
      return lessOneWeek
    }
  },
  lessOneMonth (state) {
    let lessOneMonthNum = 0
    let quotaName = ''
    const lessOneMonth : {quotaName:string;lessOneMonthNum:number}[] = []
    if (state.userQuota.services) {
      let index = 1
      state.userQuota.services.forEach((item) => {
        let name = ''
        let flag = true
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) { // 没有deleted的配额
            flag = true
          } else {
            flag = false
          }
          if (flag === true) {
            // 未过期
            if (it.expirationTime && (new Date(it.expirationTime).getTime() > new Date().getTime())) {
              const diff = Math.abs(new Date(it.expirationTime).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
              const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
              if (days <= 30 && days > 7) {
                lessOneMonthNum += 1
                name = `${index}、${item.name}：${it.type}。`
              }
            }
          }
        })
        index += 1
        quotaName += name
      })
      const quotaWarning = {
        quotaName: quotaName,
        lessOneMonthNum: lessOneMonthNum
      }
      lessOneMonth.push(quotaWarning)
      // console.log('in getters lessOneMonth:', lessOneMonth)
      return lessOneMonth
    }
  }
}

export default getters
