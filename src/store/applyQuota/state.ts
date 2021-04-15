export interface ApplicationQuotaInterface {
  private_ip: number
  public_ip: number
  vcpu: number
  ram: number
  disk_size: number
  duration_days: number
  company: string
  contact: string
  purpose: string
  id: string
  creation_time: string
  status: string
  service: string
  deleted: boolean
}

// applyQuota总接口
export interface ApplyQuotaInterface {
  // eslint-disable-next-line @typescript-eslint/ban-types
  pages: {
    quotaList: { filter: string }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  tables: {
    // 用户自己提出的quota申请
    userQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 管理员有权限审批的quota申请
    adminQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

function state (): ApplyQuotaInterface {
  return {
    pages: {
      quotaList: { filter: '0' }
    },
    tables: {
      userQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      adminQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
