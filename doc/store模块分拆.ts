
const $store = {
  /* 账户部分 */
  account: { // 当前登录账户：1.个人信息 2.组信息（只有组关系）
    groupTable: {}, // 用户的项目组关系与信息
    groupMemberTable: {} // 各个项目组的人员信息
  },
  /* 账户部分 */

  /* 管理部分 */
  fed: { // 1.联邦层级信息 2.联邦管理功能
    dataCenterTable: {}, // 全局datacenter
    serviceTable: {}, // 全局service
    // 资源配置
    serviceAllocationTable: {}, // 服务自主资源配置
    fedAllocationTable: {} // 联邦资源配置
    // 联邦监控
  },
  provider: { // 资源提供者信息，管理
    adminQuotaApplicationTable: {}, // 服务管理员有权限审批的quota申请
    adminServerTable: {} // 服务管理员能看到的，当前服务下创建的所有虚拟机
  },
  /* 管理部分 */

  /* 业务部分 */
  quota: { // 待添加 当前用户的配额申请，已有配额。是否添加取决于quota是跨业务的，还是各自业务独立的
  },
  server: {
    // fedXxxTable 全联邦通用的的
    // serviceXxxTable 服务内一样的
    // userXxxTable 个人和组一样的
    // personalXxxTable 个人的
    // groupXxxTable 组的

    fedFlavorTable: {}, // 联邦统一的云主机配置选项
    fedQuotaActivityTable: {}, // 联邦配额赠送活动

    serviceNetworkTable: {}, // 服务内通行的配置
    serviceImageTable: {},

    userVpnTable: {}, // 用户所有的vpn

    personalQuotaApplicationTable: {}, // 个人云主机配额申请
    personalQuotaTable: {}, // 个人云主机配额
    personalServerTable: {}, // 个人云主机

    groupQuotaApplicationTable: {}, // 项目组云主机配额申请
    groupQuotaTable: {}, // 项目组云主机配额
    groupServerTable: {} // 项目组云主机
  },
  obs: {}, // 待添加
  hpc: {} // 待添加
  /* 业务部分 */
}

console.log($store)
