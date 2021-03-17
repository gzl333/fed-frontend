import { MutationTree } from 'vuex'
import {
  UsageInterface,
  DataRootInterface,
  ServerInterface,
  // DataPointOnShowInterface,
  PaginationInterface, ReqServerNote, ServiceInterface, ServerDetailInterface, VpnInterface
} from './state'

const mutation: MutationTree<UsageInterface> = {
  storeVpn (state, payload: { serviceId: string, vpn: VpnInterface }) {
    state.vpn.set(payload.serviceId, payload.vpn)
  },
  // 清除当前展示的云主机详情信息
  clearServerDetail (state) {
    state.serverDetail = { id: '' }
  },
  // 保存当前展示的云主机详情信息
  storeServerDetail (state, payload: ServerDetailInterface) {
    state.serverDetail = payload
  },
  storeService (state, payload: ServiceInterface) {
    state.serviceList.push(payload)
  },
  storeDataPointTree (state, payload: DataRootInterface[]) {
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
    for (const key in payload) {
      // @ts-ignore
      state.pagination[key] = payload[key]
    }
    // console.log('current store', state.pagination)
  },
  storeNote (state, payload: ReqServerNote) {
    state.serverList.forEach((server) => {
      if (server.id && server.id === payload.id) {
        server.note = payload.remark
      }
    })
  }
}

export default mutation
