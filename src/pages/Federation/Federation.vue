<template>
  <div class="Federation">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <global-header class="content-fixed-width"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">
            <div class="row">
              <div class="text-h6 q-pt-lg q-px-none">
                联邦管理
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
                    name="member"
                    icon="task_alt"
                    label="成员列表"
                    :ripple="false"
                    to="/my/federation/member_list"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="join"
                    icon="task_alt"
                    label="加入申请列表"
                    :ripple="false"
                    to="/my/federation/join_list"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="adjust"
                    icon="task_alt"
                    label="调整申请列表"
                    :ripple="false"
                    to="/my/federation/adjust_list"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="quit"
                    icon="task_alt"
                    label="退出申请列表"
                    :ripple="false"
                    to="/my/federation/quit_list"
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
  name: 'Federation',
  components: {
    GlobalHeader,
    GlobalAddButton
  },
  props: {},
  setup () {
    return {
      activeTab: ref('member_list')
    }
  }
})
</script>

<style lang="scss" scoped>
.Federation {
}
</style>
