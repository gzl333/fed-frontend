<template>
  <div class="ServerDetailCard">
    <div class="column items-center justify-center ">
      <div class="col">

        <div class="row items-center title-area">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="$router.back()"/>
          <span v-if="isGroup">项目组云主机详情</span>
          <span v-else>个人云主机详情</span>
        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row">

          <div v-if="!server || !service || (service.need_vpn && !vpn) " class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col content-area">
            <div class="row justify-center items-start q-pt-md">
              <div class="col-4">
                <div class="row items-center q-pt-xs">
                  <q-btn
                    class="col-shrink text-h4 text-bold" flat no-caps padding="none" color="primary"
                    @click="clickToCopy(server.ipv4)">{{ server.ipv4 }}
                    <q-tooltip>
                      复制
                    </q-tooltip>
                    <!--创建时间距离当下小于1小时则打上new标记-->
                    <q-badge style="top:-10px;"
                             v-if="(new Date() - new Date(server.creation_time)) < 1000 * 60 * 60 * 1 "
                             color="light-green" floating transparent rounded align="middle">
                      new
                    </q-badge>
                  </q-btn>

                  <ServerStatus :server="server" :is-group="isGroup"/>

                </div>
                <div class="row q-pb-md items-center">
                  <!--                  <div class="col-2 text-grey">备注</div>-->
                  <div class="col-auto">
                    <span>
                      {{ server.remarks }}
                      <q-tooltip>备注</q-tooltip>
                    </span>

                    <q-btn v-if="!isGroup || isGroup && myRole!=='member'"
                           :disable="toggle"
                           class="col-shrink q-px-xs" flat dense icon="edit" size="sm" color="primary"
                           @click="$store.dispatch('server/editServerNoteDialog',{serverId:server.id, isGroup})">
                      <q-tooltip>
                        编辑备注
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>

              <div class="col q-gutter-lg">

                <q-toggle
                  style="margin-left: 10px;"
                  v-model="toggle"
                  checked-icon="lock"
                  unchecked-icon="lock_open"
                  color="light-green"
                  size="lg"
                  @click=" $store.dispatch('server/toggleOperationLock', {isGroup:isGroup, serverId: serverId })"
                >
                  <q-tooltip v-if="server.lock === 'lock-operation'">
                    {{ $t('已锁定云主机操作') }}
                  </q-tooltip>
                  <q-tooltip v-else>
                    {{ $t('未锁定云主机操作') }}
                  </q-tooltip>
                </q-toggle>

                <q-btn :disable="!server.status"
                       unelevated flat padding="none" size="lg" :color="server.status==1?'primary':'grey-5'"
                       icon="computer"
                       @click="server.status==1?$store.dispatch('server/gotoVNC',server.id):''">
                  <q-tooltip v-if="server.status==1">
                    远程控制
                  </q-tooltip>
                  <q-tooltip v-else>
                    请开机以使用远程控制
                  </q-tooltip>
                </q-btn>

                <!--loading button-->
                <q-btn v-if="!server.status" :loading="!server.status" color="primary" flat>
                  <q-tooltip>
                    {{ $t('获取中') }}
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status && server.status !== 1"
                       :disable="server.lock === 'lock-operation'"
                       icon="play_arrow" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'start', isGroup})">
                  <q-tooltip>
                    开机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status && server.status !== 5"
                       :disable="server.lock === 'lock-operation'"
                       icon="power_settings_new" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('server/serverOperationDialog',{ serverId: server.id, action: 'shutdown', isGroup})">
                  <q-tooltip>
                    关机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status && server.status !== 5"
                       :disable="server.lock === 'lock-operation'"
                       icon="restart_alt" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('server/serverOperationDialog',{ serverId: server.id, action: 'reboot', isGroup})">
                  <q-tooltip>
                    重启
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status && server.status !== 5"
                       :disable="server.lock === 'lock-operation'"
                       icon="power_off" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('server/serverOperationDialog',{serverId: server.id, action: 'poweroff', isGroup})">
                  <q-tooltip>
                    强制断电
                  </q-tooltip>
                </q-btn>

                <!--personal显示 || group不是member时显示-->

                <span v-if="!isGroup || isGroup && myRole!=='member'" class="q-gutter-lg">

                  <q-btn v-if="server.status"
                         :disable="server.lock === 'lock-operation'"
                         icon="build" text-color="primary"
                         unelevated flat padding="none" size="lg"
                         @click="$store.dispatch('server/triggerServerRebuildDialog',{ serverId: server.id,  isGroup})">
                    <q-tooltip>
                      重建云主机
                    </q-tooltip>
                  </q-btn>

                  <q-btn v-if="server.status && server.status !== 1"
                         :disable="server.lock === 'lock-operation'"
                         icon="delete" text-color="red"
                         unelevated flat padding="none" size="lg"
                         @click="$store.dispatch('server/serverOperationDialog',{ serverId: server.id, action: 'delete', isGroup, isJump: true})">
                    <q-tooltip>
                      删除
                    </q-tooltip>
                  </q-btn>

                  <q-btn v-if="server.status && server.status"
                         :disable="server.lock === 'lock-operation'"
                         icon="delete_forever" text-color="red"
                         unelevated flat padding="none" size="lg"
                         @click="$store.dispatch('server/serverOperationDialog',{ serverId: server.id, action: 'delete_force', isGroup, isJump: true})">
                    <q-tooltip>
                      强制删除
                    </q-tooltip>
                  </q-btn>

                </span>
              </div>
            </div>

            <div class="row justify-center q-pt-xl ">
              <div class="col-4">

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">系统初始用户名</div>
                  <div class="col-shrink">
                    <div v-if="server?.default_user === null || server?.default_user===''">
                      {{ $t('服务节点未提供') }}
                    </div>
                    <div v-else>
                      {{ server.default_user }}
                      <q-btn
                        class="col-shrink q-px-xs" flat color="primary" icon="content_copy" size="sm"
                        @click="clickToCopy(server.default_user)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">系统初始密码</div>
                  <div class="col-shrink">
                    <div v-if="server?.default_password === null || server?.default_password===''">
                      {{ $t('服务节点未提供') }}
                    </div>
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input v-else
                             :input-style="{width:`${server?.default_password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                             v-model="server.default_password" readonly borderless dense
                             :type="isPwd ? 'password' : 'text'">
                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" @click="isPwd = !isPwd"/>
                        <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                               @click="clickToCopy(server?.default_password, true)">
                          <q-tooltip>
                            复制
                          </q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>
                </div>

                <div v-if="!service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN</div>
                  <div class="col-auto">无需VPN连接</div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center ">
                  <div class="col-3 text-grey ">VPN 用户名</div>
                  <div class="col">
                    {{ vpn.username }}
                    <q-btn class="col-shrink q-px-xs" flat color="primary" icon="content_copy" size="sm"
                           @click="clickToCopy(vpn.username)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN 密码</div>

                  <div class="col-shrink">
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input :input-style="{width:`${vpn.password.length * (isPwdVpn?5:8)}px`, maxWidth: '200px', minWidth: '32px'}"
                             v-model="vpn.password" readonly borderless dense
                             :type="isPwdVpn ? 'password' : 'text'">
                      <template v-slot:append>
                        <q-icon :name="isPwdVpn ? 'visibility' : 'visibility_off'" @click="isPwdVpn = !isPwdVpn"/>
                        <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                               @click="clickToCopy(vpn.password, true)">
                          <q-tooltip>
                            复制
                          </q-tooltip>
                        </q-btn>
                        <q-btn icon="edit" size="sm" dense flat color="primary"
                               @click="$store.dispatch('server/popEditVpnPass',  vpn)">
                          <q-tooltip>
                            修改
                          </q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>

                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN 配置文件</div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                           @click="$store.dispatch('server/fetchConfig', server.service)"/>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN CA证书</div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="$store.dispatch('server/fetchCa', server.service)"/>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <!--                  <div class="col-3 text-grey">VPN 使用方法</div>-->
                  <!--                  <div class="col">-->
                  <q-btn label="查看VPN使用方法" class="" color="primary" padding="none" dense flat
                         @click="gotoManualVpn"/>
                  <!--                  </div>-->
                </div>

              </div>

              <div class="col-4">
                <div v-if="isGroup" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">所属组</div>
                  <div class="col-shrink">
                    <q-btn flat dense color="primary" padding="none"
                           :to="{path:  `/my/group/detail/${$store.state.account.tables.groupTable.byId[server.vo_id].id}`}">
                      {{ $store.state.account.tables.groupTable.byId[server.vo_id].name }}
                      <q-tooltip>
                        项目组详情
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div v-if="isGroup" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">我的角色</div>
                  <div class="col-shrink">
                    <group-role-chip :role="myRole"/>
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">关联配额</div>
                  <div class="col-shrink">

                    <div v-if="quota">
                      <q-btn label="配额详情" flat dense color="primary" padding="none"
                             :to="{path: isGroup ? `/my/group/quota/detail/${quota?.id}` : `/my/personal/quota/detail/${quota?.id}`}">
                        <q-tooltip>
                          配额详情
                        </q-tooltip>
                      </q-btn>
                      <!--                      {{ quota?.display }}-->
                    </div>

                    <div v-else>关联配额已删除</div>

                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">创建者</div>
                  <div class="col-shrink">
                    {{ server.user.username }}
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">创建时间</div>
                  <div class="col">
                    {{ new Date(server.creation_time).toLocaleString(locale) }}
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">到期时间</div>
                  <div class="col">
                    <div>
                      {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString(locale) : '永久有效' }}
                    </div>
                    <!--                    <q-icon-->
                    <!--                      v-if="server.expiration_time !== null && (new Date(server.expiration_time).getTime() - new Date().getTime()) < 0"-->
                    <!--                      name="help_outline" color="red" size="xs">-->
                    <!--                      <q-tooltip>{{ $t('云主机已到期') }}</q-tooltip>-->
                    <!--                    </q-icon>-->
                  </div>
                </div>

                <div class="row q-pb-md items-center" v-if="server.expiration_time">
                  <div class="col-3 text-grey">可用天数</div>
                  <div class="col">
                    {{
                      Math.ceil((new Date(server.expiration_time) - new Date(server.creation_time)) / (1000 * 60 * 60 * 24))
                    }}天
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">云主机ID</div>
                  <div class="col">
                    {{ server.id }}
                    <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                           @click="clickToCopy(server.id)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">硬件配置</div>
                  <div class="col"> {{ server.vcpus }}核CPU / {{ server.ram / 1024 }}GB内存</div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">IP地址类型</div>
                  <div class="col"> {{ server.public_ip ? '公网' : '私网' }}</div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">操作系统</div>
                  <div class="col">
                    <q-icon v-if="getOsIconName(server.image)" :name="getOsIconName(server.image)" flat size="md"/>
                    {{ server.image }}
                  </div>
                </div>

                <div v-if="server.image_desc" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">系统描述</div>
                  <div class="col"> {{ server.image_desc }}</div>
                </div>

              </div>

              <div class="col-4">

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">所属机构</div>
                  <div class="col">
                    {{ $store.state.fed.tables.dataCenterTable.byId[service.data_center]?.name }}
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">服务节点</div>
                  <div class="col"> {{ service.name }}</div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">服务类型</div>
                  <div class="col">

                    <q-icon
                      v-if="service.service_type.toLowerCase().includes('ev')"
                      name="img:svg/EVCloud-Logo-Horizontal.svg"
                      style="width: 130px;height: 25px"/>

                    <q-icon
                      v-if="service.service_type.toLowerCase().includes('open')"
                      name="img:svg/OpenStack-Logo-Horizontal.svg"
                      style="width: 130px;height: 25px"/>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import ServerStatus from 'components/Server/ServerStatus.vue'
import GroupRoleChip from 'components/Group/GroupRoleChip.vue'
import { useI18n } from 'vue-i18n'
import useGetOsIconName from 'src/hooks/useGetOsIconName'

export default defineComponent({
  name: 'ServerDetailCard',
  components: {
    ServerStatus,
    GroupRoleChip
  },
  props: {
    serverId: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // todo 未传参id时，跳转处理
    // if (!props.serverId) {
    //   void $router.push({ path: '/my/personal/server' })
    // }

    // server info
    const server = computed(() => props.isGroup ? $store.state.server.tables.groupServerTable.byId[props.serverId] : $store.state.server.tables.personalServerTable.byId[props.serverId])
    // service info
    const service = computed(() => $store.state.fed.tables.serviceTable.byId[server.value?.service])
    // quota info
    const quota = computed(() => props.isGroup ? $store.state.server.tables.groupQuotaTable.byId[server.value.user_quota] : $store.state.server.tables.personalQuotaTable.byId[server.value?.user_quota])
    // vpn info
    const vpn = computed(() => $store.state.server.tables.userVpnTable.byId[server.value?.service])

    // lock toggle
    const toggle = ref(computed(() => server.value.lock === 'lock-operation'))

    // 当前用户在group内的角色
    const myRole = computed(() => $store.state.account.tables.groupTable.byId[server.value?.vo_id || '']?.myRole)

    // password可见性
    const isPwd = ref(true)
    // VPN password可见性
    const isPwdVpn = ref(true)

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // 获取os的icon名称
    const getOsIconName = useGetOsIconName()

    const gotoManualVpn = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = computed(() => location.origin + (locale.value === 'zh' ? '/manual/vpn' : '/manual/en/vpn'))
      window.open(url.value)
    }

    return {
      locale,
      server,
      service,
      quota,
      vpn,
      toggle,
      myRole,
      isPwd,
      isPwdVpn,
      clickToCopy,
      getOsIconName,
      gotoManualVpn
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerDetailCard {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.content-area {
  width: $general-width-no-padding;
}

.ip-title {
  font-size: large;
  font-weight: bold;
}

.detail-item {
  padding-bottom: 10px;
}

.password-input {
  //top: -10px;
  //height: 10px;
  width: 175px;
}
</style>
