<template>
  <div class="ServerDetailCard">
    <div class="column items-center justify-center ">
      <div class="col">

        <div class="row">

          <div class="col title-area">
            <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                   @click="goBack"/>
            云主机详情
          </div>

        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row">

          <div v-if="!server || !service || !vpn" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col content-area">
            <div class="row justify-center items-start q-pt-md">
              <div class="col-4">
                <div class="row items-center">
                  <q-btn
                    class="col-shrink text-h4 text-bold" flat padding="none" color="primary"
                    @click="clickToCopy(server.ipv4)">{{ server.ipv4 }}
                    <q-tooltip>
                      复制
                    </q-tooltip>
                    <!--创建时间距离当下小于1小时则打上new标记-->
                    <q-badge v-if="(new Date() - new Date(server.creation_time)) < 1000 * 60 * 60 * 1 "
                             color="light-green" floating transparent rounded align="middle">new
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

                    <q-btn class="col-shrink q-px-xs" flat dense icon="edit" size="sm" color="primary"
                           @click="$store.dispatch('vm/editServerNoteDialog',{serverId:server.id, isGroup})">
                      <q-tooltip>
                        编辑备注
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>

              <div class="col q-gutter-lg">
                <q-btn v-if="server.status==1"
                       :disable="!server.status"
                       unelevated flat padding="none" size="lg" color="primary" icon="computer"
                       @click="$store.dispatch('vm/gotoVNC',server.id)">
                  <q-tooltip>
                    远程控制
                  </q-tooltip>
                </q-btn>
                <q-btn v-else
                       :disable="!server.status"
                       unelevated color="grey-5" flat padding="none" size="lg" icon="computer">
                  <q-tooltip>
                    请开机以使用远程控制
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 1"
                       color="nord4" icon="play_arrow" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{serverId: server.id, action: 'start', isGroup})">
                  <q-tooltip>
                    开机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="power_settings_new" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{ serverId: server.id, action: 'shutdown', isGroup})">
                  <q-tooltip>
                    关机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="restart_alt" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{ serverId: server.id, action: 'reboot', isGroup})">
                  <q-tooltip>
                    重启
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="power_off" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{serverId: server.id, action: 'poweroff', isGroup})">
                  <q-tooltip>
                    强制断电
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 1"
                       color="nord4" icon="delete" text-color="red"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{ serverId: server.id, action: 'delete', isGroup})">
                  <q-tooltip>
                    删除
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status"
                       color="nord4" icon="delete_forever" text-color="red"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/serverOperationDialog',{ id: server.id, action: 'delete_force', isGroup})">
                  <q-tooltip>
                    强制删除
                  </q-tooltip>
                </q-btn>
              </div>
            </div>

            <div class="row justify-center q-pt-xl ">
              <div class="col-4">

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">初始用户名</div>
                  <div class="col">
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

                <div class="row q-pb-md items-center">
                  <div class="col-3 text-grey">初始密码</div>
                  <div class="col-shrink">
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input
                      :input-style="{width:`${server.default_password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                      v-model="server.default_password" readonly borderless dense
                      :type="isPwd ? 'password' : 'text'">
                      <template v-slot:append>
                        <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" @click="isPwd = !isPwd"/>
                        <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                               @click="clickToCopy(server.default_password, true)">
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
                  <div class="col-3 text-grey ">VPN用户名</div>
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
                  <div class="col-3 text-grey">VPN密码</div>

                  <div class="col-shrink">
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input :input-style="{width:`${vpn.password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
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
                               @click="$store.dispatch('vm/popEditVpnPass',  vpn)">
                          <q-tooltip>
                            修改
                          </q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>

                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN配置文件</div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                           @click="$store.dispatch('vm/fetchConfig', server.service)"/>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-3 text-grey">VPN CA证书</div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="$store.dispatch('vm/fetchCa', server.service)"/>
                  </div>
                </div>

              </div>

              <div class="col-4">
                <div v-if="isGroup" class="row q-pb-md items-center">
                  <div class="col-2 text-grey">所属组</div>
                  <div class="col-shrink">
                    <q-btn flat dense color="primary" padding="none"
                           :to="{path:  `/my/group/detail/${$store.state.group.tables.groupTable.byId[server.vo_id].id}`}">
                      {{ $store.state.group.tables.groupTable.byId[server.vo_id].name }}
                      <q-tooltip>
                        项目组详情
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">所用配额</div>
                  <div class="col-shrink">

                    <div v-if="quota">
                      <q-btn label="配额详情" flat dense color="primary" padding="none"
                             :to="{path: isGroup ? `/my/group/quota/detail/${quota?.id}` : `/my/personal/quota_detail/${quota?.id}`}">
                        <q-tooltip>
                          配额详情
                        </q-tooltip>
                      </q-btn>
                      <!--                      {{ quota?.display }}-->
                    </div>

                    <div v-else>所用配额已删除</div>

                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">可用期</div>
                  <div class="col"> {{ new Date(server.creation_time).toLocaleString() }} -
                    {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString() : '永久有效' }}
                  </div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">云主机ID</div>
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
                  <div class="col-2 text-grey">配置</div>
                  <div class="col"> {{ server.vcpus }}核 / {{ server.ram / 1024 }}GB</div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">IP类型</div>
                  <div class="col"> {{ server.public_ip ? '公网' : '私网' }}</div>
                </div>

                <div class="row q-pb-md items-center">
                  <div class="col-2 text-grey">系统镜像</div>
                  <div class="col"> {{ server.image }}</div>
                </div>

                <div v-if="server.image_desc" class="row q-pb-md">
                  <div class="col-2 text-grey">系统描述</div>
                  <div class="col"> {{ server.image_desc }}</div>
                </div>

              </div>

              <div class="col-4">

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">所属机构</div>
                  <div class="col">
                    {{ $store.state.vm.tables.globalDataCenterTable.byId[service.data_center]?.name }}
                  </div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">服务节点</div>
                  <div class="col"> {{ service.name }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">服务类型</div>
                  <div class="col"> {{ service.service_type }}</div>
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
import { useRouter } from 'vue-router'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import ServerStatus from 'components/Server/ServerStatus.vue'

export default defineComponent({
  name: 'ServerDetailCard',
  components: {
    ServerStatus
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
    const $router = useRouter()

    // todo 未传参id时，跳转处理
    // if (!props.serverId) {
    //   void $router.push({ path: '/my/personal/server' })
    // }

    // server info
    const server = computed(() => props.isGroup ? $store.state.vm.tables.groupServerTable.byId[props.serverId] : $store.state.vm.tables.userServerTable.byId[props.serverId])
    // service info
    const service = computed(() => $store.state.vm.tables.globalServiceTable.byId[server.value.service])
    // quota info
    const quota = computed(() => props.isGroup ? $store.state.vm.tables.groupQuotaTable.byId[server.value.user_quota] : $store.state.vm.tables.userQuotaTable.byId[server.value.user_quota])
    // vpn info todo groupVpnTable
    const vpn = computed(() => $store.state.vm.tables.userVpnTable.byId[server.value.service])

    // password可见性
    const isPwd = ref(true)
    // VPN password可见性
    const isPwdVpn = ref(true)

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }
    return {
      server,
      service,
      quota,
      vpn,
      isPwd,
      isPwdVpn,
      clickToCopy,
      goBack
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
