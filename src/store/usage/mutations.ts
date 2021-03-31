import { MutationTree } from 'vuex'
import {
  UsageInterface,
  TreeRootInterface,
  ServerInterface_old,
  // DataPointOnShowInterface,
  PaginationInterface, ReqServerNote, VpnInterface, ServiceInterface_old, DataCenterInterface, ServiceInterface
} from './state'

const mutation: MutationTree<UsageInterface> = {
  /*
  以下为重构后的数据结构
  */
  storeNote (state, payload: ReqServerNote) {
    state.allServerTable.byId[payload.id].remarks = payload.remark
  },
  storeAllServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.allServerTable.byId[payload.serverId].status = payload.status_code
  },
  storeAllServerTableFilter (state, filter: string) {
    state.allServerTable.filter = filter
  },
  clearAllServerTable (state) {
    state.allServerTable.byId = {}
    state.allServerTable.allIds = []
    state.allServerTable.isLoaded = false
    // 不清空filter值，保持serviceId的选择
  },
  storeAllServerTable (state, tableObj: Record<string, DataCenterInterface>) {
    Object.assign(state.allServerTable.byId, tableObj)
    state.allServerTable.allIds.push(Object.keys(tableObj)[0])
    state.allServerTable.allIds = [...new Set(state.allServerTable.allIds)]
    // allServerTable.isLoaded,每次都更新，可以优化
    state.allServerTable.isLoaded = true
    // console.log('updating allServerTable')
  },
  storeAllDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
    // 将dataCenter对象补充至allDataCenterTable.byId
    Object.assign(state.allDataCenterTable.byId, tableObj)
    // 更新allDataCenterTable.allIds，更新后去重
    state.allDataCenterTable.allIds.push(Object.keys(tableObj)[0])
    state.allDataCenterTable.allIds = [...new Set(state.allDataCenterTable.allIds)]
    // 更新allDataCenterTable.isLoaded,每次都更新，可以优化
    state.allDataCenterTable.isLoaded = true
    // console.log('updating allDataCenterTable')
  },
  storeUserServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    // 将service对象补充至userServiceTable.byId
    Object.assign(state.userServiceTable.byId, tableObj)
    // 更新userServiceTable.allIds，更新后去重
    state.userServiceTable.allIds.push(Object.keys(tableObj)[0])
    state.userServiceTable.allIds = [...new Set(state.userServiceTable.allIds)]
    // 更新userServiceTable.isLoaded，每次都更新，可以优化
    state.userServiceTable.isLoaded = true
    // console.log('updating userServiceTable')
  },
  /*
  以上为重构后的数据结构
  */

  deleteVpn (state, serviceId: string) {
    state.vpn.delete(serviceId)
  },
  storeVpn (state, payload: { serviceId: string; serviceName: string; vpn: VpnInterface }) {
    state.vpn.set(payload.serviceId, {
      ...payload.vpn,
      serviceId: payload.serviceId,
      serviceName: payload.serviceName
    })
  },
  // 清除当前展示的云主机详情信息
  clearServerDetail (state) {
    state.serverDetail = { id: '' }
  },
  // 保存当前展示的云主机详情信息
  storeServerDetail (state, payload: ServerInterface_old) {
    state.serverDetail = payload
    // console.log('state.serverDetail:', state.serverDetail)
  },
  storeServerDetailStatus (state, status: string) {
    state.serverDetail.status = status
  },
  storeService (state, payload: ServiceInterface_old) {
    state.serviceList.push(payload)
  },
  storeDataPointTree (state, payload: TreeRootInterface[]) {
    state.dataPointTree = payload
  },
  // storeServerList (state, payload: ServerInterface_old[]) {
  //   state.serverList = payload
  // },
  // storeServerStatus (state, payload: { id: string; status: string }) {
  //   const currentServer = state.serverList.find((server) => {
  //     return server.id === payload.id
  //   })
  //   if (currentServer) {
  //     currentServer.status = payload.status
  //   }
  // },
  // storeDataPointOnShow (state, payload: DataPointOnShowInterface) {
  //   state.dataPointOnShow = payload
  // },
  storePagination (state, payload: PaginationInterface) {
    // console.log(payload)
    for (const key in payload) {
      // @ts-ignore
      state.pagination[key] = payload[key]
    }
    // console.log('current store', state.pagination)
  }
}

export default mutation
