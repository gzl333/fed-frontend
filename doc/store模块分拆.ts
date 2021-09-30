// todo 保留现有的模块，改写部分写入新的模块。全部写完后再删除旧模块。

const $store = {

  /* 账户部分 */
  account: { // 当前登录账户：1.个人信息 2.组信息（只有组关系）
  },
  /* 账户部分 */

  /* 管理部分 */
  fed: { // 1.联邦层级信息 2.联邦管理功能
    // 全局datacenter
    dataCenterTable: {},
    // 全局service
    serviceTable: {},
    // 资源配置
    serviceAllocationTable: {}, // 服务自主资源配置
    fedAllocationTable: {} // 联邦资源配置
    // 联邦监控
  },
  provider: { // 资源提供者信息，管理
  },
  /* 管理部分 */

  /* 业务部分 */
  quota: { // 当前用户的配额申请，已有配额
  },
  server: {
    // fedXxxTable 全部都一样的
    // serviceXxxTable 服务内一样的
    // userXxxTable 个人和组一样的
    // personalXxxTable 个人的
    // groupXxxTable 组的

    // 所有人一样的云主机配置选项
    fedFlavorTable: {},
    // 服务内通行的配置
    serviceNetworkTable: {},
    serviceImageTable: {},
    // 用户所有的vpn
    userVpnTable: {},
    // 个人云主机配额
    personalQuotaTable: {},
    // 个人云主机 todo
    personalServerTable: {},
    // 项目组云主机配额
    groupQuotaTable: {},
    // 项目组云主机 todo
    groupServerTable: {}
  },
  obs: {}, // 待添加
  hpc: {} // 待添加
  /* 业务部分 */

}

console.log($store)
