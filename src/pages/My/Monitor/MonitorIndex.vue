<template>
  <div class="MonitorIndex">
    <div class="column">

      <!--      <div class="col-auto">-->
      <!--        <div class="row justify-center">-->
      <!--          <global-header-content class="content-fixed-width"/>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      <q-separator/>-->

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">
            <div class="row">
              <div class="text-h6 q-pt-lg q-px-none">
                综合监控
              </div>
            </div>

            <div class="row">
              <div class="col">
                <q-tabs
                  v-model="activeTab"
                  indicator-color="primary"
                  active-color="primary"
                  align="left"
                  inline-label
                >
                  <q-route-tab
                    class="q-px-none q-py-md q-mr-md"
                    name="meeting"
                    icon="insert_chart_outlined"
                    :label="$t('视频会议')"
                    :ripple="false"
                    to="/my/monitor/meeting"
                  />
                  <q-route-tab
                    v-if="$store.state.account.items.fedRole === 'federal-admin'"
                    class="q-px-none q-py-md q-mr-md"
                    name="server"
                    icon="insights"
                    :label="$t('主机集群')"
                    :ripple="false"
                    to="/my/monitor/server"
                  />
                  <q-route-tab
                    v-if="$store.state.account.items.fedRole === 'federal-admin'"
                    class="q-px-none q-py-md q-mr-md"
                    name="storage"
                    icon="insert_chart_outlined"
                    :label="$t('存储集群')"
                    :ripple="false"
                    to="/my/monitor/storage"
                  />
                  <!--DEV-->
<!--                  <q-route-tab-->
<!--                    v-if="$store.state.account.items.fedRole === 'federal-admin' && isDev"-->
<!--                    class="q-px-none q-py-md q-mx-md"-->
<!--                    name="DEV"-->
<!--                    icon="insights"-->
<!--                    :label="$t('DEV')"-->
<!--                    :ripple="false"-->
<!--                    to="/my/federation/dev"-->
<!--                  />-->
                </q-tabs>
              </div>

              <!--              <div class="col-1">-->
              <!--                <global-add-button/>-->
              <!--              </div>-->

            </div>
          </div>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto q-pt-xl">
        <div class="row justify-center">

          <router-view class="content-fixed-width"/>

        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MonitorIndex',
  components: {},
  props: {},
  emits: {},
  setup () {
    return {
      activeTab: ref('meeting')
    }
  }
})
</script>

<style lang="scss" scoped>
.MonitorIndex {
}
</style>
