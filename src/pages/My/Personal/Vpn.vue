<template>
  <div class="Vpn">

    <div class="row items-center justify-between q-py-md">
      <div v-if="!vpns" class="col">
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
              <q-tab :ripple="false"
                     v-for="vpn in vpns" :key="vpn.id" :name="vpn.id"
              >
                <div class="text-left">{{ $store.state.fed.tables.serviceTable.byId[vpn.id]?.name }}</div>
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

              <q-tab-panel v-for="vpn in vpns" :key="vpn.id" :name="vpn.id" class="bg-grey-1">

                <div class="row q-pb-sm items-center">
                  <div class="col q-pb-lg text-primary">
                    {{$store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[vpn.id]?.data_center].name}} - {{ $store.state.fed.tables.serviceTable.byId[vpn.id]?.name }}
                  </div>
                  <div class="col"></div>
                </div>

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN 用户名
                  </div>
                  <div class="col">
                    {{ vpn.username }}
                    <q-btn
                      class="col-shrink q-px-xs text-primary" flat icon="content_copy" size="sm"
                      @click="clickToCopy(vpn.username)">
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

<!--                  <div class="col row q-gutter-sm">-->
<!--                    <q-input class="password-input"-->
<!--                             :loading="isLoading"-->
<!--                             v-model="vpn.password"-->
<!--                             :type="isPwds[vpn.id] ? 'password' : 'text'"-->
<!--                             readonly borderless dense square outlined>-->
<!--                      <template v-slot:prepend>-->
<!--                        <q-icon-->
<!--                          :name="isPwds[vpn.id] ? 'visibility' : 'visibility_off'"-->
<!--                          @click="isPwds[vpn.id] = !isPwds[vpn.id]"-->
<!--                        />-->
<!--                      </template>-->
<!--                    </q-input>-->
<!--                    &lt;!&ndash;            {{ vpn[1].password }}&ndash;&gt;-->
<!--                    <q-btn-->
<!--                      class="col-shrink q-px-xs text-primary" flat icon="content_copy" size="xs"-->
<!--                      @click="clickToCopy(vpn.password)">-->
<!--                      <q-tooltip>-->
<!--                        复制-->
<!--                      </q-tooltip>-->
<!--                    </q-btn>-->

<!--                    <q-btn label="修改密码" padding="none" dense flat color="primary"-->
<!--                           @click="$store.dispatch('vm/popEditVpnPass', vpn)"/>-->
<!--                  </div>-->

                  <div class="col-shrink">
                    <!--根据内容改变长度的input. 一个字母占8像素，一个汉字占16像素.https://github.com/quasarframework/quasar/issues/1958-->
                    <q-input :input-style="{width:`${vpn.password.length * 8}px`, maxWidth: '200px', minWidth: '32px'}"
                             v-model="vpn.password" readonly borderless dense
                             :type="isPwds[vpn.id] ? 'password' : 'text'">
                      <template v-slot:append>
                        <q-icon :name="isPwds[vpn.id] ? 'visibility' : 'visibility_off'" @click="isPwds[vpn.id] = !isPwds[vpn.id]"/>
                        <q-btn class="q-px-xs" flat color="primary" icon="content_copy" size="sm"
                               @click="clickToCopy(vpn.password, true)">
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
                           @click="$store.dispatch('vm/fetchConfig', vpn.id)"/>
                  </div>
                </div>

                <div class="row q-pb-sm items-center">
                  <div class="col-2 text-grey">
                    VPN CA证书
                  </div>
                  <div class="col">
                    <q-btn label="下载" class="" color="primary" padding="none" dense flat
                           @click="$store.dispatch('vm/fetchCa', vpn.id)"/>
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
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import useCopyToClipboard from 'src/hooks/useCopyToClipboard'

export default defineComponent({
  name: 'Vpn',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    const vpns = computed(() => Object.values($store.state.server.tables.userVpnTable.byId))

    const tab = ref('1')

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // password可见性
    const isPwds = computed(() => {
      const isPwds = {}
      vpns.value.forEach((vpn) => {
        Object.assign(isPwds, { [vpn.id]: true })
      })
      return reactive(isPwds)
    })

    // 修改密码loading状态
    const isLoading = ref(false)

    return {
      $store,
      vpns,
      tab,
      isPwds,
      isLoading,
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
  //height: 20px;
  width: 280px;
}
</style>
