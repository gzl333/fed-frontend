<template>
  <div class="VmDetail">
    <div class="row routerview-area">
      <div class="col-1"></div>
      <div class="col">
        <div class="column items-center justify-center ">
          <div class="col-1 self-start title-area">
            <div>
              云主机详情
              <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense
                     :to="{path: '/my/usage/'}"/>
            </div>
          </div>

          <div v-if="!server.ipv4" class="col content-area loading">
            <q-spinner
              color="primary"
              size="5em"
              :thickness="2"
            />
          </div>

          <div v-else class="col content-area">
            <div class="row justify-center items-center q-pt-lg">
              <div class="col-4 text-h5">
                <div>
                  {{ server.ipv4 }}
                  <q-btn
                    class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                    @click="clickToCopy(server.ipv4)">
                    <q-tooltip>
                      复制
                    </q-tooltip>
                  </q-btn>
                </div>
                <div>
                  <q-chip v-if="!server.status" label="操作中" square color="nord4">
                    <q-inner-loading showing class="inner-loading">
                      <q-spinner size="30px" color="nord9"/>
                    </q-inner-loading>
                  </q-chip>

                  <q-chip v-if="server.status === '无法获取状态'" outline color="nord11" text-color="white"
                          label="无法获取状态" class="text-bold"/>
                  <q-chip v-if="server.status === '运行中'" outline color="nord14" text-color="white"
                          label="运行中" class="text-bold"/>
                  <q-chip v-if="server.status === '已屏蔽'" outline color="nord3" text-color="white"
                          label="已屏蔽" class="text-bold"/>
                  <q-chip v-if="server.status === '已暂停'" outline color="nord3" text-color="white"
                          label="已暂停" class="text-bold"/>
                  <q-chip v-if="server.status === '正在关机'" outline color="nord9" text-color="white"
                          label="正在关机" class="text-bold"/>
                  <q-chip v-if="server.status === '已关机'" outline color="nord3" text-color="white"
                          label="已关机" class="text-bold"/>
                  <q-chip v-if="server.status === '已崩溃'" outline color="nord11" text-color="white"
                          label="已崩溃" class="text-bold"/>
                  <q-chip v-if="server.status === '被电源管理器挂起'" outline color="nord3" text-color="white"
                          label="被电源管理器挂起" class="text-bold"/>
                  <q-chip v-if="server.status === '与宿主机通讯失败'" outline color="nord11" text-color="white"
                          label="与宿主机通讯失败" class="text-bold"/>
                  <q-chip v-if="server.status === '已丢失'" outline color="nord11" text-color="white"
                          label="已丢失" class="text-bold"/>
                  <q-chip v-if="server.status === '正在创建'" outline color="nord9" text-color="white"
                          label="正在创建" class="text-bold"/>
                  <q-chip v-if="server.status === '创建失败'" outline color="nord11" text-color="white"
                          label="创建失败" class="text-bold"/>
                </div>

              </div>
              <div class="col q-gutter-lg">
                <q-btn v-if="server.status=='运行中'"
                       :disable="!server.status"
                       unelevated flat padding="none" size="lg" color="primary" icon="computer"
                       @click="gotoVNC(server.id)">
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

                <q-btn :disable="!server.status || server.status === '运行中'"
                       color="nord4" icon="play_arrow" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'start'})">
                  <q-tooltip>
                    开机
                  </q-tooltip>
                </q-btn>

                <q-btn :disable="!server.status || server.status === '已关机'"
                       color="nord4" icon="power_settings_new" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'shutdown'})">
                  <q-tooltip>
                    关机
                  </q-tooltip>
                </q-btn>

                <q-btn :disable="!server.status || server.status === '已关机'"
                       color="nord4" icon="restart_alt" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'reboot'})">
                  <q-tooltip>
                    重启
                  </q-tooltip>
                </q-btn>

                <q-btn :disable="!server.status || server.status === '已关机'"
                       color="nord4" icon="power_off" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'poweroff'})">
                  <q-tooltip>
                    强制断电
                  </q-tooltip>
                </q-btn>

                <q-btn :disable="!server.status || server.status === '运行中'"
                       color="nord4" icon="delete" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'delete'})">
                  <q-tooltip>
                    删除
                  </q-tooltip>
                </q-btn>

                <q-btn :disable="!server.status"
                       color="nord4" icon="delete_forever" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="vmOperation({endPoint: server.endpoint_url, id: server.id, action: 'delete_force'})">
                  <q-tooltip>
                    强制删除
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row justify-center items-center q-py-xl ">
              <div class="col-3 button-area q-gutter-lg">

              </div>
              <div class="col">
              </div>
            </div>
            <div class="row justify-center">
              <div class="col-4">
                <div class="row">
                  <div class="col-2">
                    <div class="q-pb-md text-grey-7">
                      ID
                    </div>

                    <div class="q-pb-md text-grey-7">
                      CPU
                    </div>
                    <div class="q-pb-md text-grey-7">
                      内存
                    </div>
                    <div class="q-pb-md text-grey-7">
                      公网IP
                    </div>
                    <div class="q-pb-md text-grey-7">
                      系统镜像
                    </div>
                    <div class="q-pb-md text-grey-7">
                      创建时间
                    </div>
                    <div class="q-pb-md text-grey-7">
                      过期时间
                    </div>
                    <div class="q-pb-md text-grey-7">
                      备注
                    </div>
                  </div>
                  <div class="col">
                    <div class="q-pb-md">
                      {{ server.id }}
                      <q-btn
                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                        @click="clickToCopy(server.id)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div class="q-pb-md">
                      {{ server.vcpus }}核
                    </div>
                    <div class="q-pb-md">
                      {{ server.ram }}MB
                    </div>
                    <div class="q-pb-md">
                      {{ server.public_ip ? '是' : '否' }}
                    </div>
                    <div class="q-pb-md">
                      {{ server.image }}
                    </div>
                    <div class="q-pb-md">
                      {{ server.creation_time }}
                    </div>
                    <div class="q-pb-md">
                      {{ server.expiration_time || '永久有效' }}
                    </div>
                    <div class="q-pb-md">
                      {{ server.remarks }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-8 justify-start">
                <div class="row">
                  <div class="col-1">
                    <div class="q-pb-md text-grey-7">
                      数据中心
                    </div>
                    <div class="q-pb-md text-grey-7">
                      服务类型
                    </div>
                    <div class="q-pb-md text-grey-7">
                      配额
                    </div>
                    <div class="q-pb-md text-grey-7">
                      VPN 用户名
                    </div>
                    <div class="q-pb-md text-grey-7">
                      VPN 密码
                    </div>
                    <div class="q-pb-md text-grey-7">
                      VPN 配置文件
                    </div>
                    <div class="q-pb-md text-grey-7">
                      VPN CA证书
                    </div>
                  </div>
                  <div class="col">
                    <div class="q-pb-md">
                      {{ service.name }}
                    </div>
                    <div class="q-pb-md">
                      {{ service.service_type }}
                    </div>
                    <div class="q-pb-md">
                      {{ quota.display }}
                    </div>
                    <div class="q-pb-md">
                      {{ vpn.username }}
                      <q-btn
                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                        @click="clickToCopy(vpn.username)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>
                    </div>
                    <div class="q-pb-md row q-gutter-md">

                      <q-input class="password-input"
                               :loading="isLoading"
                               v-model="vpn.password" :type="isPwd ? 'password' : 'text'"
                               readonly borderless dense square outlined>
                        <template v-slot:prepend>
                          <q-icon
                            :name="isPwd ? 'visibility' : 'visibility_off'"
                            @click="isPwd = !isPwd"
                          />
                        </template>
                      </q-input>

                      <q-btn
                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                        @click="clickToCopy(vpn.password)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>

                      <q-btn label="修改密码" padding="none" dense flat color="primary"
                             @click="popEdit(vpn)"/>

                    </div>
                    <div class="q-pb-sm">
                      <q-btn label="下载" class=" " color="primary" padding="none" dense flat @click="fetchConfig"/>
                    </div>
                    <div class="q-pb-md">
                      <q-btn label="下载" class="" color="primary" padding="none" dense flat @click="fetchCa"/>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
import { copyToClipboard, useQuasar } from 'quasar'
import { VpnInterface } from 'src/store/usage/state'

export default defineComponent({
  name: 'VmDetail',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()

    // void $store.dispatch('usage/getUsageTable')

    const serverId = computed(() => $store.state.usage.pages.vmDetail.serverId)
    // 进入vm详情页面时， serverDetail中： id='0'是从url直接进入页面，而不是从vmlist点击进入，应重定向回vmlist；id=''是在读取中，应loading；其它状态则显示信息
    if (serverId.value === '0') {
      void $router.push({ path: '/my/usage/' })
    }
    // server info
    const server = computed(() => $store.state.usage.tables.userServerTable.byId[serverId.value])
    // service info
    const service = computed(() => $store.state.usage.tables.userServiceTable.byId[server.value.service])
    // quota info
    const quota = computed(() => $store.state.usage.tables.userQuotaTable.byId[server.value.user_quota])
    // vpn info
    const vpn = computed(() => $store.state.usage.tables.userVpnTable.byId[server.value.service])
    // password可见性
    const isPwd = ref(true)
    // 修改密码loading状态
    const isLoading = ref(false)
    // vpn 修改密码
    const popEdit = (vpn: VpnInterface) => {
      $q.dialog({
        title: `修改${server.value.service}的VPN密码`,
        message: '新密码长度为6-64位',
        prompt: {
          model: `${vpn.password}`,
          counter: true,
          maxlength: 64,
          isValid: (val: string) => {
            if (val.trim().length < 6 || val.trim().length > 64) {
              return false
            } else {
              return true
            }
          },
          type: 'text' // optional
        },
        color: 'primary',
        cancel: true
      }).onOk((data: string) => {
        isLoading.value = true
        const payload = {
          serviceId: server.value.service,
          password: data.trim()
        }
        void $store.dispatch('usage/patchVpnPassword', payload).then((value) => {
          $store.commit('usage/storeUserVpnTable', Object.assign(vpn, { password: value.data.vpn.password }))
          isLoading.value = false
        }
        ).catch(() => {
          isLoading.value = false
        }
        )
      })
    }
    // download vpn ca
    const fetchCa = () => {
      const url = 'https://vms.cstcloud.cn/api/vpn/' + server.value.service + '/ca/'
      window.open(url)
    }
    // download vpn config
    const fetchConfig = () => {
      const url = 'https://vms.cstcloud.cn/api/vpn/' + server.value.service + '/config/'
      window.open(url)
    }

    // 复制信息到剪切板
    const clickToCopy = async (text: string) => {
      void await copyToClipboard(text).then(() => {
        $q.notify({
          color: 'primary',
          message: `${text} 已经复制到剪切板`,
          // position: 'bottom-right',
          closeBtn: false,
          timeout: 1500
        })
      })
    }

    // 云主机操作
    const vmOperation = async (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void await $store.dispatch('usage/vmOperation', payload)
      // console.log('in vmops', payload) todo 跳转流程优化
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        $q.notify({
          spinner: true,
          timeout: 4000,
          color: 'nord9',
          message: `正在删除IP地址为：${payload.ip || ''} 的云主机，请稍候。即将跳转至上一级页面。`,
          closeBtn: false
        })
        void await $router.push({ path: '/my/usage/' })
      }
    }
    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('usage/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    return {
      server,
      service,
      quota,
      vpn,
      isPwd,
      popEdit,
      fetchCa,
      fetchConfig,
      isLoading,
      clickToCopy,
      vmOperation,
      gotoVNC
    }
  }
})
</script>

<style lang="scss" scoped>
.VmDetail {
}

.routerview-area {
  height: calc(100vh - 115px);
  width: calc(100vw - 165px);
}

.back-btn {
  left: -150px;
}

.title-area {
  width: 300px;
  margin-left: 140px;
  margin-bottom: calc((100vh - 114px) / 24);
  line-height: calc((100vh - 114px) / 10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  //border-bottom: $primary 2px solid;
}

.loading {
  line-height: 500px;
  text-align: center;
}

.content-area {
  margin-left: 140px;
  width: calc(100vw - 200px);
}

.button-area {

}

.ip-title {
  font-size: large;
  font-weight: bold;
}

.detail-item {
  padding-bottom: 10px;
}

.password-input {
  height: 20px;
  width: 280px;
}
</style>
