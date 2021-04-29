<template>
  <div class="Main">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <global-header class="content-fixed-width"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div class="column">
              <div class="col">
                <div class="row q-mt-md  text-h5 ">
                  <div class="q-pb-xs text-h6 ">联邦机构</div>
                </div>
                <q-separator/>
                <div class="row justify-center q-my-xs">
                  <div class="card">
                    <div class="row text-h6 q-ma-lg justify-center items-center ">
                      <q-icon name="foundation" size="1.5em" class="q-mr-md"/>
                      接入数据中心
                    </div>
                    <div class="row text-h4 q-ma-xl justify-center items-center text-bold text-primary">
                      {{ $store.state.vm.tables.globalDataCenterTable.allIds.length }}个
                    </div>
                  </div>
                  <div class="card">
                    <div class="row text-h6 q-ma-lg justify-center items-center ">
                      <q-icon name="timeline" size="1.5em" class="q-mr-md"/>
                      接入服务
                    </div>
                    <div class="row text-h4 q-ma-xl justify-center text-bold text-primary  ">{{ serviceNum }}个</div>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="row q-mt-md justify-between ">
                  <div class=" col q-pa-sm text-h6">在用云主机资源</div>
                  <q-btn class="col-1" label="更多云主机..." color="primary" flat dense padding="none"
                         :to="{ path: '/my/usage/vm' }"/>
                </div>

                <q-separator/>

                <div v-if="!servers">
                  所选择节点中无可供使用的云主机
                </div>

                <div v-else class="row justify-start ">

                  <!--一个云主机的card-->
                  <div class="col"  v-for="server in servers.slice(0,4)" :key="server">

                    <div class="row server-card q-my-md q-mx-md">

                      <div class="col-6">

                        <div v-if="server.status!=='运行中' && server.status!=='已关机'" class="row justify-center">
                          <q-btn loading flat label="......" icon="hourglass_bottom" size="2em">
                            <q-tooltip>
                              远程执行中，请稍候
                            </q-tooltip>
                          </q-btn>
                        </div>

                        <div v-if="server.status === '运行中'" class="row justify-center">
                          <q-btn v-if="server.status === '运行中'" flat @click="gotoVNC(server.id)">
                            <q-icon name="computer" size="4em" class="q-mx-md q-py-md">
                              <q-tooltip>点击进入远程控制</q-tooltip>
                            </q-icon>
                          </q-btn>
                        </div>

                        <div v-if="server.status === '已关机'" class="row justify-center">
                          <q-icon name="computer" disabled size="4em" class="q-mx-md q-py-md">
                            <q-tooltip>请开机以使用远程控制</q-tooltip>
                          </q-icon>
                        </div>

                      </div>

                      <div class="col-6">
                        <div class="column justify-center  q-mt-xs">

                          <div class="col q-mx-md">
                            <div class="row justify-center">
                              <q-btn
                                class="col"
                                :label="server.ipv4" flat dense padding="none" color="primary"
                                :to="{path:'/my/usage/vmdetail/' + server.id}"/>
                            </div>
                          </div>

                          <div class="col">
                            <div class="row justify-center">

                              <q-btn
                                class="col q-mx-md" flat
                                v-if="server.status!=='运行中' && server.status!=='已关机'"
                                color="nord4" loading label="......">
                                <q-tooltip>
                                  远程执行中，请稍候
                                </q-tooltip>
                              </q-btn>

                              <q-btn
                                class="col q-mx-md"
                                v-if="server.status === '已关机'"
                                outline color="primary" icon="play_arrow" size="md"
                                @click="vmOperation({
                            endPoint: server.endpoint_url,
                            id: server.id,
                            action: 'start',})"/>

                              <q-btn
                                class="col q-mx-md"
                                v-if="server.status === '运行中'"
                                outline color="primary" icon="power_settings_new" size="md"

                                @click="vmOperation({
                            endPoint: server.endpoint_url,
                            id: server.id,
                            action: 'shutdown',
                          })"/>

                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <!--一个云主机的card-->

                </div>
              </div>

              <div class="col">
                <div class="row q-mt-md  text-h5 ">
                  <div class="q-pa-sm text-h6 ">快捷入口</div>
                </div>
                <q-separator/>
                <div class="row justify-start">
                  <!-- 云主机card-->
                  <div class="quick-card q-my-lg q-mr-lg">
                    <div class="row">
                      <div class="col">
                        <q-icon name="laptop" size="6em" class="q-mx-lg q-mt-lg q-mb-md"/>
                      </div>
                      <div class="col q-py-lg text-subtitle1 text-c-blue1">云主机</div>
                    </div>

                    <q-separator/>

                    <div class="row q-mt-md">
                      <div class="col">
                        <q-btn flat stack label="新建云主机" icon="control_point" class="q-mx-md"
                               :to="{ path: '/my/usage/vmcreate' }"/>
                      </div>
                      <div class="col">
                        <q-btn flat stack label="VPN配置" icon="vpn_lock" class="q-mx-md"
                               :to="{ path: '/my/usage/vpn' }"/>
                      </div>
                    </div>
                  </div>
                  <!-- 云主机card-->

                  <!-- 资源配额申请单card-->
                  <div class="quick-card q-my-lg q-mr-lg">
                    <div class="row">
                      <div class="col">
                        <q-icon name="format_list_numbered" size="5.9em" class="q-mx-lg q-mt-lg q-mb-md"/>
                      </div>
                      <div class="col q-py-lg text-subtitle1 text-c-blue1">资源配额申请单
                      </div>
                    </div>

                    <q-separator/>

                    <div class="row q-mt-md">
                      <div class="col-shrink">
                        <q-btn flat stack label="申请资源配额" icon="add_task" class="q-mx-md"
                               :to="{ path: '/my/quota/apply' }"/>
                      </div>
                      <div v-if="isQuotaAdmin" class="col">
                        <q-btn flat stack label="审核申请单" icon="checklist_rtl" class="q-mx-md"
                               :to="{ path: '/my/quota/manage' }"/>
                      </div>
                    </div>
                  </div>
                  <!-- 资源配额申请单card-->
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
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../store'

import GlobalHeader from 'components/GlobalHeader.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalHeader
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.account.cstTrueName

    // 获取所有数据中心的服务的数量
    const serviceNum = computed(() => $store.getters['vm/getServicesNumber'])

    // 获取云主机列表数据
    const servers = computed(() => $store.getters['vm/getServers'])

    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('vm/vmOperation', payload)
    }
    // VNC 不保存在vuex里，vnc图标根据云主机状态变化，开机时可以点击vnc按钮，点击后再获取vnc地址并打开新窗口跳转
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('vm/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }

    // 根据adminQuotaApplicationTable是否为空来判断当前用户是否有权限审批quota，是否显示审批tab
    const isQuotaAdmin = computed(() => $store.state.applyQuota.tables.adminQuotaApplicationTable.isLoaded)

    return {
      currentUser,
      servers,
      vmOperation,
      gotoVNC,
      serviceNum,
      isQuotaAdmin
    }
  }
})
</script>

<style lang="scss" scoped>
.Main {
}

.card {
  height: 190px;
  width: 300px;
}

.server-card {
  //height: 100px;
  //width: 300px;
  //border: $grey-4 1px solid;
  background-color: $grey-1;
}

.quick-card {
  height: 210px;
  width: 300px;
  border: $nord5 1px solid;
}

</style>
