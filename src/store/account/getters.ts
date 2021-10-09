import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { AccountModuleInterface } from './state'
import { i18n } from 'boot/i18n'

const getters: GetterTree<AccountModuleInterface, StateInterface> = {
  getGroupOptions (state): { value: string; label: string; }[] {
    let groupOptions = []
    for (const group of Object.values(state.tables.groupTable.byId)) {
      groupOptions.push(
        {
          value: group.id,
          label: group.name
        }
      )
    }
    // 排序
    groupOptions = groupOptions.sort((a, b) => -a.label.localeCompare(b.label, 'zh-CN'))
    // // vue组件外取i18n中locale字段的方法
    groupOptions.unshift({
      value: '0',
      label: i18n.global.locale === 'zh' ? '全部项目组' : 'All Groups'
    })

    return groupOptions
  }
}

export default getters
