import { QuotaApplicationInterface, ServerInterface } from 'src/store/server/state'

export interface ProviderModuleInterface {
  data: {
    // data
  }
  tables: {
    // 管理员有权限审批的quota申请
    adminQuotaApplicationTable: {
      byId: Record<string, QuotaApplicationInterface>
      allIds: string[]
      isLoaded: boolean
    }
    // 服务管理员能看到的，当前服务下创建的所有云主机
    adminServerTable: {
      byId: Record<string, ServerInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

function state (): ProviderModuleInterface {
  return {
    data: {},
    tables: {
      adminQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      },
      adminServerTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
