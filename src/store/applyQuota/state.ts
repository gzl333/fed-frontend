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
    applicationList: {
      filter: string
    }
    manage: { filter: string }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  tables: {
    // 用户自己提出的quota申请，只保存undeleted
    userQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 用户自己提出的quota申请，只保存deleted，回收站用
    // userQuotaApplicationDeletedTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
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
      applicationList: {
        filter: '0'
      },
      manage: { filter: '0' }
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
