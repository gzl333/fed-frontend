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
                  align="left"
                  inline-label
                >
                  <q-route-tab
                    class="q-px-none q-py-md q-mr-md"
                    name="list"
                    icon="task_alt"
                    label="已有配额"
                    :ripple="false"
                    to="/my/quota/list"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="application"
                    icon="description"
                    label="配额申请"
                    :ripple="false"
                    to="/my/quota/application"
                    exact
                  />
                  <q-route-tab
                    class="q-px-none q-py-md q-mx-md"
                    name="manage"
                    icon="rule"
                    label="配额审批"
                    :ripple="false"
                    to="/my/quota/manage"
                    exact
                  />
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
          <!--          <div class="col"/>-->
          <!--          <div class="col-xs-12 col-md-10">-->
          <router-view class="content-fixed-width"/>
          <!--          </div>-->
          <!--          <div class="col"/>-->
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
  name: 'Quota',
  components: {
    GlobalHeader,
    GlobalAddButton
  },
  props: {},
  setup () {
    return {
      activeTab: ref('list')
    }
  }
})
</script>

<style lang="scss" scoped>
.Quota {
}

.btn-add {
  float: right;
  top: 33px;
  right: 20px;
}
</style>
