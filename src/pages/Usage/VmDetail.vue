<template>
  <div class="VmDetail">
    <div class="column items-center justify-center routerview-area">
      <div class="col-1 self-start title-area">
        <div>
          云主机详情
          <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense
                 :to="{path: '/my/usage/'}"/>
        </div>
      </div>

      <div v-if=" !serverDetail.ipv4" class="col content-area loading">
        <q-spinner
          color="primary"
          size="5em"
          :thickness="2"
        />
      </div>

      <div v-else class="col content-area">
        <div class="row justify-center items-center q-pt-lg">
          <div class="col-3 text-h5">
            <div>
              {{ serverDetail.ipv4 }}
              <q-btn
                class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                @click="clickToCopy(serverDetail.ipv4)">
                <q-tooltip>
                  复制
                </q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-chip v-if="!serverDetail.status" label="读取中" square color="nord4">
                <q-inner-loading showing class="inner-loading">
                  <q-spinner size="30px" color="nord9"/>
                </q-inner-loading>
              </q-chip>

              <q-chip v-if="serverDetail.status === '无法获取状态'" outline color="nord11" text-color="white"
                      label="无法获取状态" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '运行中'" square outline color="nord14" text-color="white"
                      label="运行中" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '已屏蔽'" outline color="nord3" text-color="white"
                      label="已屏蔽" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '已暂停'" outline color="nord3" text-color="white"
                      label="已暂停" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '正在关机'" outline color="nord9" text-color="white"
                      label="正在关机" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '已关机'" outline color="nord3" text-color="white"
                      label="已关机" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '已崩溃'" outline color="nord11" text-color="white"
                      label="已崩溃" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '被电源管理器挂起'" outline color="nord3" text-color="white"
                      label="被电源管理器挂起" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '与宿主机通讯失败'" outline color="nord11" text-color="white"
                      label="与宿主机通讯失败" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '已丢失'" outline color="nord11" text-color="white"
                      label="已丢失" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '正在创建'" outline color="nord9" text-color="white"
                      label="正在创建" class="text-bold"/>
              <q-chip v-if="serverDetail.status === '创建失败'" outline color="nord11" text-color="white"
                      label="创建失败" class="text-bold"/>
            </div>

          </div>
          <div class="col">
          </div>
        </div>
        <div class="row justify-center items-center q-py-xl">
          <div class="col-3">
            <q-btn v-if="serverDetail.status=='运行中'" unelevated flat padding="none" size="lg" color="nord14" icon="computer"
                   @click="gotoVNC(serverDetail.id)">
            </q-btn>
            <q-btn v-else unelevated color="nord3" flat padding="none" size="lg" icon="computer">
              <q-tooltip>
                请开机以使用VNC
              </q-tooltip>
            </q-btn>

            <q-btn v-if="serverDetail.status=='已关机'" color="nord4" icon="play_arrow" text-color="primary" unelevated
                   @click="vmOperation({endPoint: serverDetail.endpoint_url, id: serverDetail.id, action: 'start'})">
              <q-tooltip>
                开机
              </q-tooltip>
            </q-btn>
            <q-btn v-if="serverDetail.status=='运行中'" color="nord4" icon="power_settings_new" text-color="primary" unelevated
                   @click="vmOperation({endPoint: serverDetail.endpoint_url, id: serverDetail.id, action: 'shutdown'})">
              <q-tooltip>
                关机
              </q-tooltip>
            </q-btn>
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
                  {{ serverDetail.id }}
                  <q-btn
                    class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                    @click="clickToCopy(serverDetail.id)">
                    <q-tooltip>
                      复制
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.vcpus }}核
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.ram }}MB
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.public_ip ? '是' : '否' }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.image }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.creation_time }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.expiration_time || '永久有效' }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.remarks }}
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
                  VPN 配置
                </div>
                <div class="q-pb-md text-grey-7">
                  VPN CA证书
                </div>
              </div>
              <div class="col">
                <div class="q-pb-md">
                  {{ serverDetail.service.name }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.service.service_type }}
                </div>
                <div class="q-pb-md">
                  {{ serverDetail.user_quota.display }}
                </div>
                <div class="q-pb-md">
                  {{ vpnDetail.username }}
                  <q-btn
                    class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                    @click="clickToCopy(vpnDetail.username)">
                    <q-tooltip>
                      复制
                    </q-tooltip>
                  </q-btn>
                </div>
                <div class="q-pb-md row q-gutter-md">

                  <q-input class="password-input"
                           :loading="isLoading"
                           v-model="vpnDetail.password" :type="isPwd ? 'password' : 'text'"
                           readonly borderless dense square outlined>
                    <template v-slot:prepend>
                      <q-icon
                        :name="isPwd ? 'visibility' : 'visibility_off'"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                    <template v-slot:append>
                      <q-btn
                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                        @click="clickToCopy(vpnDetail.password)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>

                  <q-btn label="修改密码" padding="none" dense flat color="primary"
                         @click="popEdit(serverDetail.service.id, vpnDetail.password)"/>

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

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
import { copyToClipboard, useQuasar } from 'quasar'

export default defineComponent({
  name: 'VmDetail',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()

    const serverDetail = computed(() => $store.state.usage.serverDetail)
    // 进入vm详情页面时， serverDetail中： id='0'是从url直接进入页面，而不是从vmlist点击进入，应重定向回vmlist；id=''是在读取中，应loading；其它状态则显示信息
    if (serverDetail.value.id === '0') {
      void $router.push({ path: '/my/usage/' })
    }
    // vpninfo
    const vpnDetail = computed(() => $store.state.usage.vpn.get(serverDetail.value.service!.id))
    // password可见性
    const isPwd = ref(true)
    // 修改密码loading状态
    const isLoading = ref(false)
    // vpn 修改密码
    const popEdit = (serviceId: string, password: string) => {
      $q.dialog({
        title: `修改${serverDetail.value.service!.name}的VPN密码`,
        message: '新密码长度为6-64位',
        prompt: {
          model: `${password}`,
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
          serviceId: serverDetail.value.service!.id,
          password: data.trim()
        }
        void $store.dispatch('usage/patchVpnPassword', payload).then((value) => {
          $store.commit('usage/storeVpn', {
            serviceId: serverDetail.value.service!.id,
            vpn: value.data.vpn
          })
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
      const url = 'http://gosc.cstcloud.cn/api/vpn/' + serverDetail.value.service!.id + '/ca/'
      window.open(url)
    }
    // download vpn config
    const fetchConfig = () => {
      const url = 'http://gosc.cstcloud.cn/api/vpn/' + serverDetail.value.service!.id + '/config/'
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
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('usage/serverDetailOperation', payload)
      // console.log('in vmops', payload)
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        $q.notify({
          spinner: true,
          timeout: 4000,
          color: 'nord9',
          message: `正在删除IP地址为：${payload.ip || ''} 的云主机，请稍候。即将跳转至上一级页面。`,
          closeBtn: false
        })
        void $router.push({ path: '/my/usage/' })
      }
    }
    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('usage/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    return {
      serverDetail,
      vpnDetail,
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
  border-bottom: $primary 2px solid;
}

.loading {
  line-height: 500px;
  text-align: center;
}

.content-area {
  margin-left: 140px;
  width: calc(100vw - 200px);
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
  width: 300px;
}
</style>
