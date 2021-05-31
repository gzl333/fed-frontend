<template>
  <div class="Quota">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <global-header class="content-fixed-width"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <!--          <div class="col"/>-->
          <div class="content-fixed-width">
            <div class="row">
              <div class="text-h6 q-pt-lg q-px-none">
                资源配额
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
                    name="list"
                    icon="task_alt"
                    label="现有配额"
                    :ripple="false"
                    to="/my/quota/list"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="application"
                    icon="description"
                    label="申请记录"
                    :ripple="false"
                    to="/my/quota/application"
                    exact
                  />
<!--                  <q-route-tab-->
<!--                    v-if="isQuotaAdmin"-->
<!--                    class="q-px-none q-py-md q-mx-md"-->
<!--                    name="manage"-->
<!--                    icon="rule"-->
<!--                    label="配额审批"-->
<!--                    :ripple="false"-->
<!--                    to="/my/quota/manage"-->
<!--                    exact-->
<!--                  />-->
                </q-tabs>
              </div>

              <div class="col-1">
                <global-add-button/>
              </div>
            </div>
          </div>
          <!--          <div class="col"/>-->
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
import GlobalHeader from 'components/GlobalHeader.vue'
import GlobalAddButton from 'components/usage/UsageAddButton.vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'Quota',
  components: {
    GlobalHeader,
    GlobalAddButton
  },
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
    // // 根据adminQuotaApplicationTable是否为空来判断当前用户是否有权限审批quota，是否显示审批tab
    // const isQuotaAdmin = computed(() => $store.state.applyQuota.tables.adminQuotaApplicationTable.isLoaded)
    return {
      activeTab: ref('list')
      // isQuotaAdmin
    }
  }
})
</script>

<style lang="scss" scoped>
.Quota {
}
</style>
