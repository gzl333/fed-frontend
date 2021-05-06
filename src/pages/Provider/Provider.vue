<template>
  <div class="Provider">
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
                    name="detail"
                    icon="task_alt"
                    label="已供资源"
                    :ripple="false"
                    to="/my/provider/detail"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="manage"
                    icon="rule"
                    label="配额审批"
                    :ripple="false"
                    to="/my/provider/manage"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="join"
                    icon="task_alt"
                    label="加入联邦"
                    :ripple="false"
                    to="/my/provider/join"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="quit"
                    icon="description"
                    label="退出联邦"
                    :ripple="false"
                    to="/my/provider/quit"
                    exact
                  />
                </q-tabs>
              </div>

              <div class="col-1">
                <global-add-button/>
              </div>

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
import GlobalHeader from 'components/GlobalHeader.vue'
import GlobalAddButton from 'components/GlobalAddButton.vue'

export default defineComponent({
  name: 'Provider',
  components: {
    GlobalHeader,
    GlobalAddButton
  },
  props: {},
  setup () {
    return {
      activeTab: ref('detail')
    }
  }
})
</script>

<style lang="scss" scoped>
.Provider {
}
</style>
