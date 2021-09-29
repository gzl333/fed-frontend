// todo 保留现有的模块，改写部分写入新的模块。全部写完后再删除旧模块。

const $store = {

  /* 账户部分 */
  account: { // 当前登录账户：1.个人信息 2.组信息（只有组关系）
  },
  /* 账户部分 */

  /* 管理部分 */
  fed: { // 1.联邦层级信息 2.联邦管理功能
    // 全局datacenter
    // 全局service
    // 全局资源统计
    // 联邦监控
  },
  provider: { // 资源提供者信息，管理
  },
  /* 管理部分 */

  /* 业务部分 */
  quota: { // 当前用户的配额申请，已有配额
  },
  server: {
    // universalXxxTable
    // personalXxxTable
    // groupXxxTable
  },
  obs: {}, // 待添加
  hpc: {} // 待添加
  /* 业务部分 */

}

console.log($store)
