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
    Object.assign(state.tables.userQuotaTable.byId, tableObj)
    state.tables.userQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userQuotaTable.allIds = [...new Set(state.tables.userQuotaTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.tables.userQuotaTable.isLoaded = true
  },
  storeUserVpnTable (state, vpn: VpnInterface) {
    Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
    state.tables.userVpnTable.allIds.unshift(vpn.id)
    state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
    state.tables.userVpnTable.isLoaded = true
  },
  storeGlobalFlavorTable (state, flavor: FlavorInterface) {
    Object.assign(state.tables.globalFlavorTable.byId, { [flavor.id]: flavor })
    state.tables.globalFlavorTable.allIds.unshift(flavor.id)
    state.tables.globalFlavorTable.allIds = [...new Set(state.tables.globalFlavorTable.allIds)]
    state.tables.globalFlavorTable.isLoaded = true
  },
  storeUserImageTable (state, image: ImageInterface) {
    // 存进allImageTable
    Object.assign(state.tables.userImageTable.byLocalId, { [image.localId]: image })
    state.tables.userImageTable.allLocalIds.unshift(image.localId)
    state.tables.userImageTable.allLocalIds = [...new Set(state.tables.userImageTable.allLocalIds)]
    state.tables.userImageTable.isLoaded = true
  },
  storeUserNetworkTable (state, network: NetworkInterface) {
    // 存进allNetworkTable
    Object.assign(state.tables.userNetworkTable.byLocalId, { [network.localId]: network })
    state.tables.userNetworkTable.allLocalIds.unshift(network.localId)
    state.tables.userNetworkTable.allLocalIds = [...new Set(state.tables.userNetworkTable.allLocalIds)]
    state.tables.userNetworkTable.isLoaded = true
  },
  storeNote (state, payload: { id: string; remark: string; }) {
    state.tables.userServerTable.byId[payload.id].remarks = payload.remark
  },
  storeUserServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.tables.userServerTable.byId[payload.serverId].status = payload.status_code
  },
  storeUserServerTableFilter (state, filter: string) {
    state.ui.vmList.filter = filter
  },
  clearUserServerTable (state) {
    state.tables.userServerTable.byId = {}
    state.tables.userServerTable.allIds = []
    state.tables.userServerTable.isLoaded = false
    // 不清空filter值，保持serviceId的选择
  },
  storeUserServerTable (state, tableObj: Record<string, ServerInterface>) {
    Object.assign(state.tables.userServerTable.byId, tableObj)
    state.tables.userServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userServerTable.allIds = [...new Set(state.tables.userServerTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.tables.userServerTable.isLoaded = true
    // console.log('updating userServerTable')
  },
  storeGlobalDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
    // 将dataCenter对象补充至globalDataCenterTable.byId
    Object.assign(state.tables.globalDataCenterTable.byId, tableObj)
    // 更新globalDataCenterTable.allIds，更新后去重
    state.tables.globalDataCenterTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.globalDataCenterTable.allIds = [...new Set(state.tables.globalDataCenterTable.allIds)]
    // 更新globalDataCenterTable.isLoaded,每次都更新，可以优化
    state.tables.globalDataCenterTable.isLoaded = true
    // console.log('updating globalDataCenterTable')
  },
  storeUserServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    // 将service对象补充至userServiceTable.byId
    Object.assign(state.tables.userServiceTable.byId, tableObj)
    // 更新userServiceTable.allIds，更新后去重
    state.tables.userServiceTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userServiceTable.allIds = [...new Set(state.tables.userServiceTable.allIds)]
    // 更新userServiceTable.isLoaded，每次都更新，可以优化
    state.tables.userServiceTable.isLoaded = true
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
