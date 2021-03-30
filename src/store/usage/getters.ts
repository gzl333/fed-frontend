import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { UsageInterface } from './state'

const getters: GetterTree<UsageInterface, StateInterface> = {
  getServiceOptions (state) {
    const serviceOptions = [{
      value: '0',
      label: '全部节点'
    }]
    for (const service of state.userServiceTable.values()) {
      serviceOptions.push(
        {
          value: service.id,
          label: state.allDataCenterTable.get(service.id)!.name + ' - ' + service.name
        }
      )
    }
    console.log('in getter')
    return serviceOptions
  }
}

export default getters
