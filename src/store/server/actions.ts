import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface } from './state'
import api from '../api'
import { normalize, schema } from 'normalizr'
import { ServerInterface } from 'src/store/vm/state'
import { Dialog, Notify } from 'quasar'
import QuotaApplicationEditCard from 'components/Quota/QuotaApplicationEditCard.vue'

const actions: ActionTree<ServerModuleInterface, StateInterface> = {
  /* tables */
  async loadFedFlavorTable (context) {
    context.commit('clearTable', context.state.tables.fedFlavorTable)
    const respFlavor = await api.flavor.getFlavor()
    for (const flavor of respFlavor.data.flavors) {
      context.commit('storeTable', {
        table: context.state.tables.fedFlavorTable,
        tableObj: { [flavor.id]: flavor }
      })
    }
  },
  async loadServiceNetworkTable (context) {
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respNetwork = await api.network.getNetwork({ query: { service_id: serviceId } })
      for (const network of respNetwork.data) {
        // 将service 和 localId补充进network对象
        Object.assign(network, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${network.id}`
        })
        context.commit('storeTableLocalId', {
          table: context.state.tables.serviceNetworkTable,
          tableObj: { [network.localId]: network }
        })
      }
    }
  },
  async loadServiceImageTable (context) {
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respImage = await api.image.getImage({ query: { service_id: serviceId } })
      for (const image of respImage.data) {
        // 将service 和 localId补充进image对象
        Object.assign(image, {
          service: serviceId,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          localId: `${serviceId}-${image.id}`
        })
        context.commit('storeTableLocalId', {
          table: context.state.tables.serviceImageTable,
          tableObj: { [image.localId]: image }
        })
      }
    }
  },
  async loadUserVpnTable (context) {
    context.commit('clearTable', context.state.tables.userVpnTable)
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respVpn = await api.vpn.getVpn({ path: { service_id: serviceId } })
      Object.assign(respVpn.data.vpn, { id: serviceId })
      context.commit('storeTable', {
        table: context.state.tables.userVpnTable,
        tableObj: { [serviceId]: respVpn.data.vpn }
      })
    }
  },
  async loadPersonalQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.personalQuotaTable)
    // 将响应normalize
    const respQuota = await api.quota.getQuota({ query: { deleted: false } })
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    // quota数组
    for (const data of respQuota.data.results) {
      /* 增加补充字段 */
      // 获取quota下对应的server列表
      const respQuotaServers = await api.quota.getQuotaServers({ path: { id: data.id } })
      const servers: string[] = []
      respQuotaServers.data.results.forEach((server: ServerInterface) => {
        servers.push(server.id)
      })
      // 给data增加servers字段
      Object.assign(data, { servers })
      // 给data增加expired字段
      const expired = !!data.expiration_time && (new Date(data.expiration_time).getTime() < new Date().getTime())
      Object.assign(data, { expired })
      // 给data增加exhausted字段,该字段的判断方式可能后期更改
      const exhausted = data.vcpu_used === data.vcpu_total || data.ram_used === data.ram_total || (data.private_ip_used === data.private_ip_total && data.public_ip_used === data.public_ip_total)
      Object.assign(data, { exhausted })
      /* 增加补充字段 */

      // normalize data
      const normalizedData = normalize(data, quota)
      context.commit('storeTable', {
        table: context.state.tables.personalQuotaTable,
        tableObj: normalizedData.entities.quota
      })
    }
  },
  // 更新整个userServerTable
  async loadPersonalServerTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.personalServerTable)
    // 发送请求
    const respServer = await api.server.getServer()
    // 将响应normalize，存入state里的userServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    for (const data of respServer.data.servers) {
      const normalizedData = normalize(data, server)
      context.commit('storeTable', {
        table: context.state.tables.personalServerTable,
        tableObj: normalizedData.entities.server
      })
    }
    // 建立personalServerTable之后，分别更新每个server status, 并发更新，无需await
    for (const serverId of context.state.tables.personalServerTable.allIds) {
      void context.dispatch('loadSingleServerStatus', {
        table: context.state.tables.personalServerTable,
        serverId
      })
    }
  },
  // 更新整个groupServerTable，调用点在group模块里
  async loadGroupServerTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupServerTable)
    // 根据groupTable,建立groupServerTable
    for (const groupId of context.rootState.account.tables.groupTable.allIds) {
      // 发送请求
      const respGroupServer = await api.server.getServerVo({ path: { vo_id: groupId } })
      // 将响应normalize
      const service = new schema.Entity('service')
      const user_quota = new schema.Entity('user_quota')
      const server = new schema.Entity('server', {
        service,
        user_quota
      })
      for (const data of respGroupServer.data.servers) {
        const normalizedData = normalize(data, server)
        context.commit('storeTable', {
          table: context.state.tables.groupServerTable,
          tableObj: normalizedData.entities.server
        })
      }
      // 建立groupServerTable之后，分别更新每个server status, 并发更新，无需await
      for (const serverId of context.state.tables.groupServerTable.allIds) {
        void context.dispatch('loadSingleServerStatus', {
          table: context.state.tables.groupServerTable,
          serverId
        })
      }
    }
  },
  // 获取并保存单个server的status
  async loadSingleServerStatus (context, payload: {
    table: {
      byId: Record<string, ServerInterface> // 此处固定为ServerInterface
      allIds: string[]
      isLoaded: boolean
    }
    serverId: string
  }) {
    // 先清空server status，让状态变为空，UI则显示为获取中
    context.commit('storeSingleServerStatus', {
      table: payload.table,
      serverId: payload.serverId,
      status_code: '' // 有状态的状态码为integer
    })
    const respStatus = await api.server.getServerStatus({ path: { id: payload.serverId } })
    context.commit('storeSingleServerStatus', {
      table: payload.table,
      serverId: payload.serverId,
      status_code: respStatus.data.status.status_code
    })
  },
  // 所有groupQuota根据quotaId存在一个对象里，不区分group，getter里区分group取
  async loadGroupQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupQuotaTable)
    // 根据groupTable,建立groupQuotaTable
    for (const groupId of context.rootState.account.tables.groupTable.allIds) {
      // 获取响应
      const respGroupQuota = await api.quota.getQuotaVo({ path: { vo_id: groupId } })
      // 将响应normalize
      const service = new schema.Entity('service')
      const quota = new schema.Entity('quota', { service })
      // quota数组
      for (const data of respGroupQuota.data.results) {
        /* 增加补充字段 */
        // 补充vo_id字段
        Object.assign(data, { vo_id: groupId })
        // 获取quota下对应的server列表
        const respQuotaServers = await api.quota.getQuotaServers({ path: { id: data.id } })
        const servers: string[] = []
        respQuotaServers.data.results.forEach((server: ServerInterface) => {
          servers.push(server.id)
        })
        // 给data增加servers字段
        Object.assign(data, { servers })
        // 给data增加expired字段
        const expired = !!data.expiration_time && (new Date(data.expiration_time).getTime() < new Date().getTime())
        Object.assign(data, { expired })
        // 给data增加exhausted字段,该字段的判断方式可能后期更改
        const exhausted = data.vcpu_used === data.vcpu_total ||
          data.ram_used === data.ram_total ||
          (data.private_ip_used === data.private_ip_total && data.public_ip_used === data.public_ip_total)
        Object.assign(data, { exhausted })
        /* 增加补充字段 */

        // normalize data
        const normalizedData = normalize(data, quota)
        // 存入groupQuotaTable
        context.commit('storeTable', {
          table: context.state.tables.groupQuotaTable,
          tableObj: normalizedData.entities.quota
        })
      }
    }
  },
  // 默认personalQuotaApplicationTable只保存undeleted的application
  async loadPersonalQuotaApplicationTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.personalQuotaApplicationTable)
    // 再获取数据并更新table
    const respApply = await api.apply.getApplyQuota({ query: { deleted: false } }) // 不包含已删除的申请
    const service = new schema.Entity('service')
    const application = new schema.Entity('application', { service })
    for (const data of respApply.data.results) {
      const normalizedData = normalize(data, application)
      context.commit('storeTable', {
        table: context.state.tables.personalQuotaApplicationTable,
        tableObj: normalizedData.entities.application
      })
    }
  },
  async loadGroupQuotaApplicationTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupQuotaApplicationTable)
    // 根据groupTable,建立groupApplicationTable
    for (const groupId of context.rootState.account.tables.groupTable.allIds) {
      // member没有权限请求这个接口, owner和leader可以
      if (context.rootState.account.tables.groupTable.byId[groupId].myRole !== 'member') {
        // 获取响应
        const respGroupApplication = await api.apply.getApplyQuotaVo({
          path: { vo_id: groupId },
          query: { deleted: false }
        })
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        // application 数组
        for (const data of respGroupApplication.data.results) {
          /* 增加补充字段 */
          // 补充vo_id字段
          Object.assign(data, { vo_id: groupId })
          /* 增加补充字段 */
          // normalize data
          const normalizedData = normalize(data, application)
          // 存入
          context.commit('storeTable', {
            table: context.state.tables.groupQuotaApplicationTable,
            tableObj: normalizedData.entities.application
          })
        }
      }
    }
  },
  async loadFedQuotaActivityTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新
    // 当前没有强制清楚，避免了ui闪烁,但是也没有数据累加
    // context.commit('clearTable', context.state.tables.fedQuotaActivityTable)

    // 获取数据并更新table
    // 当前table内容为筛选出active,排除未开始和已结束的，以后可根据需求全部获取，显示时进行筛选
    const respActivity = await api.quota_activity.getQuotaActivity({
      query: {
        status: 'active',
        'exclude-not-start': true,
        'exclude-ended': true
      }
    })
    // normalize信息
    const service = new schema.Entity('service')
    const user = new schema.Entity('user')
    const quotaActivity = new schema.Entity('quotaActivity', {
      service,
      user
    })
    for (const data of respActivity.data.results) {
      const normalizedData = normalize(data, quotaActivity)
      context.commit('storeTable', {
        table: context.state.tables.fedQuotaActivityTable,
        tableObj: normalizedData.entities.quotaActivity
      })
    }
  },
  /* tables */

  /* dialogs */
  // 修改quota申请
  editQuotaApplicationDialog (context, payload: { apply_id: string; isGroup?: boolean }) {
    Dialog.create({
      component: QuotaApplicationEditCard,
      componentProps: {
        applyId: payload.apply_id,
        isGroup: payload.isGroup
      }
    }).onOk(async (val: {
      data: {
        service_id: string;
        private_ip: number;
        public_ip: number;
        vcpu: number;
        ram: number;
        disk_size: number;
        duration_days: number;
        company: string;
        contact: string;
        purpose: string
      }
    }) => {
      const respPatchApplyQuota = await api.apply.patchApplyQuota({
        path: { apply_id: payload.apply_id },
        body: val.data
      })
      if (respPatchApplyQuota.status === 200) {
        if (payload.isGroup) {
          // 补充vo_id字段
          Object.assign(respPatchApplyQuota.data, { vo_id: context.state.tables.groupQuotaApplicationTable.byId[payload.apply_id].vo_id })
        }
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        const normalizedData = normalize(respPatchApplyQuota.data, application)
        // 保存进table
        context.commit('storeTable', {
          table: payload.isGroup ? context.state.tables.groupQuotaApplicationTable : context.state.tables.personalQuotaApplicationTable,
          tableObj: normalizedData.entities.application
        })
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '修改配额申请成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /* 删除配额申请记录 */
  deleteQuotaApplicationDialog (context, payload: { apply_id: string; isGroup?: boolean }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '删除配额申请记录',
      message:
        '删除后的申请记录无法恢复。 确认删除此记录？',
      focus: 'cancel',
      ok: {
        label: '确认',
        push: false,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respDelete = await api.apply.deleteApplyQuota({ path: { apply_id: payload.apply_id } })
      if (respDelete.status === 204) {
        context.commit('deleteSingleObject', {
          table: payload.isGroup ? context.state.tables.groupQuotaApplicationTable : context.state.tables.personalQuotaApplicationTable,
          id: payload.apply_id
        })
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '配额申请已经删除',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /* 取消配额申请 */
  cancelQuotaApplicationDialog (context, payload: { apply_id: string; isGroup: boolean }) {
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '取消配额申请',
      message:
        '取消后的申请无法恢复。 确认取消此申请？',
      focus: 'cancel',
      ok: {
        label: '确认',
        push: false,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: '放弃',
        push: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async () => {
      const respPostApplyQuotaCancel = await api.apply.postApplyQuotaCancel({ path: { apply_id: payload.apply_id } })
      if (respPostApplyQuotaCancel.status === 200) {
        if (payload.isGroup) {
          // 补充vo_id字段
          Object.assign(respPostApplyQuotaCancel.data, { vo_id: context.rootState.server.tables.groupQuotaApplicationTable.byId[payload.apply_id]?.vo_id })
        }
        // normalize
        const service = new schema.Entity('service')
        const application = new schema.Entity('application', { service })
        const normalizedData = normalize(respPostApplyQuotaCancel.data, application)
        // 存入table
        context.commit('storeTable', {
          table: payload.isGroup ? context.state.tables.groupQuotaApplicationTable : context.state.tables.personalQuotaApplicationTable,
          tableObj: normalizedData.entities.application
        })
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'mdi-check-circle',
          textColor: 'light-green',
          message: '取消配额申请成功',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  /*  提交配额申请 */
  async submitApplyQuota (context, data: { vo_id?: string; service_id: string; private_ip?: number; public_ip?: number; vcpu?: number; ram?: number; disk_size?: number; duration_days: number; company?: string; contact?: string; purpose?: string }) {
    // const respPostApplyQuota = await context.dispatch('postApplyQuota', { data })
    const respPostApplyQuota = await api.apply.postApplyQuota({ body: data })
    if (respPostApplyQuota.status === 201) {
      if (data.vo_id) {
        // 如果是组配额，则需要补充vo_id字段,响应里是vo对象，再加一个vo_id字段
        Object.assign(respPostApplyQuota.data, { vo_id: respPostApplyQuota.data.vo.id })
      }
      // normalize
      const service = new schema.Entity('service')
      const vo = new schema.Entity('vo')
      const application = new schema.Entity('application', {
        service,
        vo
      })
      const normalizedData = normalize(respPostApplyQuota.data, application)
      // store
      context.commit('storeTable', {
        table: data.vo_id ? context.state.tables.groupQuotaApplicationTable : context.state.tables.personalQuotaApplicationTable,
        tableObj: normalizedData.entities.application
      })
      // data.vo_id ? context.commit('storeGroupQuotaApplicationTable', normalizedData.entities.application) : context.commit('storeUserQuotaApplicationTable', normalizedData.entities.application)
      // notify
      Notify.create({
        classes: 'notification-positive shadow-15',
        icon: 'mdi-check-circle',
        textColor: 'light-green',
        message: '提交配额申请成功',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
      // 跳转
      // @ts-ignore
      data.vo_id ? this.$router.push('/my/group/quota/application') : this.$router.push('/my/personal/quota/application')
    }
  },
  // 领取活动赠送配额
  async claimActivityQuotaDialog (context, activityId: string) {
    const respQuota = await api.quota_activity.getQuotaActivityGet({ path: { id: activityId } })
    // const resp = {
    //   data: {
    //     quota_id: '15ec9dd6-e543-11eb-bd38-c8009fe2eb03'
    //   },
    //   status: 200,
    //   statusText: 'OK'
    // }

    // code 200 -> 正确领取：1.提示领取成功 2.更新personalQuotaTable(更新领取的新配额)和fedQuotaActivityTable(更新剩余数量)
    if (respQuota.status === 200) {
      // 提示成功
      Dialog.create({
        class: 'dialog-positive',
        title: '成功',
        message:
          '配额领取成功',
        ok: {
          label: '确认',
          push: false,
          flat: true,
          unelevated: true,
          color: 'primary'
        }
      })
      // 强制更新table
      void context.dispatch('server/loadFedQuotaActivityTable', null, { root: true })
      void context.dispatch('server/loadPersonalQuotaTable', null, { root: true })
    } /* else {
      // code error -> 领取出错：提示错误
      Dialog.create({
        class: 'dialog-negative',
        title: '抱歉',
        message:
        respQuota.response.data.message, // 真正信息在respQuota.response.data里面
        ok: {
          label: '确认',
          push: false,
          flat: true,
          unelevated: true,
          color: 'primary'
        }
      })
    } */
  }

  /* dialogs */
}

export default actions
