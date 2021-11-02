import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderModuleInterface } from './state'
import { QuotaApplicationInterface, ServerInterface } from 'src/store/server/state'

const getters: GetterTree<ProviderModuleInterface, StateInterface> = {
  // 根据用户选择的serviceId和status来返回application数组
  getAdminApplicationsByServiceIdByStatus: (state) => (serviceId: string, status: string): QuotaApplicationInterface[] => {
    // 先筛选serviceId。serviceId=''时全部返回
    const applicationsByServiceId = Object.values(state.tables.adminQuotaApplicationTable.byId).filter(application => serviceId ? application.service === serviceId : true)
    // 再筛选status。 status=''时全部返回
    const applications = applicationsByServiceId.filter(application => status ? status === application.status : true)
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: QuotaApplicationInterface, b: QuotaApplicationInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    return applications.sort(sortFn)
  },
  getServiceOptions (state, getters, rootState) {
    const services = rootState.account?.items.vmsAdmin.map(serviceId => {
      const currentService = rootState.fed.tables.serviceTable.byId[serviceId]
      return {
        value: currentService?.id,
        label: currentService?.name,
        labelEn: currentService?.name_en
      }
    })
    services.unshift({
      value: '',
      label: '全部服务节点',
      labelEn: 'All Service Nodes'
    })
    return services
  },
  getAdminServers (state): ServerInterface[] {
    // 排序函数，根据申请时间降序排列
    const sortFn = (a: ServerInterface, b: ServerInterface) => new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime()
    const rows: ServerInterface[] = []
    for (const application of Object.values(state.tables.adminServerTable.byId)) {
      rows.push(application)
    }
    return rows.sort(sortFn)
  }
}

export default getters
