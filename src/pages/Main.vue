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
            <div class="row q-mt-md  text-h5 ">
              <div class="q-pb-xs text-h6 ">联邦机构</div>
            </div>
            <q-separator/>
            <div class="row justify-center q-my-xs">
              <div class="card">
                <div class="row text-h6 q-ma-lg justify-center items-center text-grey ">
                  <q-icon name="foundation" size="1.5em" class="q-mr-md"/>
                  接入数据中心
                </div>
                <div class="row text-h4 q-ma-xl justify-center items-center">
                  {{ $store.state.vm.tables.globalDataCenterTable.allIds.length }}个
                </div>
              </div>
              <div class="card">
                <div class="row text-h6 q-ma-lg justify-center items-center text-grey ">
                  <q-icon name="timeline" size="1.5em" class="q-mr-md"/>
                  接入服务
                </div>
                <div class="row text-h4 q-ma-xl justify-center ">{{serviceNum}}个</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div class="row q-mt-md  text-h5 justify-between ">
              <div class="q-pa-sm text-h6">在用云主机资源</div>
              <q-btn label="更多云主机..." class="" color="primary" flat dense padding="none"   :to="{ path: '/my/usage/vm' }"/>
            </div>

            <q-separator/>

            <div class="row justify-start q-mx-xl" v-for="server in servers" :key="server">
              <!--一个云主机的card-->
              <div class="row  server-card q-my-md q-mx-md">
                <div class="col">
                  <div class="row">
                    <div class="col-6">
                      <div v-if="server.status!=='运行中' && server.status!=='已关机'" class="row justify-center">
                        <q-btn
                          color="nord4" loading label="......" icon="hourglass_bottom" size="2em">
                          <q-tooltip>
                            远程执行中，请稍候
                          </q-tooltip>
                        </q-btn>
                      </div>
                      <div v-if="server.status === '运行中'" class="row justify-center">
                        <q-btn
                          flat
                          v-if="server.status === '运行中'"
                          @click="gotoVNC(server.id)"
                        >
                          <q-icon name="computer" size="6em"><q-tooltip>点击进入远程控制</q-tooltip></q-icon></q-btn>
                      </div>
                      <div v-if="server.status === '已关机'" class="row justify-center">
                        <q-icon name="close" size="6em"><q-tooltip>请开机以使用远程控制</q-tooltip></q-icon>
                      </div>

                    </div>
                    <div class="column justify-evenly q-mt-xs">
                      <div class="row justify-center">{{ server.ipv4 }}</div>
                      <q-btn
                        v-if="server.status!=='运行中' && server.status!=='已关机'"
                        color="nord4" loading label="......">
                        <q-tooltip>
                          远程执行中，请稍候
                        </q-tooltip>
                      </q-btn>
                      <div v-if="server.status === '已关机'" class="row bg-nord6">
                        <q-btn flat label="开机" icon="play_arrow" size="md" class="q-mx-md"
                               @click="vmOperation({
                            endPoint: server.endpoint_url,
                            id: server.id,
                            action: 'start',
                          })
                        "/>
                      </div>
                      <div v-if="server.status === '运行中'" class="row bg-nord6">
                        <q-btn flat label="关机" icon="power_settings_new" size="md" class="q-mx-md"
                               @click="vmOperation({
                            endPoint: server.endpoint_url,
                            id: server.id,
                            action: 'shutdown',
                          })
                        "/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--一个云主机的card-->
            </div>

          </div>

        </div>
      </div>
    </div>

    <div class="col-auto">
      <div class="row justify-center">
        <div class="content-fixed-width">
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
                <div class="col q-py-lg text-subtitle1 text-c-blue1">云主机
                  <q-badge color="primary">计算服务</q-badge>
                </div>
              </div>

              <q-separator/>

              <div class="row q-mt-md">
                <div class="col ">
                  <q-btn flat label="新建云主机" icon="control_point" size="md" class="q-mx-md"
                         :to="{ path: '/my/usage/vmcreate' }"/>
                </div>
                <div class="col">
                  <q-btn flat label="VPN配置" icon="vpn_lock" class="q-mx-md" :to="{ path: '/my/usage/vpn' }"/>
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
                <div class="col ">
                  <q-btn flat label="申请资源配额" icon="add_task" size="md" class="q-mx-md"
                         :to="{ path: '/my/usage/vmcreate' }"/>
                </div>
                <div class="col">
                  <q-btn flat label="审核申请单" icon="checklist_rtl" class="q-mx-md" :to="{ path: '/my/usage/vpn' }"/>
                </div>
              </div>
            </div>
            <!-- 资源配额申请单card-->
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
    return {
      currentUser,
      servers,
      vmOperation,
      gotoVNC,
      serviceNum

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
  height: 100px;
  width: 300px;
}

.quick-card {
  height: 210px;
  width: 300px;
  border: $nord5 1px solid;
}

</style>
