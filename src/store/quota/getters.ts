import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  serviceName (state) {
    const serviceName: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const name = item.name
        let flag = true
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) { // 包含没有deleted的机构，均展示配额
            flag = true
          } else {
            flag = false
          }
        })
        if (flag === true) {
          serviceName.push(name)
        }
      })
    }
    return serviceName
  },
  servicetype (state) {
    const serviceType: any[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const name = item.name
        const arrType: any[] = []
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const type = {
              name: name,
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
              expirationTime: it.expirationTime,
              deleted: it.deleted
            }
            arrType.push(type)
          }
        })
        serviceType.push(arrType)
      })
    }
    console.log('in getters serviceType:', serviceType)
    return serviceType
  },
  vCpuUsed (state) {
    const vCpuUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Used = it.vCpuUsed
            vCpuUsed.push(Used)
          }
        })
      })
    }
    return vCpuUsed
  },
  vCpuTotal (state) {
    const vCpuTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Total = it.vCpuTotal
            vCpuTotal.push(Total)
          }
        })
      })
    }
    return vCpuTotal
  },
  vCpuPercentage (state) {
    const vCpuPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.vCpuUsed / it.vCpuTotal
            vCpuPercentage.push(Percentage)
          }
        })
      })
    }
    return vCpuPercentage
  },
  vCpuLabel (state) {
    const vCpuLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.vCpuUsed / it.vCpuTotal
            const label = (Percentage * 100).toFixed(2)
            vCpuLabel.push(label)
          }
        })
      })
    }
    return vCpuLabel
  },
  ramUsed (state) {
    const ramUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Used = it.ramUsed
            ramUsed.push(Used)
          }
        })
      })
    }
    return ramUsed
  },
  ramTotal (state) {
    const ramTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Total = it.ramTotal
            ramTotal.push(Total)
          }
        })
      })
    }
    return ramTotal
  },
  ramPercentage (state) {
    const ramPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.ramUsed / it.ramTotal
            ramPercentage.push(Percentage)
          }
        })
      })
    }
    return ramPercentage
  },
  ramLabel (state) {
    const ramLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.ramUsed / it.ramTotal
            const label = (Percentage * 100).toFixed(2)
            ramLabel.push(label)
          }
        })
      })
    }
    return ramLabel
  },
  diskUsed (state) {
    const diskUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Used = it.diskUsed
            diskUsed.push(Used)
          }
        })
      })
    }
    return diskUsed
  },
  diskTotal (state) {
    const diskTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Total = it.diskTotal
            diskTotal.push(Total)
          }
        })
      })
    }
    return diskTotal
  },
  diskPercentage (state) {
    const diskPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.diskUsed / it.diskTotal
            diskPercentage.push(Percentage)
          }
        })
      })
    }
    return diskPercentage
  },
  diskLabel (state) {
    const diskLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.diskUsed / it.diskTotal
            const label = (Percentage * 100).toFixed(2)
            diskLabel.push(label)
          }
        })
      })
    }
    return diskLabel
  },
  publicIpUsed (state) {
    const publicIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Used = it.publicIpUsed
            publicIpUsed.push(Used)
          }
        })
      })
    }
    return publicIpUsed
  },
  publicIpTotal (state) {
    const publicIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Total = it.publicIpTotal
            publicIpTotal.push(Total)
          }
        })
      })
    }
    return publicIpTotal
  },
  publicIpPercentage (state) {
    const publicIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.publicIpUsed / it.publicIpTotal
            publicIpPercentage.push(Percentage)
          }
        })
      })
    }
    return publicIpPercentage
  },
  publicIpLabel (state) {
    const publicIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.publicIpUsed / it.publicIpTotal
            const label = (Percentage * 100).toFixed(2)
            publicIpLabel.push(label)
          }
        })
      })
    }
    return publicIpLabel
  },
  privateIpUsed (state) {
    const privateIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Used = it.privateIpUsed
            privateIpUsed.push(Used)
          }
        })
      })
    }
    return privateIpUsed
  },
  privateIpTotal (state) {
    const privateIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Total = it.privateIpTotal
            privateIpTotal.push(Total)
          }
        })
      })
    }
    return privateIpTotal
  },
  privateIpPercentage (state) {
    const privateIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.privateIpUsed / it.privateIpTotal
            privateIpPercentage.push(Percentage)
          }
        })
      })
    }
    return privateIpPercentage
  },
  privateIpLabel (state) {
    const privateIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const Percentage = it.privateIpUsed / it.privateIpTotal
            const label = (Percentage * 100).toFixed(2)
            privateIpLabel.push(label)
          }
        })
      })
    }
    return privateIpLabel
  },
  expirationTime (state) {
    const expirationTime: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        item.serviceTypes.forEach((it) => {
          if (it.deleted === false) {
            const time = it.expirationTime as string
            if (time != null) {
              const time1 = time.slice(0, 10)
              const time2 = time.slice(11, 19)
              // console.log('in getters time:', time)
              const timeJoin = time1 + ' ' + time2
              // console.log('in getters timeJoin :', timeJoin)
              expirationTime.push(timeJoin)
            } else {
              expirationTime.push(time)
            }
          }
        })
      })
    }
    // console.log('in getters expirationTime :', expirationTime)
    return expirationTime
  }
}

export default getters
