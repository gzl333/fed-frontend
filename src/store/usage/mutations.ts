import { MutationTree } from 'vuex'
import {
  UsageInterface,
  TreeRootInterface,
  ServerInterface_old,
  // DataPointOnShowInterface,
  PaginationInterface,
  VpnInterface_old,
  ServiceInterface_old,
  DataCenterInterface,
  ServiceInterface,
  NetworkInterface, ImageInterface, FlavorInterface, VpnInterface, UserQuotaInterface, ServerInterface
} from './state'

const mutation: MutationTree<UsageInterface> = {
  /*
  以下为重构后的数据结构
  */
  storeUserQuotaTable (state, tableObj: Record<string, UserQuotaInterface>) {
    Object.assign(state.userQuotaTable.byId, tableObj)
    state.userQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.userQuotaTable.allIds = [...new Set(state.userQuotaTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.userQuotaTable.isLoaded = true
  },
  storeUserVpnTable (state, vpn: VpnInterface) {
    Object.assign(state.userVpnTable.byId, { [vpn.id]: vpn })
    state.userVpnTable.allIds.unshift(vpn.id)
    state.userVpnTable.allIds = [...new Set(state.userVpnTable.allIds)]
    state.userVpnTable.isLoaded = true
  },
  storeGlobalFlavorTable (state, flavor: FlavorInterface) {
    Object.assign(state.globalFlavorTable.byId, { [flavor.id]: flavor })
    state.globalFlavorTable.allIds.unshift(flavor.id)
    state.globalFlavorTable.allIds = [...new Set(state.globalFlavorTable.allIds)]
    state.globalFlavorTable.isLoaded = true
  },
  storeUserImageTable (state, image: ImageInterface) {
    // 存进allImageTable
    Object.assign(state.userImageTable.byLocalId, { [image.localId]: image })
    state.userImageTable.allLocalIds.unshift(image.localId)
    state.userImageTable.allLocalIds = [...new Set(state.userImageTable.allLocalIds)]
    state.userImageTable.isLoaded = true
  },
  storeUserNetworkTable (state, network: NetworkInterface) {
    // 存进allNetworkTable
    Object.assign(state.userNetworkTable.byLocalId, { [network.localId]: network })
    state.userNetworkTable.allLocalIds.unshift(network.localId)
    state.userNetworkTable.allLocalIds = [...new Set(state.userNetworkTable.allLocalIds)]
    state.userNetworkTable.isLoaded = true
  },
  storeNote (state, payload: { id: string; remark: string; }) {
    state.userServerTable.byId[payload.id].remarks = payload.remark
  },
  storeUserServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.userServerTable.byId[payload.serverId].status = payload.status_code
  },
  storeUserServerTableFilter (state, filter: string) {
    state.userServerTable.filter = filter
  },
  clearUserServerTable (state) {
    state.userServerTable.byId = {}
    state.userServerTable.allIds = []
    state.userServerTable.isLoaded = false
    // 不清空filter值，保持serviceId的选择
  },
  storeUserServerTable (state, tableObj: Record<string, ServerInterface>) {
    Object.assign(state.userServerTable.byId, tableObj)
    state.userServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.userServerTable.allIds = [...new Set(state.userServerTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.userServerTable.isLoaded = true
    // console.log('updating userServerTable')
  },
  storeGlobalDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
    // 将dataCenter对象补充至globalDataCenterTable.byId
    Object.assign(state.globalDataCenterTable.byId, tableObj)
    // 更新globalDataCenterTable.allIds，更新后去重
    state.globalDataCenterTable.allIds.unshift(Object.keys(tableObj)[0])
    state.globalDataCenterTable.allIds = [...new Set(state.globalDataCenterTable.allIds)]
    // 更新globalDataCenterTable.isLoaded,每次都更新，可以优化
    state.globalDataCenterTable.isLoaded = true
    // console.log('updating globalDataCenterTable')
  },
  storeUserServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    // 将service对象补充至userServiceTable.byId
    Object.assign(state.userServiceTable.byId, tableObj)
    // 更新userServiceTable.allIds，更新后去重
    state.userServiceTable.allIds.unshift(Object.keys(tableObj)[0])
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
  storeVpn (state, payload: { serviceId: string; serviceName: string; vpn: VpnInterface_old }) {
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
    state.serviceList.unshift(payload)
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
