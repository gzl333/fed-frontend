import { MutationTree } from 'vuex'
import {
  UsageInterface,
  TreeRootInterface,
  ServerInterface,
  // DataPointOnShowInterface,
  PaginationInterface, ReqServerNote, VpnInterface, ServiceInterface_old, DataCenterInterface, ServiceInterface
} from './state'

const mutation: MutationTree<UsageInterface> = {
  /* 以下为重构后的数据结构 */
  storeDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
    state.allDataCenterTable.set(Object.keys(tableObj)[0], Object.values(tableObj)[0])
  },
  storeServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    state.userServiceTable.set(Object.keys(tableObj)[0], Object.values(tableObj)[0])
  },
  /* 以上为重构后的数据结构 */

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
  storeServerDetail (state, payload: ServerInterface) {
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
  storeServerList (state, payload: ServerInterface[]) {
    state.serverList = payload
  },
  storeServerStatus (state, payload: { id: string; status: string }) {
    const currentServer = state.serverList.find((server) => {
      return server.id === payload.id
    })
    if (currentServer) {
      currentServer.status = payload.status
    }
  },
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
  },
  storeNote (state, payload: ReqServerNote) {
    state.serverList.forEach((server) => {
      if (server.id && server.id === payload.id) {
        server.remarks = payload.remark
      }
    })
  }
}

export default mutation
