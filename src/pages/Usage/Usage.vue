<template>
  <q-page>
  <div class="Usage">
    <div>
      <q-tabs
        v-model="activeTab"
        class="text-nord1 bg-nord6"
        active-color="nord7"
        indicator-color="nord7"
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
          name="disk"
          icon="save"
          label="云硬盘"
          class="q-px-xl"
          :ripple="false"
          to="/my/usage/vd"
          exact
        />
        <q-route-tab
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
      <router-view/>
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
      activeTab: ref('vm')
    }
  }
})
</script>

<style lang="scss" scoped>
.Usage {
}
</style>
