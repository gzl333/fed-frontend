<template>
  <div class="Vpn">

    <div class="row items-center justify-between q-py-md">
      <div v-if="!vpns" class="col">
        正在加载，请稍候
      </div>

      <div v-else class="col column">

        <div class="row">
          <div class="col-2">
            <q-tabs
              v-model="tab"
              vertical
              active-color="primary"
              active-bg-color="grey-1"
            >
              <q-tab v-for="vpn in vpns" :key="vpn.id" :name="vpn.id" :ripple="false"
                     :label="$store.state.vm.tables.globalServiceTable.byId[vpn.id]?.name"/>
            </q-tabs>
          </div>

          <div class="col-10">
            <q-tab-panels
              v-model="tab"
              animated
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >

              <q-tab-panel v-for="vpn in vpns" :key="vpn.id" :name="vpn.id"  class="bg-grey-1">
                <div class="row">
                  <div class="col q-pb-lg text-primary">
                    {{ $store.state.vm.tables.globalServiceTable.byId[vpn.id]?.name }}VPN信息
                  </div>
                  <div class="col"></div>
                </div>
                <div class="row">
                  <div class="col-2 q-pb-md text-grey">
                    VPN 用户名
                  </div>
                  <div class="col">
                    {{ vpn.username }}
                    <q-btn
                      class="col-shrink q-px-xs text-primary" flat icon="content_copy" size="xs"
                      @click="clickToCopy(vpn.username)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-pb-md text-grey">
                    VPN 密码
                  </div>
                  <div class="col row q-gutter-sm">
                    <q-input class="password-input"
                             :loading="isLoading"
                             v-model="vpn.password"
                             :type="isPwd ? 'password' : 'text'"
                             readonly borderless dense square outlined>
                      <template v-slot:prepend>
                        <q-icon
                          :name="isPwd ? 'visibility' : 'visibility_off'"
                          @click="isPwd = !isPwd"
                        />
                      </template>
                    </q-input>
                    <!--            {{ vpn[1].password }}-->
                    <q-btn
                      class="col-shrink q-px-xs text-primary" flat icon="content_copy" size="xs"
                      @click="clickToCopy(vpn.password)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>

                    <q-btn label="修改密码" padding="none" dense flat color="primary"
                           @click="popEditVpn(vpn)"/>
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-pb-md text-grey">
                    VPN 配置文件
                  </div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                           @click="fetchConfig(vpn.id)"/>
                  </div>
                </div>
                <div class="row">
                  <div class="col-2 q-pb-md text-grey">
                    VPN CA证书
                  </div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="fetchCa(vpn.id)"/>
                  </div>
                </div>
              </q-tab-panel>

            </q-tab-panels>
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
import { copyToClipboard, useQuasar } from 'quasar'
import { VpnInterface } from 'src/store/vm/state'

export default defineComponent({
  name: 'Vpn',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $q = useQuasar()

    const vpns = computed(() => Object.values($store.state.vm.tables.userVpnTable.byId))

    const tab = ref('1')

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

    // password可见性
    const isPwd = ref(true)

    // 修改密码loading状态
    const isLoading = ref(false)
    // vpn 修改密码
    const popEditVpn = (vpn: VpnInterface) => {
      $q.dialog({
        title: `修改${$store.state.vm.tables.userServiceTable.byId[vpn.id].name}的VPN密码`,
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
          serviceId: vpn.id,
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

    const fetchCa = (serviceId: string) => {
      const url = 'https://vms.cstcloud.cn/api/vpn/' + serviceId + '/ca/'
      window.open(url)
    }
    // download vpn config
    const fetchConfig = (serviceId: string) => {
      const url = 'https://vms.cstcloud.cn/api/vpn/' + serviceId + '/config/'
      window.open(url)
    }
    return {
      $store,
      vpns,
      tab,
      isPwd,
      isLoading,
      popEditVpn,
      fetchCa,
      fetchConfig,
      clickToCopy
    }
  }
})
</script>

<style lang="scss" scoped>
.Vpn {
}

.section {
  border: 1px solid $grey-4;
}

.password-input {
  height: 20px;
  width: 280px;
}
</style>
