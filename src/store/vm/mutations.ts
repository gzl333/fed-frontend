import { MutationTree } from 'vuex'
import {
  VmModuleInterface,
  DataCenterInterface,
  ServiceInterface,
  NetworkInterface,
  ImageInterface,
  FlavorInterface,
  VpnInterface,
  QuotaInterface,
  ServerInterface, UserPersonalServerInterface, PersonalUserQuota, PrivateQuotaInterface, ShareQuotaInterface
} from './state'

const mutation: MutationTree<VmModuleInterface> = {
  clearUserQuotaTable (state) {
    state.tables.userQuotaTable.byId = {}
    state.tables.userQuotaTable.allIds = []
    state.tables.userQuotaTable.isLoaded = false
  },
  // group
  clearGroupQuotaTable (state) {
    state.tables.groupQuotaTable.byId = {}
    state.tables.groupQuotaTable.allIds = []
    state.tables.groupQuotaTable.isLoaded = false
  },
  // 删除单一user quota
  deleteUserQuotaTableSingleQuota (state, quotaId: string) {
    const currentTable = state.tables.userQuotaTable
    currentTable.allIds = currentTable.allIds.filter(id => id !== quotaId)
    delete currentTable.byId[quotaId]
    if (currentTable.allIds.length === 0) {
      currentTable.isLoaded = false
    }
  },
  deleteGroupQuotaTableSingleQuota (state, quotaId: string) {
    const currentTable = state.tables.groupQuotaTable
    currentTable.allIds = currentTable.allIds.filter(id => id !== quotaId)
    delete currentTable.byId[quotaId]
    if (currentTable.allIds.length === 0) {
      currentTable.isLoaded = false
    }
  },
  storeUserQuotaTable (state, tableObj: Record<string, QuotaInterface>) {
    Object.assign(state.tables.userQuotaTable.byId, tableObj)
    state.tables.userQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userQuotaTable.allIds = [...new Set(state.tables.userQuotaTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.tables.userQuotaTable.isLoaded = true
  },
  // group
  storeGroupQuotaTable (state, tableObj: Record<string, QuotaInterface>) {
    Object.assign(state.tables.groupQuotaTable.byId, tableObj)
    state.tables.groupQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.groupQuotaTable.allIds = [...new Set(state.tables.groupQuotaTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.tables.groupQuotaTable.isLoaded = true
  },
  storeUserVpnTableSingle (state, vpn: VpnInterface) {
    Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
    state.tables.userVpnTable.allIds.unshift(vpn.id)
    state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
  },
  storeUserVpnTableFromServer (state, vpn: VpnInterface) {
    Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
    state.tables.userVpnTable.allIds.unshift(vpn.id)
    state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
    state.tables.userVpnTable.isLoaded.server = true
  },
  storeUserVpnTableFromService (state, vpn: VpnInterface) {
    Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
    state.tables.userVpnTable.allIds.unshift(vpn.id)
    state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
    state.tables.userVpnTable.isLoaded.service = true
  },
  storeGlobalFlavorTable (state, flavor: FlavorInterface) {
    Object.assign(state.tables.globalFlavorTable.byId, { [flavor.id]: flavor })
    state.tables.globalFlavorTable.allIds.unshift(flavor.id)
    state.tables.globalFlavorTable.allIds = [...new Set(state.tables.globalFlavorTable.allIds)]
    state.tables.globalFlavorTable.isLoaded = true
  },
  storeGlobalImageTable (state, image: ImageInterface) {
    // 存进allImageTable
    Object.assign(state.tables.globalImageTable.byLocalId, { [image.localId]: image })
    state.tables.globalImageTable.allLocalIds.unshift(image.localId)
    state.tables.globalImageTable.allLocalIds = [...new Set(state.tables.globalImageTable.allLocalIds)]
    state.tables.globalImageTable.isLoaded = true
  },
  storeUserImageTable (state, image: ImageInterface) {
    // 存进allImageTable
    Object.assign(state.tables.userImageTable.byLocalId, { [image.localId]: image })
    state.tables.userImageTable.allLocalIds.unshift(image.localId)
    state.tables.userImageTable.allLocalIds = [...new Set(state.tables.userImageTable.allLocalIds)]
    state.tables.userImageTable.isLoaded = true
  },
  storeGlobalNetworkTable (state, network: NetworkInterface) {
    Object.assign(state.tables.globalNetworkTable.byLocalId, { [network.localId]: network })
    state.tables.globalNetworkTable.allLocalIds.unshift(network.localId)
    state.tables.globalNetworkTable.allLocalIds = [...new Set(state.tables.globalNetworkTable.allLocalIds)]
    state.tables.globalNetworkTable.isLoaded = true
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
  storeGroupServerTableSingleRemarks (state, payload: { serverId: string; remarks: string; }) {
    state.tables.groupServerTable.byId[payload.serverId].remarks = payload.remarks
  },
  storeUserServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.tables.userServerTable.byId[payload.serverId].status = payload.status_code
  },
  // group
  storeGroupServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
    state.tables.groupServerTable.byId[payload.serverId].status = payload.status_code
  },
  clearUserServerTable (state) {
    state.tables.userServerTable.byId = {}
    state.tables.userServerTable.allIds = []
    state.tables.userServerTable.isLoaded = false
  },
  // group
  clearGroupServerTable (state) {
    state.tables.groupServerTable.byId = {}
    state.tables.groupServerTable.allIds = []
    state.tables.groupServerTable.isLoaded = false
  },
  clearUserPersonalServerTable (state) {
    state.tables.userPersonalServerTable.byId = {}
    state.tables.userPersonalServerTable.allIds = []
    state.tables.userPersonalServerTable.isLoaded = false
  },
  // duyukuan
  storeUserPersonalServerTable (state, tableObj: Record<string, UserPersonalServerInterface>) {
    Object.assign(state.tables.userPersonalServerTable.byId, tableObj)
    state.tables.userPersonalServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userPersonalServerTable.allIds = [...new Set(state.tables.userPersonalServerTable.allIds)]
    state.tables.userPersonalServerTable.isLoaded = true
  },
  storeUserPersonalQuotaTable (state, tableObj: Record<string, PersonalUserQuota>) {
    Object.assign(state.tables.userPersonalQuotaTable.byId, tableObj)
    state.tables.userPersonalQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userPersonalQuotaTable.allIds = [...new Set(state.tables.userPersonalQuotaTable.allIds)]
    state.tables.userPersonalQuotaTable.isLoaded = true
  },
  // 存入服务私有配额
  storePrivateQuotaTable (state, tableObj: Record<string, PrivateQuotaInterface>) {
    Object.assign(state.tables.privateQuotaTable.byId, tableObj)
    state.tables.privateQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.privateQuotaTable.allIds = [...new Set(state.tables.privateQuotaTable.allIds)]
    state.tables.privateQuotaTable.isLoaded = true
  },
  // 存入服务共享配额
  storeShareQuotaTable (state, tableObj: Record<string, ShareQuotaInterface>) {
    Object.assign(state.tables.shareQuotaTable.byId, tableObj)
    state.tables.shareQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.shareQuotaTable.allIds = [...new Set(state.tables.shareQuotaTable.allIds)]
    state.tables.shareQuotaTable.isLoaded = true
  },
  storeUserServerTable (state, tableObj: Record<string, ServerInterface>) {
    Object.assign(state.tables.userServerTable.byId, tableObj)
    state.tables.userServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.userServerTable.allIds = [...new Set(state.tables.userServerTable.allIds)]
    // userServerTable.isLoaded,每次都更新，可以优化
    state.tables.userServerTable.isLoaded = true
    // console.log('updating userServerTable')
  },
  // group
  storeGroupServerTable (state, tableObj: Record<string, ServerInterface>) {
    Object.assign(state.tables.groupServerTable.byId, tableObj)
    state.tables.groupServerTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.groupServerTable.allIds = [...new Set(state.tables.groupServerTable.allIds)]
    state.tables.groupServerTable.isLoaded = true
  },
  storeGlobalDataCenterTableGlobalServices (state, payload: { dataCenterId: string; serviceId: string; }) {
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices.unshift(payload.serviceId)
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices = [...new Set(state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices)]
  },
  storeGlobalDataCenterTableUserServices (state, payload: { dataCenterId: string; serviceId: string; }) {
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices.unshift(payload.serviceId)
    state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices = [...new Set(state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices)]
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
  storeGlobalServiceTable (state, tableObj: Record<string, ServiceInterface>) {
    // 将service对象补充至globalServiceTable.byId
    Object.assign(state.tables.globalServiceTable.byId, tableObj)
    console.log(state.tables.globalServiceTable.allIds)
    // 更新globalServiceTable.allIds，更新后去重
    state.tables.globalServiceTable.allIds.unshift(Object.keys(tableObj)[0])
    state.tables.globalServiceTable.allIds = [...new Set(state.tables.globalServiceTable.allIds)]
    // 更新globalServiceTable.isLoaded，每次都更新，可以优化
    state.tables.globalServiceTable.isLoaded = true
    // console.log('updating globalServiceTable')
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
