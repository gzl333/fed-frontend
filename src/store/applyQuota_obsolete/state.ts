// 配额申请接口
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
  classification: 'personal' | 'vo'
  result_desc: string // 拒绝理由

  // 来自补充
  vo_id?: string
}

// 赠送配额活动
export interface QuotaActivity {
  'id': string
  'got_count': number
  'service': string // service id
  'user': string // user id
  'creation_time': string
  'name': string
  'name_en': string
  'start_time': string
  'end_time': string
  'count': number
  'times_per_user': number
  'status': string
  'tag': string
  'cpus': number
  'private_ip': number
  'public_ip': number
  'ram': number
  'disk_size': number
  'expiration_time': string
  'duration_days': number
}

// applyQuota总接口
export interface ApplyQuotaModuleInterface {
  // eslint-disable-next-line @typescript-eslint/ban-types
  pages: {
    apply: {
      serviceId: string
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  tables: {
    // 用户自己提出的quota申请，只保存undeleted
    // userQuotaApplicationTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    // 用户自己提出的quota申请，只保存deleted，回收站用
    // userQuotaApplicationDeletedTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    // 项目组内提出的quota申请，只保存undeleted
    // groupQuotaApplicationTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    // 项目组内提出的quota申请，只保存deleted，回收站用
    // groupQuotaApplicationDeletedTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    // // 管理员有权限审批的quota申请
    // adminQuotaApplicationTable: {
    //   byId: Record<string, ApplicationQuotaInterface>
    //   allIds: string[]
    //   isLoaded: boolean
    // }

    // 赠送配额活动
    // globalQuotaActivityTable: {
    //   byId: Record<string, QuotaActivity>
    //   allIds: string[]
    //   isLoaded: boolean
    // }
  }
}

function state (): ApplyQuotaModuleInterface {
  return {
    pages: {
      apply: {
        serviceId: '0'
      }
    },
    tables: {
      // userQuotaApplicationTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // },
      // groupQuotaApplicationTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // },
      // adminQuotaApplicationTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // },
      // globalQuotaActivityTable: {
      //   byId: {},
      //   allIds: [],
      //   isLoaded: false
      // }
    }
  }
}

export default state
