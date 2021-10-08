import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderModuleInterface } from './state'
import { normalize, schema } from 'normalizr'
import api from '../api'
import { Dialog, Notify } from 'quasar'
import ProviderAuditQuotaApplicationCard from 'components/Provider/ProviderAuditQuotaApplicationCard.vue'

const actions: ActionTree<ProviderModuleInterface, StateInterface> = {
  /* tables */
  async loadAdminQuotaApplicationTable (context) {
    context.commit('clearTable', context.state.tables.adminQuotaApplicationTable)
    // 再获取数据并更新table
    // todo 当前只请求了一次，若超过200项，应多次请求至最后，待完成此逻辑
    const respApply = await api.apply.getApplyQuotaAdmin({ query: { deleted: false } })
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    for (const data of respApply.data.results) {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeTable', {
        table: context.state.tables.adminQuotaApplicationTable,
        tableObj: normalizedData.entities.quotaApplication
      })
    }
  },
  /* tables */

  /* dialogs */
  // 审批配额申请dialog
  async auditQuotaApplicationDialog (context, applyId: string) {
    // 检查当前申请状态，wait则挂起后再打开对话框
    const currentApplication = context.state.tables.adminQuotaApplicationTable.byId[applyId]
    // 挂起
    if (currentApplication.status === 'wait') {
      const respSuspend = await api.apply.postApplyQuotaPending({ path: { apply_id: applyId } })
      // 修改table
      const service = new schema.Entity('service')
      const quotaApplication = new schema.Entity('quotaApplication', { service })
      const normalizedData = normalize(respSuspend.data, quotaApplication)
      context.commit('storeTable', {
        table: context.state.tables.adminQuotaApplicationTable,
        tableObj: normalizedData.entities.quotaApplication
      })
    }
    Dialog.create({
      component: ProviderAuditQuotaApplicationCard,
      componentProps: {
        applyId
      }
    }).onOk(async (val: { isApprove: true } | { isApprove: false, reason: string }) => {
      if (val.isApprove) {
        // 批准申请
        const respApprove = await api.apply.postApplyQuotaPass({ path: { apply_id: applyId } })
        // 批准成功
        if (respApprove.status === 200) {
          // 更新table
          const service = new schema.Entity('service')
          const quotaApplication = new schema.Entity('quotaApplication', { service })
          const normalizedData = normalize(respApprove.data, quotaApplication)
          context.commit('storeTable', {
            table: context.state.tables.adminQuotaApplicationTable,
            tableObj: normalizedData.entities.quotaApplication
          })
          // notify
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'mdi-check-circle',
            textColor: 'light-green',
            message: '批准配额申请成功',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
        } // 不成功由axios统一通知
      } else {
        // 拒绝申请
        const respReject = await api.apply.postApplyQuotaReject({
          body: { reason: val.reason },
          path: { apply_id: applyId }
        })
        // 成功拒绝
        if (respReject.status === 200) {
          // 更新table
          const service = new schema.Entity('service')
          const quotaApplication = new schema.Entity('quotaApplication', { service })
          const normalizedData = normalize(respReject.data, quotaApplication)
          context.commit('storeTable', {
            table: context.state.tables.adminQuotaApplicationTable,
            tableObj: normalizedData.entities.quotaApplication
          })
          // notify
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'mdi-check-circle',
            textColor: 'light-green',
            message: '拒绝配额申请成功',
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
        }
      }
    })
  }
  /* dialogs */
}

export default actions
