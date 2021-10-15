import { MutationTree } from 'vuex'
import {
  VmModuleInterface
  // DataCenterInterface,
  // ServiceInterface,
  // NetworkInterface,
  // ImageInterface,
  // FlavorInterface,
  // VpnInterface,
  // QuotaInterface,
  // ServerInterface,
  // PersonalUserQuota
} from './state'

const mutation: MutationTree<VmModuleInterface> = {
  // clearUserQuotaTable (state) {
  //   state.tables.userQuotaTable.byId = {}
  //   state.tables.userQuotaTable.allIds = []
  //   state.tables.userQuotaTable.isLoaded = false
  // },
  // group_obsolete
  // clearGroupQuotaTable (state) {
  //   state.tables.groupQuotaTable.byId = {}
  //   state.tables.groupQuotaTable.allIds = []
  //   state.tables.groupQuotaTable.isLoaded = false
  // },
  // 删除单一user quota
  // deleteUserQuotaTableSingleQuota (state, quotaId: string) {
  //   const currentTable = state.tables.userQuotaTable
  //   currentTable.allIds = currentTable.allIds.filter(id => id !== quotaId)
  //   delete currentTable.byId[quotaId]
  //   if (currentTable.allIds.length === 0) {
  //     currentTable.isLoaded = false
  //   }
  // },
  // deleteGroupQuotaTableSingleQuota (state, quotaId: string) {
  //   const currentTable = state.tables.groupQuotaTable
  //   currentTable.allIds = currentTable.allIds.filter(id => id !== quotaId)
  //   delete currentTable.byId[quotaId]
  //   if (currentTable.allIds.length === 0) {
  //     currentTable.isLoaded = false
  //   }
  // },
  // storeUserQuotaTable (state, tableObj: Record<string, QuotaInterface>) {
  //   Object.assign(state.tables.userQuotaTable.byId, tableObj)
  //   state.tables.userQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.userQuotaTable.allIds = [...new Set(state.tables.userQuotaTable.allIds)]
  //   // userServerTable.isLoaded,每次都更新，可以优化
  //   state.tables.userQuotaTable.isLoaded = true
  // },
  // group_obsolete
  // storeGroupQuotaTable (state, tableObj: Record<string, QuotaInterface>) {
  //   Object.assign(state.tables.groupQuotaTable.byId, tableObj)
  //   state.tables.groupQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.groupQuotaTable.allIds = [...new Set(state.tables.groupQuotaTable.allIds)]
  //   // userServerTable.isLoaded,每次都更新，可以优化
  //   state.tables.groupQuotaTable.isLoaded = true
  // },
  // storeUserVpnTableSingle (state, vpn: VpnInterface) {
  //   Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
  //   state.tables.userVpnTable.allIds.unshift(vpn.id)
  //   state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
  // },
  // storeUserVpnTableFromServer (state, vpn: VpnInterface) {
  //   Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
  //   state.tables.userVpnTable.allIds.unshift(vpn.id)
  //   state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
  //   state.tables.userVpnTable.isLoaded.server = true
  // },
  // storeUserVpnTableFromService (state, vpn: VpnInterface) {
  //   Object.assign(state.tables.userVpnTable.byId, { [vpn.id]: vpn })
  //   state.tables.userVpnTable.allIds.unshift(vpn.id)
  //   state.tables.userVpnTable.allIds = [...new Set(state.tables.userVpnTable.allIds)]
  //   state.tables.userVpnTable.isLoaded.service = true
  // },
  // storeGlobalFlavorTable (state, flavor: FlavorInterface) {
  //   Object.assign(state.tables.fedFlavorTable.byId, { [flavor.id]: flavor })
  //   state.tables.fedFlavorTable.allIds.unshift(flavor.id)
  //   state.tables.fedFlavorTable.allIds = [...new Set(state.tables.fedFlavorTable.allIds)]
  //   state.tables.fedFlavorTable.isLoaded = true
  // },
  // storeGlobalImageTable (state, image: ImageInterface) {
  //   // 存进allImageTable
  //   Object.assign(state.tables.globalImageTable.byLocalId, { [image.localId]: image })
  //   state.tables.globalImageTable.allLocalIds.unshift(image.localId)
  //   state.tables.globalImageTable.allLocalIds = [...new Set(state.tables.globalImageTable.allLocalIds)]
  //   state.tables.globalImageTable.isLoaded = true
  // },
  // storeUserImageTable (state, image: ImageInterface) {
  //   // 存进allImageTable
  //   Object.assign(state.tables.userImageTable.byLocalId, { [image.localId]: image })
  //   state.tables.userImageTable.allLocalIds.unshift(image.localId)
  //   state.tables.userImageTable.allLocalIds = [...new Set(state.tables.userImageTable.allLocalIds)]
  //   state.tables.userImageTable.isLoaded = true
  // },
  // storeGlobalNetworkTable (state, network: NetworkInterface) {
  //   Object.assign(state.tables.globalNetworkTable.byLocalId, { [network.localId]: network })
  //   state.tables.globalNetworkTable.allLocalIds.unshift(network.localId)
  //   state.tables.globalNetworkTable.allLocalIds = [...new Set(state.tables.globalNetworkTable.allLocalIds)]
  //   state.tables.globalNetworkTable.isLoaded = true
  // },
  // storeUserNetworkTable (state, network: NetworkInterface) {
  //   // 存进allNetworkTable
  //   Object.assign(state.tables.userNetworkTable.byLocalId, { [network.localId]: network })
  //   state.tables.userNetworkTable.allLocalIds.unshift(network.localId)
  //   state.tables.userNetworkTable.allLocalIds = [...new Set(state.tables.userNetworkTable.allLocalIds)]
  //   state.tables.userNetworkTable.isLoaded = true
  // },
  // storeUserServerTableSingleRemarks (state, payload: { serverId: string; remarks: string; }) {
  //   state.tables.userServerTable.byId[payload.serverId].remarks = payload.remarks
  // },
  // storeGroupServerTableSingleRemarks (state, payload: { serverId: string; remarks: string; }) {
  //   state.tables.groupServerTable.byId[payload.serverId].remarks = payload.remarks
  // },
  // storeUserServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
  //   state.tables.userServerTable.byId[payload.serverId].status = payload.status_code
  // },
  // group_obsolete
  // storeGroupServerTableSingleStatus (state, payload: { serverId: string; status_code: string; }) {
  //   state.tables.groupServerTable.byId[payload.serverId].status = payload.status_code
  // },
  // clearUserServerTable (state) {
  //   state.tables.userServerTable.byId = {}
  //   state.tables.userServerTable.allIds = []
  //   state.tables.userServerTable.isLoaded = false
  // },
  // group_obsolete
  // clearGroupServerTable (state) {
  //   state.tables.groupServerTable.byId = {}
  //   state.tables.groupServerTable.allIds = []
  //   state.tables.groupServerTable.isLoaded = false
  // },
  // clearProviderServerTable (state) {
  //   state.tables.providerServerTable.byId = {}
  //   state.tables.providerServerTable.allIds = []
  //   state.tables.providerServerTable.isLoaded = false
  // },
  // // duyukuan
  // storeProviderServerTable (state, tableObj: Record<string, ServerInterface>) {
  //   Object.assign(state.tables.providerServerTable.byId, tableObj)
  //   state.tables.providerServerTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.providerServerTable.allIds = [...new Set(state.tables.providerServerTable.allIds)]
  //   state.tables.providerServerTable.isLoaded = true
  // },
  // storeProviderQuotaTable (state, tableObj: Record<string, PersonalUserQuota>) {
  //   Object.assign(state.tables.providerQuotaTable.byId, tableObj)
  //   state.tables.providerQuotaTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.providerQuotaTable.allIds = [...new Set(state.tables.providerQuotaTable.allIds)]
  //   state.tables.providerQuotaTable.isLoaded = true
  // }
  // // 存入服务私有配额
  // storePrivateServiceQuotaStatTable (state, tableObj: Record<string, ServiceQuotaStatInterface>) {
  //   Object.assign(state.tables.privateServiceQuotaStatTable.byId, tableObj)
  //   state.tables.privateServiceQuotaStatTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.privateServiceQuotaStatTable.allIds = [...new Set(state.tables.privateServiceQuotaStatTable.allIds)]
  //   state.tables.privateServiceQuotaStatTable.isLoaded = true
  // },
  // // 存入服务共享配额
  // storeSharedServiceQuotaStatTable (state, tableObj: Record<string, ServiceQuotaStatInterface>) {
  //   Object.assign(state.tables.sharedServiceQuotaStatTable.byId, tableObj)
  //   state.tables.sharedServiceQuotaStatTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.sharedServiceQuotaStatTable.allIds = [...new Set(state.tables.sharedServiceQuotaStatTable.allIds)]
  //   state.tables.sharedServiceQuotaStatTable.isLoaded = true
  // },
  // storeUserServerTable (state, tableObj: Record<string, ServerInterface>) {
  //   Object.assign(state.tables.userServerTable.byId, tableObj)
  //   state.tables.userServerTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.userServerTable.allIds = [...new Set(state.tables.userServerTable.allIds)]
  //   // userServerTable.isLoaded,每次都更新，可以优化
  //   state.tables.userServerTable.isLoaded = true
  //   // console.log('updating userServerTable')
  // },
  // group_obsolete
  // storeGroupServerTable (state, tableObj: Record<string, ServerInterface>) {
  //   Object.assign(state.tables.groupServerTable.byId, tableObj)
  //   state.tables.groupServerTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.groupServerTable.allIds = [...new Set(state.tables.groupServerTable.allIds)]
  //   state.tables.groupServerTable.isLoaded = true
  // },
  // storeGlobalDataCenterTableGlobalServices (state, payload: { dataCenterId: string; serviceId: string; }) {
  //   state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices.unshift(payload.serviceId)
  //   state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices = [...new Set(state.tables.globalDataCenterTable.byId[payload.dataCenterId].globalServices)]
  // },
  // storeGlobalDataCenterTableUserServices (state, payload: { dataCenterId: string; serviceId: string; }) {
  //   state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices.unshift(payload.serviceId)
  //   state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices = [...new Set(state.tables.globalDataCenterTable.byId[payload.dataCenterId].userServices)]
  // },
  // storeGlobalDataCenterTable (state, tableObj: Record<string, DataCenterInterface>) {
  //   // 将dataCenter对象补充至globalDataCenterTable.byId
  //   Object.assign(state.tables.globalDataCenterTable.byId, tableObj)
  //   // 更新globalDataCenterTable.allIds，更新后去重
  //   state.tables.globalDataCenterTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.globalDataCenterTable.allIds = [...new Set(state.tables.globalDataCenterTable.allIds)]
  //   // 更新globalDataCenterTable.isLoaded,每次都更新，可以优化
  //   state.tables.globalDataCenterTable.isLoaded = true
  //   // console.log('updating globalDataCenterTable')
  // }
  // storeGlobalServiceTable (state, tableObj: Record<string, ServiceInterface>) {
  //   // 将service对象补充至globalServiceTable.byId
  //   Object.assign(state.tables.globalServiceTable.byId, tableObj)
  //   // console.log(state.tables.globalServiceTable.allIds)
  //   // 更新globalServiceTable.allIds，更新后去重
  //   state.tables.globalServiceTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.globalServiceTable.allIds = [...new Set(state.tables.globalServiceTable.allIds)]
  //   // 更新globalServiceTable.isLoaded，每次都更新，可以优化
  //   state.tables.globalServiceTable.isLoaded = true
  //   // console.log('updating globalServiceTable')
  // },
  // storeUserServiceTable (state, tableObj: Record<string, ServiceInterface>) {
  //   // 将service对象补充至userServiceTable.byId
  //   Object.assign(state.tables.userServiceTable.byId, tableObj)
  //   // 更新userServiceTable.allIds，更新后去重
  //   state.tables.userServiceTable.allIds.unshift(Object.keys(tableObj)[0])
  //   state.tables.userServiceTable.allIds = [...new Set(state.tables.userServiceTable.allIds)]
  //   // 更新userServiceTable.isLoaded，每次都更新，可以优化
  //   state.tables.userServiceTable.isLoaded = true
  //   // console.log('updating userServiceTable')
  // }
}

export default mutation