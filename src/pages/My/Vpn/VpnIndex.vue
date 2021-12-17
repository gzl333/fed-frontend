<template>
  <div class="VpnIndex">
    <div class="column">

      <!--      <div class="col-auto">-->
      <!--        <div class="row justify-center">-->
      <!--          <global-header-content class="content-fixed-width"/>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <q-separator/>-->

      <div class="col-auto">
        <div class="row justify-center">
          <!--          <div class="col"/>-->
          <div class="content-fixed-width">
            <div class="row">
              <div class="text-h6 q-pt-lg q-px-none">
                VPN
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-tabs
                  v-model="tabHorizontal"
                  indicator-color="primary"
                  active-color="primary"
                  align="left"
                  inline-label
                >
                  <q-tab
                    v-for="id in $store.state.fed.tables.dataCenterTable.allIds.map(a => a).sort((a, b) => a.localeCompare(b))"
                    :key="id"
                    class="q-px-none q-py-md q-mr-md"
                    :name="id"
                    icon="vpn_lock"
                    :label="$i18n.locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[id].name : $store.state.fed.tables.dataCenterTable.byId[id].name_en"
                    :ripple="false"
                  />
                </q-tabs>
              </div>

            </div>
          </div>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto q-pt-xl">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div class="row">
              <div class="col-auto">
                <q-tabs
                  v-model="tabVertical"
                  vertical
                  active-color="primary"
                  active-bg-color="bg-grey-1"
                >
                  <q-tab
                    v-for="serviceId in $store.state.fed.tables.dataCenterTable.byId[tabHorizontal]?.services"
                    :key="serviceId" :name="serviceId"
                    class="q-pl-none"
                    style="justify-content:initial; text-align: left; font-weight: bold;"
                    :ripple="false"
                    no-caps
                  >
                    {{
                      $i18n.locale === 'zh' ?
                        $store.state.fed.tables.serviceTable.byId[serviceId]?.name :
                        $store.state.fed.tables.serviceTable.byId[serviceId]?.name_en
                    }}
                  </q-tab>
                </q-tabs>
              </div>

              <div class="col">
                <q-tab-panels
                  v-model="tabVertical"
                  animated
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                >

                  <q-tab-panel
                    v-for="serviceId in $store.state.fed.tables.dataCenterTable.byId[tabHorizontal]?.services"
                    :key="serviceId" :name="serviceId"
                    class="bg-grey-1 overflow-hidden"
                    style="min-height: 200px;"
                  >

                    <div v-if="!$store.state.fed.tables.serviceTable.byId[tabVertical].need_vpn">
                      {{ $t('该服务未配置VPN。如有疑问，请联系该服务管理员。') }}
                    </div>

                    <div v-else>

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
                          <!-- 根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->

                          <q-input
                            :input-style="{width:`${vpn?.password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                            v-model="passwords[vpn?.id].password" readonly borderless dense
                            :type="passwords[vpn?.id].isPwd ? 'password' : 'text'">
                            <template v-slot:append>
                              <q-icon :name="passwords[vpn?.id].isPwd ? 'visibility' : 'visibility_off'"
                                      @click="passwords[vpn?.id].isPwd = !passwords[vpn?.id].isPwd"/>
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

                    </div>

                  </q-tab-panel>

                </q-tab-panels>
              </div>
            </div>

            <!--            horizontal: {{ tabHorizontal }}-->
            <!--            vertical: {{ tabVertical }}-->

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

export default defineComponent({
  name: 'VpnIndex',
  components: {},
  props: {},
  emits: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // (1)tab初始状态
    const tabHorizontal = ref('')
    const tabVertical = ref('')

    // (2)tab选择默认项的方法
    const chooseTabHorizontal = () => {
      tabHorizontal.value = $store.state.fed.tables.dataCenterTable.allIds.map(a => a).sort((a, b) => a.localeCompare(b))[0]
    }
    const chooseTabVertical = () => {
      tabVertical.value = $store.state.fed.tables.dataCenterTable.byId[tabHorizontal.value]?.services[0]
    }

    // (3)setup时调用一次，table已加载时进入页面要选一次默认值
    chooseTabHorizontal()
    chooseTabVertical()

    // (4)dataCenterTable变化时：横向tab默认选择第一项，
    watch($store.state.fed.tables.dataCenterTable.allIds, chooseTabHorizontal)

    // (5)serviceTable或者tabHorizontal变化时： 属相tab选择services里第一项
    watch([$store.state.fed.tables.serviceTable, tabHorizontal], chooseTabVertical)

    // 全部vpn对象
    const vpn = computed(() => $store.state.server.tables.userVpnTable.byId[tabVertical.value])

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // password input值 及 可见性
    const passwords = computed(() => {
      const passwords = {}
      $store.state.fed.tables.serviceTable.allIds.forEach((serviceId: string) => {
        Object.assign(passwords, {
          [serviceId]: {
            isPwd: true,
            value: $store.state.server.tables.userVpnTable.byId[tabVertical.value]?.password
          }
        })
      })
      return reactive(passwords)
    })

    // 修改密码loading状态
    const isLoading = ref(false)

    const gotoManualVpn = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = computed(() => location.origin + (locale.value === 'zh' ? '/manual/vpn' : '/manual/en/vpn'))
      window.open(url.value)
    }

    return {
      tabHorizontal,
      tabVertical,
      vpn,
      passwords,
      isLoading,
      clickToCopy,
      gotoManualVpn
    }
  }
})
</script>

<style lang="scss" scoped>
.VpnIndex {
}
</style>
