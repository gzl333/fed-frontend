import { ApplicationQuotaInterface } from 'src/store/server/state'

export interface ProviderModuleInterface {
  tables: {
    // 管理员有权限审批的quota申请
    adminQuotaApplicationTable: {
      byId: Record<string, ApplicationQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

function state (): ProviderModuleInterface {
  return {
    tables: {
      adminQuotaApplicationTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
