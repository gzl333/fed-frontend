<template>
  <div class="Usage">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <div class="col"/>
          <div class="col-xs-12 col-md-10">
            <global-header/>
          </div>
          <div class="col"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="col"/>
          <div class="col-xs-12 col-md-10">
            <div class="row">
              <div class="text-h6 q-pt-lg q-px-none">
                在用资源
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-tabs
                  v-model="activeTab"
                  indicator-color="primary"
                  align="left"
                  inline-label
                >
                  <q-route-tab
                    class="q-px-none q-py-md q-mr-md"
                    name="vm"
                    icon="computer"
                    label="云主机"
                    :ripple="false"
                    to="/my/usage/vm"
                    exact
                  />
                  <q-route-tab
                    disable
                    class="q-px-none q-py-md q-mx-md"
                    name="disk"
                    icon="fas fa-compact-disc"
                    label="云硬盘"
                    :ripple="false"
                    to="/my/usage/vd"
                    exact
                  />
                  <q-route-tab
                    disable
                    class="q-px-none q-py-md q-mx-md"
                    name="obs"
                    icon="fas fa-database"
                    label="对象存储"
                    :ripple="false"
                    to="/my/usage/obs"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-sm"
                    name="vpn"
                    icon="vpn_lock"
                    label="VPN"
                    :ripple="false"
                    to="/my/usage/vpn"
                    exact
                  />
                </q-tabs>
              </div>

              <div class="col-1">
                <q-btn class="btn-add q-pa-none q-ma-none shadow-10" round :ripple="false" size="lg" icon="add"
                       color="primary" :to="{ path: '/my/usage/vmcreate' }">
                  <q-tooltip>
                    新建云主机
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto q-pt-xl">
        <div class="row justify-center">
          <div class="col"/>
          <div class="col-xs-12 col-md-10">
            <router-view/>
          </div>
          <div class="col"/>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GlobalHeader from 'components/GlobalHeader.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'UsageLayout',
  components: { GlobalHeader },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    void $store.dispatch('usage/updateUsageTable')

    return {
      activeTab: ref('vm'),
      splitterModel: ref(20) // start at 50%
    }
  }
})
</script>

<style lang="scss" scoped>
.Usage {
}

.btn-add {
  float: right;
  top: 33px;
  right: 20px;
}
</style>
