<template>
  <q-page>
    <div class="Usage">
      <div class="row tab-area">
        <q-tabs
          v-model="activeTab"
          class=""
          indicator-color="primary"
          align="left"
          inline-label
        >
          <q-route-tab
            name="vm"
            icon="computer"
            label="云主机"
            class="q-px-xl"
            :ripple="false"
            to="/my/usage/vm"
            exact
          />
          <q-route-tab
            disable
            name="disk"
            icon="save"
            label="云硬盘"
            class="q-px-xl"
            :ripple="false"
            to="/my/usage/vd"
            exact
          />
          <q-route-tab
            disable
            name="obs"
            icon="sd_card"
            label="对象存储"
            class="q-px-xl"
            :ripple="false"
            to="/my/usage/obs"
            exact
          />
          <q-route-tab
            name="vpn"
            icon="vpn_lock"
            label="VPN"
            class="q-px-xl"
            :ripple="false"
            to="/my/usage/vpn"
            exact
          />
        </q-tabs>
      </div>

      <div class="row">
        <q-scroll-area class="scroll-area">
          <router-view/>
        </q-scroll-area>
      </div>

    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'UsageLayout',
  components: {},
  props: {},
  setup () {
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

.tab-area {
  border-bottom: $grey-5 solid 1px;
}

.scroll-area {
  width: calc(100vw - 165px);
  height: calc(100vh - 115px);
}
</style>
