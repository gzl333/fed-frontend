<template>
  <div class="row routerview-area">
    <div class="col-2"></div>
    <div class="col column">
      <div v-for="vpn in vpns" :key="vpn.id" class="col-3 section q-gutter-sm">
        <div class="row">
          <div class="col-2 q-pb-lg text-primary">
            {{ $store.state.usage.tables.userServiceTable.byId[vpn.id].name }}
          </div>
          <div class="col"></div>
        </div>
        <div class="row">
          <div class="col-2 text-grey-7">
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
          <div class="col-2 text-grey-7">
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
                   @click="popEdit(vpn)"/>
          </div>
        </div>
        <div class="row">
          <div class="col-2 text-grey-7">
            VPN 配置文件
          </div>
          <div class="col">
            <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                   @click="fetchConfig(vpn.id)"/>

          </div>
        </div>
        <div class="row">
          <div class="col-2 text-grey-7">
            VPN CA证书
          </div>
          <div class="col">
            <q-btn label="下载" class="" color="primary" padding="none" dense flat
                   @click="fetchCa(vpn.id)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-3 section">
      vpn使用说明：
      待补充
      <pre>{{ $store.state.usage.tables.userVpnTable.byId }}</pre>
    </div>
    <div class="col-2"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { copyToClipboard, useQuasar } from 'quasar'
import { VpnInterface } from 'src/store/usage/state'

export default defineComponent({
  name: 'Vpn',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $q = useQuasar()

    // void $store.dispatch('usage/updateVpnAll')
    // const vpnMap = computed(() => $store.state.usage.vpn)
    const vpns = computed(() => Object.values($store.state.usage.tables.userVpnTable.byId))

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
    const popEdit = (vpn: VpnInterface) => {
      $q.dialog({
        title: `修改${$store.state.usage.tables.userServiceTable.byId[vpn.id].name}的VPN密码`,
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
      isPwd,
      isLoading,
      popEdit,
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

.routerview-area {
  height: calc(100vh - 115px);
  width: calc(100vw - 165px);
}

.section {
  margin: 30px 30px;
  padding: 10px 20px;
  border: 1px solid $grey-4;
  border-radius: 5px;
}

.password-input {
  height: 20px;
  width: 280px;
}
</style>
