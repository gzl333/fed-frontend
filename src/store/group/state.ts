// 自定义类型
// 组配额接口
export interface GroupQuotaInterface {
  id: string
  tag: { // 提出去单做table无用，暂时保留不拍平
    value: number
    display: string
  },
  user: string // user id
  service: string // service id
  private_ip_total: number
  private_ip_used: number
  public_ip_total: number
  public_ip_used: number
  vcpu_total: number
  vcpu_used: number
  ram_total: number
  ram_used: number
  disk_size_total: number
  disk_size_used: number
  expiration_time: string
  deleted: boolean
  display: string
  duration_days: number
  classification: 'vo' | 'personal' // 配额类型，二选一

  // 以下字段来自自己补充
  group: string // 所属group id
}

// group模块的总体类型
export interface GroupInterface {
  pages: { // 各个页面所需vuex数据
  }
  tables: { // 扁平的data table
    // 用户可用的group quota
    userGroupQuotaTable: {
      byId: Record<string, GroupQuotaInterface>
      allIds: string[]
      isLoaded: boolean
    }
  }
}

// group模块初始值
function state (): GroupInterface {
  return {
    pages: {},
    tables: {
      userGroupQuotaTable: {
        byId: {},
        allIds: [],
        isLoaded: false
      }
    }
  }
}

export default state
