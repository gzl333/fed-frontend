<template>
  <div class="FederationMonitor">
    <div class="column items-start q-py-none q-px-none">

      <div class="col-auto">
        <q-tabs
          v-model="tab"
          indicator-color="primary"
          active-color="primary"
          align="left"
          inline-label
        >
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="storage"
                       icon="mdi-database"
                       :label="$t('存储集群')"
                       to="/my/federation/monitor/storage"/>
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="server"
                       icon="mdi-server"
                       :label="$t('主机集群')"
                       to="/my/federation/monitor/server"/>
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="meeting"
                       icon="las la-video"
                       :label="$t('视频会议')"
                       to="/my/federation/monitor/meeting"/>
        </q-tabs>
      </div>

      <div class="col-auto">
        <q-separator />
        <router-view class="content-fixed-width-no-padding"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'FederationMonitor',
  components: {},
  props: {},
  setup () {
    return {
      tab: ref('storage')
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitor {
}
</style>
