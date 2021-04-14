import { MutationTree } from 'vuex'
import {
  VmInterface,
  DataCenterInterface,
  ServiceInterface,
  NetworkInterface,
  ImageInterface,
  FlavorInterface,
  VpnInterface,
  QuotaInterface,
  ServerInterface
} from './state'

const mutation: MutationTree<VmInterface> = {
  // 保存VmCreate页面中所选择的serviceId
  storeVmCreatePageServiceId (state, serviceId: string) {
    state.pages.vmCreate.serviceId = serviceId
  },
  storeUserQuotaTable (state, tableObj: Record<string, QuotaInterface>) {
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
  storeUserServerTableSingleRemarks (state, payload: { serverId: string; remarks: string; }) {
    state.tables.userServerTable.byId[payload.serverId].remarks = payload.remarks
  },
  storeUserServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.tables.userServerTable.byId[payload.serverId].status = payload.status_code
  },
  storeUserServerTableFilter (state, filter: string) {
    state.pages.vmList.filter = filter
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
  storeGlobalDataCenterTableServicesField (state, payload: { dataCenterId: string; serviceId: string; }) {
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].services.unshift(payload.serviceId)
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].services = [...new Set(state.tables.globalDataCenterTable.byId[payload.dataCenterId].services)]
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
  }
}

export default mutation
