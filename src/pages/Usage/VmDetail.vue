<template>
  <div class="VmDetail">
    <div class="column items-center justify-center">
      <div class="col">

        <div class="row">

          <div class="col title-area">
            云主机详情
            <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense
                   @click="goBack"/>
          </div>

        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row">

          <div v-if="!server || !service || !quota" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col content-area">
            <div class="row justify-center items-center q-pt-lg">
              <div class="col-4 text-h5">
                <div>
                  <q-btn
                    class="col-shrink" flat size="xl" padding="none" color="primary"
                    :label="server.ipv4"
                    @click="clickToCopy(server.ipv4)">
                    <q-tooltip>
                      复制
                    </q-tooltip>
                  </q-btn>

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
            <!--            空行-->
            <div class="row justify-center items-center q-py-xl ">
              <div class="button-area q-gutter-lg">
              </div>
            </div>

            <div class="row justify-center">
              <div class="col-4">

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">ID</div>
                  <div class="col"> {{ server.id }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">CPU</div>
                  <div class="col"> {{ server.vcpus }}核</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">内存</div>
                  <div class="col"> {{ server.ram }}MB</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">CPU</div>
                  <div class="col"> {{ server.vcpus }}核</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">公网IP</div>
                  <div class="col"> {{ server.public_ip ? '是' : '否' }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">系统镜像</div>
                  <div class="col"> {{ server.image }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">创建时间</div>
                  <div class="col"> {{ server.creation_time }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">过期时间</div>
                  <div class="col"> {{ server.expiration_time || '永久有效' }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">备注</div>
                  <div class="col"> {{ server.remarks }}</div>
                </div>

              </div>
              <div class="col-8">

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">服务节点</div>
                  <div class="col"> {{ service.name }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">服务类型</div>
                  <div class="col"> {{ service.service_type }}</div>
                </div>
                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">所用配额</div>
                  <div class="col-shrink">
                    <!--                    <quota-card :quota="quota"/>-->
                    {{ quota.display }}
                  </div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey-7">需要VPN</div>
                  <div class="col"> {{ service.need_vpn ? '是' : '否' }}</div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey-7">VPN用户名</div>
                  <div class="col">
                    {{ vpn.username }}
                    <q-btn
                      class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                      @click="clickToCopy(vpn.username)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey-7">VPN密码</div>
                  <div class="col">
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
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey-7">VPN配置文件</div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat @click="fetchConfig"/>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey-7">VPN CA证书</div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat @click="fetchCa"/>
                  </div>
                </div>

              </div>
            </div>

            <!--            <div class="row justify-center">-->
            <!--              <div class="col-4">-->
            <!--                <div class="row">-->
            <!--                  <div class="col-2">-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      ID-->
            <!--                    </div>-->

            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      CPU-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      内存-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      公网IP-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      系统镜像-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      创建时间-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      过期时间-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      备注-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <div class="col">-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.id }}-->
            <!--                      <q-btn-->
            <!--                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"-->
            <!--                        @click="clickToCopy(server.id)">-->
            <!--                        <q-tooltip>-->
            <!--                          复制-->
            <!--                        </q-tooltip>-->
            <!--                      </q-btn>-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.vcpus }}核-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.ram }}MB-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.public_ip ? '是' : '否' }}-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.image }}-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.creation_time }}-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.expiration_time || '永久有效' }}-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ server.remarks }}-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->

            <!--              <div class="col-8 justify-start">-->
            <!--                <div class="row">-->
            <!--                  <div class="col-1">-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      数据中心-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      服务类型-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      配额-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      VPN 用户名-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      VPN 密码-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      VPN 配置文件-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md text-grey-7">-->
            <!--                      VPN CA证书-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <div class="col">-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ service.name }}-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      {{ service.service_type }}-->
            <!--                    </div>-->

            <!--                    <div class="q-pb-md">-->
            <!--                      {{ quota.display }}-->
            <!--                    </div>-->

            <!--                    <div class="q-pb-md">-->
            <!--                      {{ vpn.username }}-->
            <!--                      <q-btn-->
            <!--                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"-->
            <!--                        @click="clickToCopy(vpn.username)">-->
            <!--                        <q-tooltip>-->
            <!--                          复制-->
            <!--                        </q-tooltip>-->
            <!--                      </q-btn>-->

            <!--                    </div>-->

            <!--                    <div class="q-pb-md row q-gutter-md">-->

            <!--                      <q-input class="password-input"-->
            <!--                               :loading="isLoading"-->
            <!--                               v-model="vpn.password" :type="isPwd ? 'password' : 'text'"-->
            <!--                               readonly borderless dense square outlined>-->
            <!--                        <template v-slot:prepend>-->
            <!--                          <q-icon-->
            <!--                            :name="isPwd ? 'visibility' : 'visibility_off'"-->
            <!--                            @click="isPwd = !isPwd"-->
            <!--                          />-->
            <!--                        </template>-->
            <!--                      </q-input>-->

            <!--                      <q-btn-->
            <!--                        class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"-->
            <!--                        @click="clickToCopy(vpn.password)">-->
            <!--                        <q-tooltip>-->
            <!--                          复制-->
            <!--                        </q-tooltip>-->
            <!--                      </q-btn>-->

            <!--                      <q-btn label="修改密码" padding="none" dense flat color="primary"-->
            <!--                             @click="popEdit(vpn)"/>-->

            <!--                    </div>-->

            <!--                    <div class="q-pb-sm">-->
            <!--                      <q-btn label="下载" class=" " color="primary" padding="none" dense flat @click="fetchConfig"/>-->
            <!--                    </div>-->
            <!--                    <div class="q-pb-md">-->
            <!--                      <q-btn label="下载" class="" color="primary" padding="none" dense flat @click="fetchCa"/>-->
            <!--                    </div>-->

            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->

            <!--            </div>-->

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
import { useRouter, useRoute } from 'vue-router'
import { copyToClipboard, useQuasar } from 'quasar'
import { VpnInterface } from 'src/store/vm/state'

// import QuotaCard from 'components/usage/QuotaCard.vue'

export default defineComponent({
  name: 'VmDetail',
  components: { /* QuotaCard */ },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()
    const $route = useRoute()

    // 从route对象中读取id参数
    const serverId = $route.params.id as string

    // todo url未传参id时，跳转处理
    // if (!serverId) {
    //   void $router.push({ path: '/my/usage/vm' })
    // }

    // server info
    const server = computed(() => $store.state.vm.tables.userServerTable.byId[serverId])
    // service info
    const service = computed(() => $store.state.vm.tables.userServiceTable.byId[server.value.service])
    // quota info
    const quota = computed(() => $store.state.vm.tables.userQuotaTable.byId[server.value.user_quota])
    // vpn info
    const vpn = computed(() => $store.state.vm.tables.userVpnTable.byId[server.value.service])
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
        void $store.dispatch('vm/patchVpnPassword', payload).then((value) => {
          $store.commit('vm/storeUserVpnTable', Object.assign(vpn, { password: value.data.vpn.password }))
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

    // 云主机操作 todo 与actions中的操作函数合并逻辑
    const vmOperation = async (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void await $store.dispatch('vm/vmOperation', payload)
      // console.log('in vmops', payload) todo 跳转流程优化
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        $q.notify({
          spinner: true,
          timeout: 4000,
          color: 'nord9',
          message: `正在删除IP地址为：${payload.ip || ''} 的云主机，请稍候`,
          closeBtn: false
        })
        void await $router.push({ path: '/my/usage/' })
      }
    }
    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('vm/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    // console.log(server, service, quota, vpn)
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
      gotoVNC,
      goBack,
      $route
    }
  }
})
</script>

<style lang="scss" scoped>
.VmDetail {
}

.title-area {
  width: 1280px; // prod
  //margin-left: 140px;
  //margin-bottom: calc((100vh - 114px) / 24);
  //line-height: calc((100vh - 114px) / 10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  //border-bottom: $primary 2px solid;
}

.back-btn {
  left: -130px;
}

.content-area {
  //margin-left: 140px;
  //width: calc(100vw - 200px);
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
