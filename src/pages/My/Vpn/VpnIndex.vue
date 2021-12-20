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

            <div class="row" style="height: 64px">
              <div class="col">

                <div v-if="datacentersFiltered.length === 0" class="row full-height items-center">
                  <div class="col">所输关键字无筛选结果</div>
                </div>

                <q-tabs
                  v-else
                  v-model="tabDataCenter"
                  indicator-color="primary"
                  active-color="primary"
                  align="left"
                  inline-label
                >
                  <q-tab
                    v-for="id in datacentersFiltered"
                    :key="id"
                    class="q-px-none q-py-md q-mr-md"
                    :name="id"
                    icon="vpn_lock"
                    :label="$i18n.locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[id].name : $store.state.fed.tables.dataCenterTable.byId[id].name_en"
                    :ripple="false"
                  />
                </q-tabs>
              </div>

              <div class="col-2">
                <div class="row full-height items-center">
                  <q-input class="col" dense outlined v-model="filter" :label="$t('筛选机构')" stack-label>
                    <template v-slot:prepend>
                      <q-icon name="search"/>
                    </template>
                    <template v-slot:append v-if="filter">
                      <q-icon name="close" @click="filter = ''" class="cursor-pointer"/>
                    </template>
                  </q-input>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto q-pt-xl">
        <div class="row justify-center">
          <div class="content-fixed-width">

            <div v-if="datacentersFiltered.length !== 0" class="row">

              <div class="col-auto">
                <q-tabs
                  v-model="tabService"
                  vertical
                  active-color="primary"
                  active-bg-color="grey-2"
                >
                  <q-tab
                    v-for="serviceId in $store.state.fed.tables.dataCenterTable.byId[tabDataCenter]?.services"
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
                  v-model="tabService"
                  animated
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                >

                  <q-tab-panel
                    v-for="serviceId in $store.state.fed.tables.dataCenterTable.byId[tabDataCenter]?.services"
                    :key="serviceId" :name="serviceId"
                    class="bg-grey-2 overflow-hidden q-py-none"
                    style="min-height: 192px;"
                  >

                    <div v-if="!$store.state.fed.tables.serviceTable.byId[tabService].need_vpn">
                      {{ $t('该服务无需VPN。如有疑问，请联系该服务管理员。') }}
                    </div>

                    <div v-else>
                      <div class="row items-center" style="height: 48px">
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

                      <div class="row items-center" style="height: 48px">
                        <div class="col-2 text-grey">
                          VPN 密码
                        </div>

                        <div class="col-shrink">
                          <!-- 根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                          <q-input
                            :input-style="{width:`${vpn?.password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                            v-model="pwdValue" readonly borderless dense
                            :type="pwdVisibilities[tabService] ? 'password' : 'text'">
                            <template v-slot:append>
                              <q-icon :name="pwdVisibilities[tabService] ? 'visibility' : 'visibility_off'"
                                      @click="pwdVisibilities[tabService] = !pwdVisibilities[tabService]"/>
                              <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                                     @click="clickToCopy(vpn?.password, true)">
                                <q-tooltip>
                                  复制
                                </q-tooltip>
                              </q-btn>
                              <q-btn icon="edit" size="sm" dense flat color="primary"
                                     @click="$store.dispatch('server/popEditVpnPass', vpn)">
                                <q-tooltip>
                                  修改
                                </q-tooltip>
                              </q-btn>
                            </template>
                          </q-input>

                        </div>

                      </div>

                      <div class="row items-center" style="height: 48px">
                        <div class="col-2 text-grey">
                          VPN 配置文件
                        </div>
                        <div class="col">
                          <q-btn label="下载" class=" " color="primary" padding="none" dense flat
                                 @click="$store.dispatch('server/fetchConfig', tabService)"/>
                        </div>
                      </div>

                      <div class="row items-center" style="height: 48px">
                        <div class="col-2 text-grey">
                          VPN CA证书
                        </div>
                        <div class="col">
                          <q-btn label="下载" class="" color="primary" padding="none" dense flat
                                 @click="$store.dispatch('server/fetchCa', tabService)"/>
                        </div>
                      </div>

                      <div class="row items-center" style="height: 48px">
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

    // 筛选datacenter的关键字
    const filter = ref('')

    // 筛选后的datacenter结果
    const datacentersFiltered = computed(() => $store.state.fed.tables.dataCenterTable.allIds.filter(dataCenterId => ($store.state.fed.tables.dataCenterTable.byId[dataCenterId].name.includes(filter.value) || $store.state.fed.tables.dataCenterTable.byId[dataCenterId].name_en.toLowerCase().includes(filter.value.toLowerCase()))).map(a => a).sort((a, b) => a.localeCompare(b)))

    // (1)tab初始状态
    const tabDataCenter = ref('') // dataCenterId
    const tabService = ref('') // serviceId

    // (2)tab选择默认项的方法
    const chooseTabDataCenter = () => {
      tabDataCenter.value = datacentersFiltered.value[0]
    }
    const chooseTabService = () => {
      tabService.value = $store.state.fed.tables.dataCenterTable.byId[tabDataCenter.value]?.services[0]
    }

    // (3)setup时调用一次，table已加载时进入页面要选一次默认值
    chooseTabDataCenter()
    chooseTabService()

    // (4)dataCenterTable变化，filter变化时：横向tab默认选择第一项，
    watch([$store.state.fed.tables.dataCenterTable, filter], chooseTabDataCenter)

    // (5)serviceTable或者tabDataCenter变化时： 属相tab选择services里第一项
    watch([$store.state.fed.tables.serviceTable, tabDataCenter], chooseTabService)

    // 全部vpn对象
    const vpn = computed(() => $store.state.server.tables.userVpnTable.byId[tabService.value])

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // 所有password input的可见性
    const pwdVisibilities = computed(() => {
      const pwdVisibilities = {}
      $store.state.fed.tables.serviceTable.allIds.forEach((serviceId: string) => {
        Object.assign(pwdVisibilities, {
          [serviceId]: true
        })
      })
      return reactive(pwdVisibilities)
    })

    // pwd 值
    const pwdValue = computed(() => $store.state.server.tables.userVpnTable.byId[tabService.value]?.password)

    // 修改密码loading状态
    const isLoading = ref(false)

    const gotoManualVpn = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = computed(() => location.origin + (locale.value === 'zh' ? '/manual/vpn' : '/manual/en/vpn'))
      window.open(url.value)
    }

    return {
      datacentersFiltered,
      filter,
      tabDataCenter,
      tabService,
      vpn,
      pwdVisibilities,
      pwdValue,
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
