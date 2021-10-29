import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ProviderModuleInterface } from './state'
import { normalize, schema } from 'normalizr'
import { $api } from 'boot/api'
import { Dialog, Notify } from 'quasar'
import ProviderAuditQuotaApplicationCard from 'components/Provider/ProviderAuditQuotaApplicationCard.vue'

const actions: ActionTree<ProviderModuleInterface, StateInterface> = {
  /* tables */
  async loadAdminQuotaApplicationTable (context) {
    context.commit('clearTable', context.state.tables.adminQuotaApplicationTable)
    // 再获取数据并更新table
    // todo 当前只请求了一次，若超过200项，应多次请求至最后，待完成此逻辑
    const respApply = await $api.apply.getApplyQuotaAdmin({ query: { deleted: false } })
    const service = new schema.Entity('service')
    const quotaApplication = new schema.Entity('quotaApplication', { service })
    for (const data of respApply.data.results) {
      const normalizedData = normalize(data, quotaApplication)
      context.commit('storeItem', {
        table: context.state.tables.adminQuotaApplicationTable,
        item: normalizedData.entities.quotaApplication
      })
    }
    // load table的最后再改isLoaded
    context.commit('storeStatus', {
      table: context.state.tables.adminQuotaApplicationTable,
      isLoaded: true
    })
  },
  async loadAdminServerTable (context, payload: { page?: number; page_size?: number }) {
    context.commit('clearTable', context.state.tables.adminServerTable)
    const respGroupServer = await $api.server.getServer({ query: payload })
    const service = new schema.Entity('service')
    const server = new schema.Entity('server', { service })
    // if (respGroupServer.data) {
    for (const data of respGroupServer.data.servers) {
      const normalizedData = normalize(data, server)
      context.commit('storeItem', {
        table: context.state.tables.adminServerTable,
        item: normalizedData.entities.server
      })
    }
    // load table的最后再改isLoaded
    context.commit('storeStatus', {
      table: context.state.tables.adminServerTable,
      isLoaded: true
    })
    // }
    return respGroupServer
  },
  /* tables */

  /* dialogs */
  // 审批配额申请dialog
  async auditQuotaApplicationDialog (context, applyId: string) {
    // 检查当前申请状态，wait则挂起后再打开对话框
    const currentApplication = context.state.tables.adminQuotaApplicationTable.byId[applyId]
    // 挂起
    if (currentApplication.status === 'wait') {
      const respSuspend = await $api.apply.postApplyQuotaPending({ path: { apply_id: applyId } })
      // 修改table
      const service = new schema.Entity('service')
      const quotaApplication = new schema.Entity('quotaApplication', { service })
      const normalizedData = normalize(respSuspend.data, quotaApplication)
      // 只保存单个item不改isLoaded状态
      context.commit('storeItem', {
        table: context.state.tables.adminQuotaApplicationTable,
        item: normalizedData.entities.quotaApplication
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
        const respApprove = await $api.apply.postApplyQuotaPass({ path: { apply_id: applyId } })
        // 批准成功
        if (respApprove.status === 200) {
          // 更新table
          const service = new schema.Entity('service')
          const quotaApplication = new schema.Entity('quotaApplication', { service })
          const normalizedData = normalize(respApprove.data, quotaApplication)
          // 只保存单个item不改isLoaded状态
          context.commit('storeItem', {
            table: context.state.tables.adminQuotaApplicationTable,
            item: normalizedData.entities.quotaApplication
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
        const respReject = await $api.apply.postApplyQuotaReject({
          body: { reason: val.reason },
          path: { apply_id: applyId }
        })
        // 成功拒绝
        if (respReject.status === 200) {
          // 更新table
          const service = new schema.Entity('service')
          const quotaApplication = new schema.Entity('quotaApplication', { service })
          const normalizedData = normalize(respReject.data, quotaApplication)
          // 只保存单个item不改isLoaded状态
          context.commit('storeItem', {
            table: context.state.tables.adminQuotaApplicationTable,
            item: normalizedData.entities.quotaApplication
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
