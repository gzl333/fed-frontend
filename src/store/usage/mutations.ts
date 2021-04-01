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
  storeAvailableUserQuotaTable (state, tableObj: Record<string, UserQuotaInterface>) {
    Object.assign(state.availableUserQuotaTable.byId, tableObj)
    state.availableUserQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.availableUserQuotaTable.allIds = [...new Set(state.availableUserQuotaTable.allIds)]
    // allServerTable.isLoaded,每次都更新，可以优化
    state.availableUserQuotaTable.isLoaded = true
  },
  storeAvailableVpnTable (state, vpn: VpnInterface) {
    Object.assign(state.availableVpnTable.byId, { [vpn.id]: vpn })
    state.availableVpnTable.allIds.unshift(vpn.id)
    state.availableVpnTable.allIds = [...new Set(state.availableVpnTable.allIds)]
    state.availableVpnTable.isLoaded = true
  },
  storeAllFlavorTable (state, flavor: FlavorInterface) {
    Object.assign(state.allFlavorTable.byId, { [flavor.id]: flavor })
    state.allFlavorTable.allIds.unshift(flavor.id)
    state.allFlavorTable.allIds = [...new Set(state.allFlavorTable.allIds)]
    state.allFlavorTable.isLoaded = true
  },
  storeAvailableImageTable (state, image: ImageInterface) {
    // 存进allImageTable
    Object.assign(state.availableImageTable.byLocalId, { [image.localId]: image })
    state.availableImageTable.allLocalIds.unshift(image.localId)
    state.availableImageTable.allLocalIds = [...new Set(state.availableImageTable.allLocalIds)]
    state.availableImageTable.isLoaded = true
  },
  storeAvailableNetworkTable (state, network: NetworkInterface) {
    // 存进allNetworkTable
    Object.assign(state.availableNetworkTable.byLocalId, { [network.localId]: network })
    state.availableNetworkTable.allLocalIds.unshift(network.localId)
    state.availableNetworkTable.allLocalIds = [...new Set(state.availableNetworkTable.allLocalIds)]
    state.availableNetworkTable.isLoaded = true
  },
  storeNote (state, payload: { id: string; remark: string; }) {
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
  storeAllServerTable (state, tableObj: Record<string, ServerInterface>) {
    Object.assign(state.allServerTable.byId, tableObj)
    state.allServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.allServerTable.allIds = [...new Set(state.allServerTable.allIds)]
    // allServerTable.isLoaded,每次都更新，可以优化
    state.allServerTable.isLoaded = true
    // console.log('updating allServerTable')
  },
  storeAllDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
    // 将dataCenter对象补充至allDataCenterTable.byId
    Object.assign(state.allDataCenterTable.byId, tableObj)
    // 更新allDataCenterTable.allIds，更新后去重
    state.allDataCenterTable.allIds.unshift(Object.keys(tableObj)[0])
    state.allDataCenterTable.allIds = [...new Set(state.allDataCenterTable.allIds)]
    // 更新allDataCenterTable.isLoaded,每次都更新，可以优化
    state.allDataCenterTable.isLoaded = true
    // console.log('updating allDataCenterTable')
  },
  storeAvailableServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    // 将service对象补充至userServiceTable.byId
    Object.assign(state.availableServiceTable.byId, tableObj)
    // 更新userServiceTable.allIds，更新后去重
    state.availableServiceTable.allIds.unshift(Object.keys(tableObj)[0])
    state.availableServiceTable.allIds = [...new Set(state.availableServiceTable.allIds)]
    // 更新userServiceTable.isLoaded，每次都更新，可以优化
    state.availableServiceTable.isLoaded = true
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
