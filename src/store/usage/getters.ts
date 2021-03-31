import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerInterface, UsageInterface } from './state'

const getters: GetterTree<UsageInterface, StateInterface> = {
  getServiceOptions (state): { value: string; label: string; }[] {
    // 数据结构如下
    // const serviceOptions = [
    //   {
    //     label: '全部节点',
    //     value: '0'
    //   },
    //   {
    //     label: '中国科学院计算机网络信息中心 - HR_204机房',
    //     value: '1'
    //   },
    //   {
    //     label: '地球大数据科学工程专项 - 怀柔机房一层',
    //     value: '2'
    //   }
    // ]
    const serviceOptions = [
      {
        value: '0',
        label: '全部服务节点'
      }
    ]
    for (const service of Object.values(state.userServiceTable.byId)) {
      serviceOptions.push(
        {
          value: service.id,
          label: state.allDataCenterTable.byId[service.id].name + ' - ' + service.name
        }
      )
    }
    return serviceOptions
  },
  getServersByServiceId (state): ServerInterface[] {
    // 根据用户选择的serviceId来返回server数组
    // 当前选择的serviceId位于allServerTable.filter，利用vmlist中的watch来修改
    if (state.allServerTable.filter === '0') {
      return Object.values(state.allServerTable.byId)
    } else {
      const rows: ServerInterface[] = []
      for (const server of Object.values(state.allServerTable.byId)) {
        if (server.service === state.allServerTable.filter) {
          rows.push(server)
        }
      }
      return rows
    }
  }
}

export default getters
