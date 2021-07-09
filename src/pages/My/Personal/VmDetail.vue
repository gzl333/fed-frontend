<template>
  <div class="VmDetail">
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

                  <ServerStatus :server="server"/>
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
                       @click="$store.dispatch('vm/vmOperation',{id: server.id, action: 'start'})">
                  <q-tooltip>
                    开机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="power_settings_new" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/vmOperation',{ id: server.id, action: 'shutdown'})">
                  <q-tooltip>
                    关机
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="restart_alt" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/vmOperation',{ id: server.id, action: 'reboot'})">
                  <q-tooltip>
                    重启
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 5"
                       color="nord4" icon="power_off" text-color="primary"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/vmOperation',{id: server.id, action: 'poweroff'})">
                  <q-tooltip>
                    强制断电
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status !== 1"
                       color="nord4" icon="delete" text-color="red"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/vmOperation',{ id: server.id, action: 'delete'})">
                  <q-tooltip>
                    删除
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="server.status"
                       color="nord4" icon="delete_forever" text-color="red"
                       unelevated flat padding="none" size="lg"
                       @click="$store.dispatch('vm/vmOperation',{ id: server.id, action: 'delete_force'})">
                  <q-tooltip>
                    强制删除
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <!--空行开始-->
            <div class="row justify-center items-center q-py-xl ">
              <div class="button-area q-gutter-lg">
              </div>
            </div>
            <!--空行结束-->
            <div class="row justify-center">
              <div class="col-4">

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">ID</div>
                  <div class="col"> {{ server.id }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">CPU</div>
                  <div class="col"> {{ server.vcpus }}核</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">内存</div>
                  <div class="col"> {{ server.ram / 1024 }}GB</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">IP类型</div>
                  <div class="col"> {{ server.public_ip ? '公网' : '私网' }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">系统镜像</div>
                  <div class="col"> {{ server.image }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">创建时间</div>
                  <div class="col"> {{ new Date(server.creation_time).toLocaleString() }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">失效时间</div>
                  <div class="col">
                    {{ server.expiration_time ? new Date(server.expiration_time).toLocaleString() : '永久有效' }}
                  </div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">备注</div>
                  <div class="col">

                    <q-btn class="col-shrink q-px-xs" flat dense icon="edit" size="xs" color="primary"
                           @click="$store.dispatch('vm/popEditVmNote',server.id)">
                      <q-tooltip>
                        编辑备注
                      </q-tooltip>
                    </q-btn>

                    {{ server.remarks }}

                  </div>
                </div>

              </div>
              <div class="col-8">

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">服务节点</div>
                  <div class="col"> {{ service.name }}</div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">服务类型</div>
                  <div class="col"> {{ service.service_type }}</div>
                </div>
                <div class="row q-pb-md">
                  <div class="col-2 text-grey">所用配额</div>
                  <div class="col-shrink">

                    <div v-if="quota">
                      <q-btn label="配额详情" flat dense color="primary" padding="none"
                             :to="{path: `/my/personal/quota_detail/${quota?.id}`}">
                        <q-tooltip>
                          进入配额详情页面
                        </q-tooltip>
                      </q-btn>
                      {{ quota?.display }}
                    </div>

                    <div v-else>所用配额已删除或未使用配额创建</div>

                  </div>
                </div>

                <div class="row q-pb-md">
                  <div class="col-2 text-grey">需要VPN</div>
                  <div class="col"> {{ service?.need_vpn ? '是' : '否' }}</div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md ">
                  <div class="col-2 text-grey">VPN用户名</div>
                  <div class="col">
                    {{ vpn.username }}
                    <q-btn
                      class="col-shrink q-px-xs" flat color="primary" icon="content_copy" size="xs"
                      @click="clickToCopy(vpn.username)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md items-center">
                  <div class="col-2 text-grey">VPN密码</div>
                  <div class="col">
                    <div class="row ">
                      <q-input class="password-input"
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
                        class="col-shrink q-px-xs" flat color="primary" icon="content_copy" size="xs"
                        @click="clickToCopy(vpn.password)">
                        <q-tooltip>
                          复制
                        </q-tooltip>
                      </q-btn>

                      <q-btn label="修改密码" padding="none" dense flat color="primary"
                             @click="$store.dispatch('vm/popEditVpnPass',  vpn)"/>

                    </div>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey">VPN配置文件</div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                           @click="$store.dispatch('vm/fetchConfig', server.service)"/>
                  </div>
                </div>

                <div v-if="service.need_vpn" class="row q-pb-md">
                  <div class="col-2 text-grey">VPN CA证书</div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="$store.dispatch('vm/fetchCa', server.service)"/>
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
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter, useRoute } from 'vue-router'
import ServerStatus from 'components/ServerTable/ServerStatus.vue'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
// import QuotaCard from 'components/Personal/PersonalQuotaCard.vue'

export default defineComponent({
  name: 'VmDetail',
  components: { ServerStatus/* , QuotaCard */ },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()

    // 从route对象中读取id参数
    const serverId = $route.params.id as string

    // todo url未传参id时，跳转处理
    // if (!serverId) {
    //   void $router.push({ path: '/my/Personal/vm' })
    // }

    // server info
    const server = computed(() => $store.state.vm.tables.userServerTable.byId[serverId])
    // service info
    const service = computed(() => $store.state.vm.tables.globalServiceTable.byId[server.value.service])
    // quota info
    const quota = computed(() => $store.state.vm.tables.userQuotaTable.byId[server.value.user_quota])
    // vpn info
    const vpn = computed(() => $store.state.vm.tables.userVpnTable.byId[server.value.service])
    // password可见性
    const isPwd = ref(true)

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
      clickToCopy,
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
  width: 250px;
}
</style>
