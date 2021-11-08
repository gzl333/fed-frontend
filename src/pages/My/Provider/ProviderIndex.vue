<template>
  <div class="Provider">
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
                资源提供
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
                    name="quota"
                    icon="rule"
                    :label="$t('用户配额审批')"
                    :ripple="false"
                    to="/my/provider/quota"
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="server"
                    icon="computer"
                    :label="$t('在用云主机统计')"
                    :ripple="false"
                    to="/my/provider/server"
                  />
<!--                  <q-route-tab-->
<!--                    :disable="process?.env.PROD"-->
<!--                    class="q-px-none q-py-md q-mx-md"-->
<!--                    name="provided"-->
<!--                    icon="task_alt"-->
<!--                    label="已供资源列表"-->
<!--                    :ripple="false"-->
<!--                    to="/my/provider/provided"-->
<!--                  />-->
<!--                  <q-route-tab-->
<!--                    :disable="process?.env.PROD"-->
<!--                    class="q-px-none q-py-md q-mx-md"-->
<!--                    name="service"-->
<!--                    icon="task_alt"-->
<!--                    label="接入服务列表"-->
<!--                    :ripple="false"-->
<!--                    to="/my/provider/service"-->
<!--                  />-->

                </q-tabs>
              </div>

<!--              <div class="col-1">-->
<!--                <provider-add-button/>-->
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
// import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
// import ProviderAddButton from 'components/Provider/ProviderAddButton.vue'

export default defineComponent({
  name: 'Provider',
  components: {
    // GlobalHeaderContent,
    // ProviderAddButton
  },
  props: {},
  setup () {
    return {
      activeTab: ref('quota')
    }
  }
})
</script>

<style lang="scss" scoped>
.Provider {
}
</style>
