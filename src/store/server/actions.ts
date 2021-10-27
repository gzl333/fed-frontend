import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ServerModuleInterface } from './state'
import { $api, apiBaseFed } from 'boot/api'
import { normalize, schema } from 'normalizr'
import { ServerInterface, VpnInterface } from 'src/store/server/state'
import { Dialog, Notify } from 'quasar'
import QuotaApplicationEditCard from 'components/Quota/QuotaApplicationEditCard.vue'
import { i18n } from 'boot/i18n'
import { axios } from 'boot/axios'
import ServerDeleteDialog from 'components/Server/ServerDeleteDialog.vue'
import ServerRebuildDialog from 'components/Server/ServerRebuildDialog.vue'

// 云主机状态码参考。具体显示位置写在SererStatus组件里
/* const statusCodeMap = new Map<number, string>(
  [
    [0, '无法获取状态'],
    [1, '运行中'],
    [2, '已屏蔽'],
    [3, '已暂停'],
    [4, '正在关机'],
    [5, '已关机'],
    [6, '已崩溃'],
    [7, '被电源管理器挂起'],
    [9, '与宿主机通讯失败'],
    [10, '已丢失'],
    [11, '正在创建'],
    [12, '创建失败']
  ]
) */

const actionMap = new Map<string, string>(
  [
    ['start', '开机'],
    ['reboot', '重启'],
    ['shutdown', '关机'],
    ['poweroff', '强制断电'],
    ['delete', '删除'],
    ['delete_force', '强制删除']
  ]
)

const actions: ActionTree<ServerModuleInterface, StateInterface> = {
  /* 杂项 */
  // 打开vnc
  async gotoVNC (context, id: string) {
    const response = await $api.server.getServerVnc({ path: { id } })
    const url = response.data.vnc.url
    window.open(url)
  },
  // 下载vpn ca
  fetchCa (context, serviceId: string) {
    const url = apiBaseFed + '/vpn/' + serviceId + '/ca/'
    window.open(url)
  },
  // 下载vpn config
  fetchConfig (context, serviceId: string) {
    const url = apiBaseFed + '/vpn/' + serviceId + '/config/'
    window.open(url)
  },
  /* 杂项 */

  /* tables */
  async loadFedFlavorTable (context) {
    context.commit('clearTable', context.state.tables.fedFlavorTable)
    const respFlavor = await $api.flavor.getFlavor()
    for (const flavor of respFlavor.data.flavors) {
      context.commit('storeTable', {
        table: context.state.tables.fedFlavorTable,
        tableObj: { [flavor.id]: flavor }
      })
    }
  },
  async loadServiceNetworkTable (context) {
    for (const serviceId of context.rootState.fed.tables.serviceTable.allIds) {
      const respNetwork = await $api.network.getNetwork({ query: { service_id: serviceId } })
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
      const respImage = await $api.image.getImage({ query: { service_id: serviceId } })
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
      if (context.rootState.fed.tables.serviceTable.byId[serviceId]?.need_vpn) {
        const respVpn = await $api.vpn.getVpn({ path: { service_id: serviceId } })
        Object.assign(respVpn.data.vpn, { id: serviceId })
        context.commit('storeTable', {
          table: context.state.tables.userVpnTable,
          tableObj: { [serviceId]: respVpn.data.vpn }
        })
      }
    }
  },
  async loadPersonalQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.personalQuotaTable)
    // 将响应normalize
    const respQuota = await $api.quota.getQuota({ query: { deleted: false } })
    const service = new schema.Entity('service')
    const quota = new schema.Entity('quota', { service })
    // quota数组
    for (const data of respQuota.data.results) {
      /* 增加补充字段 */
      // 获取quota下对应的server列表
      const respQuotaServers = await $api.quota.getQuotaServers({ path: { id: data.id } })
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
    const respServer = await $api.server.getServer()
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
        isGroup: false,
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
      const respGroupServer = await $api.server.getServerVo({ path: { vo_id: groupId } })
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
    }
    // 建立groupServerTable之后，分别更新每个server status, 并发更新，无需await
    for (const serverId of context.state.tables.groupServerTable.allIds) {
      void context.dispatch('loadSingleServerStatus', {
        isGroup: true,
        serverId
      })
    }
  },
  // 获取并保存单个server的status
  async loadSingleServerStatus (context, payload: {
    // table: {
    //   byId: Record<string, ServerInterface> // 此处固定为ServerInterface
    //   allIds: string[]
    //   isLoaded: boolean
    // }
    isGroup: boolean
    serverId: string
  }) {
    const table = payload.isGroup ? context.state.tables.groupServerTable : context.state.tables.personalServerTable
    // 先清空server status，让状态变为空，UI则显示为获取中
    context.commit('storeSingleServerStatus', {
      table,
      serverId: payload.serverId,
      status_code: '' // 有状态的状态码为integer
    })
    const respStatus = await $api.server.getServerStatus({ path: { id: payload.serverId } })
    context.commit('storeSingleServerStatus', {
      table,
      serverId: payload.serverId,
      status_code: respStatus.data.status.status_code
    })
  },
  // 更新单个server的信息
  async loadSingleServer (context, payload: { serverId: string; isGroup: boolean }) {
    const respSingleServer = await $api.server.getServerId({ path: { id: payload.serverId } })
    // 将响应normalize，存入state里的userServerTable
    const service = new schema.Entity('service')
    const user_quota = new schema.Entity('user_quota')
    const server = new schema.Entity('server', {
      service,
      user_quota
    })
    const normalizedData = normalize(respSingleServer.data.server, server)
    if (payload.isGroup) {
      context.commit('storeTable', {
        table: context.state.tables.groupServerTable,
        tableObj: normalizedData.entities.server
      })
      void context.dispatch('loadSingleServerStatus', {
        isGroup: true,
        serverId: payload.serverId
      })
    } else {
      context.commit('storeTable', {
        table: context.state.tables.personalServerTable,
        tableObj: normalizedData.entities.server
      })
      void context.dispatch('loadSingleServerStatus', {
        isGroup: false,
        serverId: payload.serverId
      })
    }
  },
  // 所有groupQuota根据quotaId存在一个对象里，不区分group，getter里区分group取
  async loadGroupQuotaTable (context) {
    // 先清空table，避免多次更新时数据累加（凡是需要强制刷新的table，都要先清空再更新）
    context.commit('clearTable', context.state.tables.groupQuotaTable)
    // 根据groupTable,建立groupQuotaTable
    for (const groupId of context.rootState.account.tables.groupTable.allIds) {
      // 获取响应
      const respGroupQuota = await $api.quota.getQuotaVo({ path: { vo_id: groupId } })
      // 将响应normalize
      const service = new schema.Entity('service')
      const quota = new schema.Entity('quota', { service })
      // quota数组
      for (const data of respGroupQuota.data.results) {
        /* 增加补充字段 */
        // 补充vo_id字段
        Object.assign(data, { vo_id: groupId })
        // 获取quota下对应的server列表
        const respQuotaServers = await $api.quota.getQuotaServers({ path: { id: data.id } })
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
    const respApply = await $api.apply.getApplyQuota({ query: { deleted: false } }) // 不包含已删除的申请
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
        const respGroupApplication = await $api.apply.getApplyQuotaVo({
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
    const respActivity = await $api.quota_activity.getQuotaActivity({
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
  // 修改server.lock的operation状态( lock-delete <-> lock-operation )
  async toggleOperationLock (context, payload: { serverId: string; isGroup: boolean }) {
    const lock = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId]?.lock : context.state.tables.personalServerTable.byId[payload.serverId]?.lock
    const newLock = lock === 'lock-operation' ? 'lock-delete' : 'lock-operation'
    const respPostServerLock = await $api.server.postServerLock({
      query: { lock: newLock },
      path: { id: payload.serverId }
    })
    if (respPostServerLock.status === 200) {
      context.commit('storeField', {
        table: payload.isGroup ? context.state.tables.groupServerTable : context.state.tables.personalServerTable,
        id: payload.serverId,
        field: 'lock',
        value: respPostServerLock.data.lock
      })
    }
  },
  // 修改server.lock的delete状态 ( free <-> lock-delete )
  async toggleDeleteLock (context, payload: { serverId: string; isGroup: boolean }) {
    const lock = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId]?.lock : context.state.tables.personalServerTable.byId[payload.serverId]?.lock
    const newLock = lock === 'free' ? 'lock-delete' : 'free'
    const respPostServerLock = await $api.server.postServerLock({
      query: { lock: newLock },
      path: { id: payload.serverId }
    })
    if (respPostServerLock.status === 200) {
      context.commit('storeField', {
        table: payload.isGroup ? context.state.tables.groupServerTable : context.state.tables.personalServerTable,
        id: payload.serverId,
        field: 'lock',
        value: respPostServerLock.data.lock
      })
    }
  },
  // 修改server.lock的delete状态为lock-delete ( -> lock-delete )
  async toggleDeleteLockToLock (context, payload: { serverId: string; isGroup: boolean }) {
    const newLock = 'lock-delete'
    const respPostServerLock = await $api.server.postServerLock({
      query: { lock: newLock },
      path: { id: payload.serverId }
    })
    if (respPostServerLock.status === 200) {
      context.commit('storeField', {
        table: payload.isGroup ? context.state.tables.groupServerTable : context.state.tables.personalServerTable,
        id: payload.serverId,
        field: 'lock',
        value: respPostServerLock.data.lock
      })
    }
  },
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
      const respPatchApplyQuota = await $api.apply.patchApplyQuota({
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
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功修改配额申请',
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
      const respDelete = await $api.apply.deleteApplyQuota({ path: { apply_id: payload.apply_id } })
      if (respDelete.status === 204) {
        context.commit('deleteSingleItem', {
          table: payload.isGroup ? context.state.tables.groupQuotaApplicationTable : context.state.tables.personalQuotaApplicationTable,
          id: payload.apply_id
        })
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功删除配额申请',
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
      const respPostApplyQuotaCancel = await $api.apply.postApplyQuotaCancel({ path: { apply_id: payload.apply_id } })
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
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功取消配额申请',
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
    const respPostApplyQuota = await $api.apply.postApplyQuota({ body: data })
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
        icon: 'check_circle',
        textColor: 'light-green',
        message: '成功提交配额申请',
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
      // jump 成功才跳转
      // @ts-ignore
      data.vo_id ? this.$router.push('/my/group/quota/application') : this.$router.push('/my/personal/quota/application')
    }
  },
  // 领取活动赠送配额
  async claimActivityQuotaDialog (context, activityId: string) {
    const respQuota = await $api.quota_activity.getQuotaActivityGet({ path: { id: activityId } })
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
  },
  // 修改vpn密码
  popEditVpnPass (context, vpn: VpnInterface) {
    Dialog.create({
      class: 'dialog-primary',
      title: `修改${context.rootState.fed.tables.serviceTable.byId[vpn.id].name}的VPN密码`,
      message: '新密码长度为6-64位',
      prompt: {
        model: `${vpn.password}`,
        counter: true,
        maxlength: 64,
        isValid: (val: string) => {
          return !(val.trim().length < 6 || val.trim().length > 64)
        },
        type: 'text' // optional
      },
      color: 'primary',
      ok: {
        label: i18n.global.tc('确认'),
        push: false,
        // flat: true,
        outline: true,
        color: 'primary'
      },
      cancel: {
        label: i18n.global.tc('放弃'),
        push: false,
        flat: false,
        unelevated: true,
        color: 'primary'
      }
    }).onOk(async (data: string) => {
      const payload = {
        serviceId: vpn.id,
        password: data.trim()
      }
      const respPatchVpnPassword = await $api.vpn.patchVpn({
        path: { service_id: payload.serviceId },
        body: { password: payload.password }
      })
      if (respPatchVpnPassword.status === 200) {
        context.commit('storeTable', {
          table: context.state.tables.userVpnTable,
          tableObj: { [payload.serviceId]: Object.assign(respPatchVpnPassword.data.vpn, { id: vpn.id }) }
        })
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功修改VPN密码',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  // 操作云主机实例时，向endpoint_url发请求； 进行其他云联邦操作时向每个前端部署对应的后端（例如vms）发请求
  // todo 细分各种操作;重命名为triggerXxxDialog
  serverOperationDialog (context, payload: { serverId: string; action: string; isGroup?: boolean; isJump?: boolean }) {
    // 所有操作都要用的信息
    const server = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId] : context.state.tables.personalServerTable.byId[payload.serverId]
    // 去掉协议
    const endpoint_url = server.endpoint_url.substr(server.endpoint_url.indexOf('//'))
    // 判断结尾有没有'/'，并加上当前用户使用的协议
    // 以下写法失败, 二元选择问号前都是条件
    // const api = window.location.protocol + endpoint_url.endsWith('/') ? endpoint_url + 'api/server/' + payload.serverId + '/action' : endpoint_url + '/api/server/' + payload.serverId + '/action'
    const api = window.location.protocol + (endpoint_url.endsWith('/') ? endpoint_url + 'api/server/' + payload.serverId + '/action' : endpoint_url + '/api/server/' + payload.serverId + '/action')
    const data = { action: payload.action }

    // 执行操作的函数。delete/force_delete不用。start直接用。其他经dialog确认后用。
    const executeOperation = async () => {
      // 将主机状态清空，界面将显示loading
      if (payload.isGroup) {
        context.commit('storeSingleServerStatus', {
          table: context.state.tables.groupServerTable,
          serverId: payload.serverId,
          status_code: ''
        })
      } else {
        context.commit('storeSingleServerStatus', {
          table: context.state.tables.personalServerTable,
          serverId: payload.serverId,
          status_code: ''
        })
      }

      try {
        await axios.post(api, data)
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新单个server status
        void context.dispatch('loadSingleServerStatus', {
          isGroup: payload.isGroup,
          serverId: payload.serverId
        })
        // todo 比对新老状态，发送通知
        // const newStatus = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId]?.status : context.state.tables.personalServerTable.byId[payload.serverId]?.status
      } catch {
        // 若请求失败则应更新单个server status
        void context.dispatch('loadSingleServerStatus', {
          isGroup: payload.isGroup,
          serverId: payload.serverId
        })
      }
    }

    // 各种操作分类
    if (payload.action === 'delete' || payload.action === 'delete_force') {
      Dialog.create({
        component: ServerDeleteDialog,
        componentProps: {
          action: payload.action,
          serverId: payload.serverId,
          isGroup: payload.isGroup
        }
      }).onOk(async () => {
        // 将主机状态清空，界面将显示loading
        if (payload.isGroup) {
          context.commit('storeSingleServerStatus', {
            table: context.state.tables.groupServerTable,
            serverId: payload.serverId,
            status_code: ''
          })
        } else {
          context.commit('storeSingleServerStatus', {
            table: context.state.tables.personalServerTable,
            serverId: payload.serverId,
            status_code: ''
          })
        }
        try {
          // 发送请求
          await axios.post(api, data)
          // 如果删除主机，重新获取userServerTable或groupServerTable
          Notify.create({
            classes: 'notification-positive shadow-15',
            textColor: 'positive',
            // spinner: true,
            icon: 'check_circle',
            message: `成功删除云主机: ${server.ipv4 || ''}`,
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
          // // 应延时
          // void await new Promise(resolve => (
          //   setTimeout(resolve, 1000)
          // ))
          // 更新userServerTable或groupServerTable // 可以优化成直接删除
          payload.isGroup ? void context.dispatch('loadGroupServerTable') : void context.dispatch('loadPersonalServerTable')
          // 更新personal/group quotaTable, 删除了server，对应quota里面servers字段也更新了。// 可以优化成直接删除
          payload.isGroup ? void context.dispatch('loadGroupQuotaTable') : void context.dispatch('loadPersonalQuotaTable')
          // 是否跳转
          if (payload.isJump) {
            // @ts-ignore
            this.$router.back()
          }
        } catch {
          // 若请求失败则应更新单个server status
          void context.dispatch('loadSingleServerStatus', {
            isGroup: payload.isGroup,
            serverId: payload.serverId
          })
        }
      })
    } else if (payload.action === 'start') {
      void executeOperation()
    } else {
      Dialog.create({
        class: 'dialog-primary',
        title: `${i18n.global.tc(actionMap.get(payload.action) as string) || ''}`,
        focus: 'cancel',
        message:
          '确认执行？',
        ok: {
          label: i18n.global.tc('确认'),
          push: false,
          // flat: true,
          outline: true,
          color: 'primary'
        },
        cancel: {
          label: i18n.global.tc('取消'),
          push: false,
          flat: false,
          unelevated: true,
          color: 'primary'
        }
      }).onOk(executeOperation)
    }
  },
  // 编辑云主机备注
  editServerNoteDialog (context, payload: { serverId: string; isGroup?: boolean }) {
    Dialog.create({
      class: 'dialog-primary',
      title: `编辑${payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId].ipv4 : context.state.tables.personalServerTable.byId[payload.serverId].ipv4}的备注信息`,
      // message: '长度限制为40个字',
      prompt: {
        model: `${payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId].remarks : context.state.tables.personalServerTable.byId[payload.serverId].remarks}`,
        counter: true,
        maxlength: 40,
        type: 'text' // optional
      },
      color: 'primary',
      cancel: true
    }).onOk(async (data: string) => {
      const respPatchRemark = await $api.server.patchServerRemark({
        path: { id: payload.serverId },
        query: { remark: data.trim() }
      })
      if (respPatchRemark.status === 200) {
        if (payload.isGroup) {
          context.commit('storeSingleServerRemarks', {
            table: context.state.tables.groupServerTable,
            serverId: payload.serverId,
            remarks: respPatchRemark.data.remarks
          })
        } else {
          context.commit('storeSingleServerRemarks', {
            table: context.state.tables.personalServerTable,
            serverId: payload.serverId,
            remarks: respPatchRemark.data.remarks
          })
        }
        // 弹出通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功修改云主机备注为: ' + respPatchRemark.data.remarks,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      }
    })
  },
  triggerDeleteQuotaDialog (context, payload: { quotaId: string; isGroup?: boolean; isJump?: boolean }) {
    // todo 删除配额对话框再详细
    // 操作的确认提示
    Dialog.create({
      class: 'dialog-primary',
      title: '删除配额',
      message:
        '删除后的配额无法恢复。 确认删除此配额？',
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
      const respDelete = await $api.quota.deleteQuota({ path: { id: payload.quotaId } })
      if (respDelete.status === 204) {
        // 更新personal/group QuotaTable
        context.commit('deleteSingleItem', {
          table: payload.isGroup ? context.state.tables.groupQuotaTable : context.state.tables.personalQuotaTable,
          id: payload.quotaId
        })
        // 通知
        Notify.create({
          classes: 'notification-positive shadow-15',
          icon: 'check_circle',
          textColor: 'light-green',
          message: '成功删除配额',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        // 是否跳转
        if (payload.isJump) {
          // @ts-ignore
          this.$router.back()
        }
      }
    })
  },
  triggerServerRebuildDialog (context, payload: { serverId: string, isGroup?: boolean }) {
    Dialog.create({
      component: ServerRebuildDialog,
      componentProps: {
        serverId: payload.serverId,
        isGroup: payload.isGroup
      }
    }).onOk(async (image_id: string) => {
      const server = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId] : context.state.tables.personalServerTable.byId[payload.serverId]
      // 去掉协议
      const endpoint_url = server.endpoint_url.substr(server.endpoint_url.indexOf('//'))
      const api = window.location.protocol + (endpoint_url.endsWith('/') ? endpoint_url + 'api/server/' + payload.serverId + '/rebuild' : endpoint_url + '/api/server/' + payload.serverId + '/rebuild')
      const data = { image_id }
      // notify
      Notify.create({
        classes: 'notification-positive shadow-15',
        textColor: 'positive',
        spinner: true,
        message: `正在重建云主机: ${server.ipv4 || ''}`,
        position: 'bottom',
        closeBtn: true,
        timeout: 5000,
        multiLine: false
      })
      // 发送请求
      const respPostServerRebuild = await axios.post(api, data)
      // console.log(payload.serverId, api, data)
      if (respPostServerRebuild.status === 202) {
        // 应延时
        void await new Promise(resolve => (
          setTimeout(resolve, 5000)
        ))
        // 更新该server
        void await context.dispatch('loadSingleServer', {
          serverId: payload.serverId,
          isGroup: payload.isGroup
        })
        // notify
        const newServer = payload.isGroup ? context.state.tables.groupServerTable.byId[payload.serverId] : context.state.tables.personalServerTable.byId[payload.serverId]
        if (newServer.image_id === image_id) {
          Notify.create({
            classes: 'notification-positive shadow-15',
            textColor: 'positive',
            icon: 'check_circle',
            message: `成功重建云主机: ${server.ipv4 || ''}`,
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
        } else {
          // 可能重建失败，也可能是延时超过上面的5000
        }
        // jump 成功才跳转
        // @ts-ignore
        // payload.isGroup ? this.$router.push(`/my/group/server/detail/${payload.serverId}`) : this.$router.push(`/my/personal/server/detail/${payload.serverId}`)
      }
    })
  }
  /* dialogs */
}

export default actions
