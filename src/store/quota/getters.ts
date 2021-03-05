import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  serviceName (state) {
    const serviceName: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const name = item.name
          serviceName.push(name)
        }
      })
    }
    return serviceName
  },
  servicetype (state) {
    const serviceType: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const type = item.type
          serviceType.push(type)
        }
      })
    }
    return serviceType
  },
  vCpuUsed (state) {
    const vCpuUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Used = item.vCpuUsed
          vCpuUsed.push(Used)
        }
      })
    }
    return vCpuUsed
  },
  vCpuTotal (state) {
    const vCpuTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Total = item.vCpuTotal
          vCpuTotal.push(Total)
        }
      })
    }
    return vCpuTotal
  },
  vCpuPercentage (state) {
    const vCpuPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.vCpuUsed / item.vCpuTotal
          vCpuPercentage.push(Percentage)
        }
      })
    }
    return vCpuPercentage
  },
  vCpuLabel (state) {
    const vCpuLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.vCpuUsed / item.vCpuTotal
          const label = (Percentage * 100).toFixed(2)
          vCpuLabel.push(label)
        }
      })
    }
    return vCpuLabel
  },
  ramUsed (state) {
    const ramUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Used = item.ramUsed
          ramUsed.push(Used)
        }
      })
    }
    return ramUsed
  },
  ramTotal (state) {
    const ramTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Total = item.ramTotal
          ramTotal.push(Total)
        }
      })
    }
    return ramTotal
  },
  ramPercentage (state) {
    const ramPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.ramUsed / item.ramTotal
          ramPercentage.push(Percentage)
        }
      })
    }
    return ramPercentage
  },
  ramLabel (state) {
    const ramLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.ramUsed / item.ramTotal
          const label = (Percentage * 100).toFixed(2)
          ramLabel.push(label)
        }
      })
    }
    return ramLabel
  },
  diskUsed (state) {
    const diskUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Used = item.diskUsed
          diskUsed.push(Used)
        }
      })
    }
    return diskUsed
  },
  diskTotal (state) {
    const diskTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Total = item.diskTotal
          diskTotal.push(Total)
        }
      })
    }
    return diskTotal
  },
  diskPercentage (state) {
    const diskPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.diskUsed / item.diskTotal
          diskPercentage.push(Percentage)
        }
      })
    }
    return diskPercentage
  },
  diskLabel (state) {
    const diskLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.diskUsed / item.diskTotal
          const label = (Percentage * 100).toFixed(2)
          diskLabel.push(label)
        }
      })
    }
    return diskLabel
  },
  publicIpUsed (state) {
    const publicIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Used = item.publicIpUsed
          publicIpUsed.push(Used)
        }
      })
    }
    return publicIpUsed
  },
  publicIpTotal (state) {
    const publicIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Total = item.publicIpTotal
          publicIpTotal.push(Total)
        }
      })
    }
    return publicIpTotal
  },
  publicIpPercentage (state) {
    const publicIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.publicIpUsed / item.publicIpTotal
          publicIpPercentage.push(Percentage)
        }
      })
    }
    return publicIpPercentage
  },
  publicIpLabel (state) {
    const publicIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.publicIpUsed / item.publicIpTotal
          const label = (Percentage * 100).toFixed(2)
          publicIpLabel.push(label)
        }
      })
    }
    return publicIpLabel
  },
  privateIpUsed (state) {
    const privateIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Used = item.privateIpUsed
          privateIpUsed.push(Used)
        }
      })
    }
    return privateIpUsed
  },
  privateIpTotal (state) {
    const privateIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Total = item.privateIpTotal
          privateIpTotal.push(Total)
        }
      })
    }
    return privateIpTotal
  },
  privateIpPercentage (state) {
    const privateIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.privateIpUsed / item.privateIpTotal
          privateIpPercentage.push(Percentage)
        }
      })
    }
    return privateIpPercentage
  },
  privateIpLabel (state) {
    const privateIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const Percentage = item.privateIpUsed / item.privateIpTotal
          const label = (Percentage * 100).toFixed(2)
          privateIpLabel.push(label)
        }
      })
    }
    return privateIpLabel
  },
  expirationTime (state) {
    const expirationTime: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        if (item.deleted === false) {
          const time = item.expirationTime as string
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
    }
    // console.log('in getters expirationTime :', expirationTime)
    return expirationTime
  }
}

export default getters
