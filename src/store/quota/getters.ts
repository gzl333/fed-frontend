import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { QuotaInterface } from './state'

const getters: GetterTree<QuotaInterface, StateInterface> = {
  centerName (state) {
    const centername: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const name = item.name
        centername.push(name)
      })
    }
    return centername
  },
  centertype (state) {
    const centertype: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const type = item.type
        centertype.push(type)
      })
    }
    return centertype
  },
  vCpuUsed (state) {
    const vCpuUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Used = item.vCpuUsed
        vCpuUsed.push(Used)
      })
    }
    return vCpuUsed
  },
  vCpuTotal (state) {
    const vCpuTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Total = item.vCpuTotal
        vCpuTotal.push(Total)
      })
    }
    return vCpuTotal
  },
  vCpuPercentage (state) {
    const vCpuPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.vCpuUsed / item.vCpuTotal
        vCpuPercentage.push(Percentage)
      })
    }
    return vCpuPercentage
  },
  vCpuLabel (state) {
    const vCpuLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.vCpuUsed / item.vCpuTotal
        const label = (Percentage * 100).toFixed(2)
        vCpuLabel.push(label)
      })
    }
    return vCpuLabel
  },
  ramUsed (state) {
    const ramUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Used = item.ramUsed
        ramUsed.push(Used)
      })
    }
    return ramUsed
  },
  ramTotal (state) {
    const ramTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Total = item.ramTotal
        ramTotal.push(Total)
      })
    }
    return ramTotal
  },
  ramPercentage (state) {
    const ramPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.ramUsed / item.ramTotal
        ramPercentage.push(Percentage)
      })
    }
    return ramPercentage
  },
  ramLabel (state) {
    const ramLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.ramUsed / item.ramTotal
        const label = (Percentage * 100).toFixed(2)
        ramLabel.push(label)
      })
    }
    return ramLabel
  },
  diskUsed (state) {
    const diskUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Used = item.diskUsed
        diskUsed.push(Used)
      })
    }
    return diskUsed
  },
  diskTotal (state) {
    const diskTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Total = item.diskTotal
        diskTotal.push(Total)
      })
    }
    return diskTotal
  },
  diskPercentage (state) {
    const diskPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.diskUsed / item.diskTotal
        diskPercentage.push(Percentage)
      })
    }
    return diskPercentage
  },
  diskLabel (state) {
    const diskLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.diskUsed / item.diskTotal
        const label = (Percentage * 100).toFixed(2)
        diskLabel.push(label)
      })
    }
    return diskLabel
  },
  publicIpUsed (state) {
    const publicIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Used = item.publicIpUsed
        publicIpUsed.push(Used)
      })
    }
    return publicIpUsed
  },
  publicIpTotal (state) {
    const publicIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Total = item.publicIpTotal
        publicIpTotal.push(Total)
      })
    }
    return publicIpTotal
  },
  publicIpPercentage (state) {
    const publicIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.publicIpUsed / item.publicIpTotal
        publicIpPercentage.push(Percentage)
      })
    }
    return publicIpPercentage
  },
  publicIpLabel (state) {
    const publicIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.publicIpUsed / item.publicIpTotal
        const label = (Percentage * 100).toFixed(2)
        publicIpLabel.push(label)
      })
    }
    return publicIpLabel
  },
  privateIpUsed (state) {
    const privateIpUsed: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Used = item.privateIpUsed
        privateIpUsed.push(Used)
      })
    }
    return privateIpUsed
  },
  privateIpTotal (state) {
    const privateIpTotal: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Total = item.privateIpTotal
        privateIpTotal.push(Total)
      })
    }
    return privateIpTotal
  },
  privateIpPercentage (state) {
    const privateIpPercentage: number[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.privateIpUsed / item.privateIpTotal
        privateIpPercentage.push(Percentage)
      })
    }
    return privateIpPercentage
  },
  privateIpLabel (state) {
    const privateIpLabel: string[] = []
    if (state.userQuota.providers) {
      state.userQuota.providers.forEach((item) => {
        const Percentage = item.privateIpUsed / item.privateIpTotal
        const label = (Percentage * 100).toFixed(2)
        privateIpLabel.push(label)
      })
    }
    return privateIpLabel
  }
}

export default getters
