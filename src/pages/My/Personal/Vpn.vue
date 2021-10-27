<template>
  <div class="Vpn">

    <div class="row items-center justify-between q-py-md">
      <div v-if="vpns.length===0" class="col">
        正在加载，请稍候
      </div>

      <div v-else class="col column">
        <div class="row">
          <div class="col-auto">
            <q-tabs
              v-model="tab"
              vertical
              active-color="primary"
            >
              <q-tab v-for="vpn in vpns" :key="vpn?.id" :name="vpn?.id"
                     class="q-pl-none"
                     style="justify-content:initial; text-align: left; font-weight: bold;"
                     :ripple="false"
                     no-caps
              >
                {{
                  locale === 'zh' ?
                    $store.state.fed.tables.serviceTable.byId[vpn?.id]?.name :
                    $store.state.fed.tables.serviceTable.byId[vpn?.id]?.name_en
                }}
              </q-tab>
            </q-tabs>
          </div>

          <div class="col">
            <q-tab-panels
              v-model="tab"
              animated
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >

              <q-tab-panel v-for="vpn in vpns" :key="vpn?.id" :name="vpn?.id" class="bg-grey-1">

                <div class="row q-pb-sm items-center">
                  <div class="col q-pb-lg text-primary">
                    {{
                      $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[vpn?.id]?.data_center].name
                    }}
                    - {{ $store.state.fed.tables.serviceTable.byId[vpn?.id]?.name }}
                  </div>
                  <div class="col"></div>
                </div>

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN 用户名
                  </div>
                  <div class="col">
                    {{ vpn?.username }}
                    <q-btn
                      class="col-shrink q-px-xs text-primary" flat icon="content_copy" size="sm"
                      @click="clickToCopy(vpn?.username)">
                      <q-tooltip>
                        复制
                      </q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN 密码
                  </div>

                  <div class="col-shrink">
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input :input-style="{width:`${vpn.password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                             v-model="vpn.password" readonly borderless dense
                             :type="isPwds[vpn?.id] ? 'password' : 'text'">
                      <template v-slot:append>
                        <q-icon :name="isPwds[vpn?.id] ? 'visibility' : 'visibility_off'"
                                @click="isPwds[vpn?.id] = !isPwds[vpn?.id]"/>
                        <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                               @click="clickToCopy(vpn?.password, true)">
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

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN 配置文件
                  </div>
                  <div class="col">
                    <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                           @click="$store.dispatch('server/fetchConfig', vpn.id)"/>
                  </div>
                </div>

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN CA证书
                  </div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="$store.dispatch('server/fetchCa', vpn.id)"/>
                  </div>
                </div>

                <div class="row q-pb-sm items-center">
<!--                  <div class="col-2 text-grey">-->
<!--                    VPN 使用方法-->
<!--                  </div>-->
                  <div class="col">
                    <q-btn label="查看VPN使用方法" class="" color="primary" padding="none" dense flat
                           @click="gotoManualVpn"/>
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
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import { useI18n } from 'vue-i18n'
import { VpnInterface } from 'src/store/server/state'

export default defineComponent({
  name: 'Vpn',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // const vpns = computed(() => Object.values($store.state.server.tables.userVpnTable.byId))
    const vpns = computed(() => $store.getters['server/getPersonalAvailableVpns'])

    // tab初始状态 (1)
    const tab = ref('')
    // tab默认选择 (2)
    const chooseTabDefault = () => {
      tab.value = vpns.value[0]?.id
    }
    // setup时调用一次 (3) table已加载时进入页面要选一次默认值
    chooseTabDefault()
    // 根据table的变化情况再调用 (4) table未加载时进入页面，每变化一次都要选一次默认值
    watch($store.state.server.tables.userVpnTable, chooseTabDefault)
    /* table 进入页面过程中选择默认项 */

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // password可见性
    const isPwds = computed(() => {
      const isPwds = {}
      vpns.value.forEach((vpn: VpnInterface) => {
        Object.assign(isPwds, { [vpn?.id]: true })
      })
      return reactive(isPwds)
    })

    // 修改密码loading状态
    const isLoading = ref(false)

    const gotoManualVpn = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = computed(() => location.origin + (locale.value === 'zh' ? '/manual/vpn' : '/manual/en/vpn'))
      window.open(url.value)
    }

    return {
      locale,
      vpns,
      tab,
      isPwds,
      isLoading,
      clickToCopy,
      gotoManualVpn
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
  //height: 20px;
  width: 280px;
}
</style>
