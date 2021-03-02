<template>
  <q-page>
  <div class="Usage">

    <q-splitter
      v-model="splitterModel"
      style="height: calc(100vh - 66px);"
      :limits="[0, 20]"
    >

      <template v-slot:before>
        <div class="usage-left">
          tree
        </div>
      </template>

      <template v-slot:separator >
        <q-btn label="toggle" @click="alert()" />
<!--        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator" />-->
      </template>

      <template v-slot:after>
        <q-tabs
          v-model="activeTab"
          class="text-nord1 bg-nord6"
          active-color="nord7"
          indicator-color="nord0"
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
        <router-view/>

      </template>

    </q-splitter>

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
.usage-left {
  min-width: 200px;
  background-color: $nord9;
}
</style>
