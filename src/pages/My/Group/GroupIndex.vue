<template>
  <div class="GroupIndex">
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
                {{ $t('组资源') }}
              </div>
            </div>

            <div class="row">
              <div class="col">

                <q-tabs
                  v-model="activeTab"
                  indicator-color="primary"
                  active-color=""
                  align="left"
                  inline-label
                >
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mr-md"
                    name="list"
                    icon="format_list_bulleted"
                    :label="$t('组')"
                    :ripple="false"
                    to="/my/group/list"
                  />
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-sm"
                    name="server"
                    icon="computer"
                    :label="$t('组云主机')"
                    :ripple="false"
                    to="/my/group/server"
                  />
                  <q-route-tab
                    :disable="process?.env.PROD"
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="obs"
                    icon="fas fa-database"
                    label="组对象存储"
                    :ripple="false"
                    to="/my/group/obs"
                  />
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="quota"
                    icon="fas fa-file-alt"
                    :label="$t('组云主机配额')"
                    :ripple="false"
                    to="/my/group/quota"
                  />
                </q-tabs>
              </div>

              <div class="col-1">
                <group-add-button/>
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
import GlobalHeader from 'components/GlobalHeader/GlobalHeader.vue'
import GroupAddButton from 'components/Group/GroupAddButton.vue'

export default defineComponent({
  name: 'GroupIndex',
  components: {
    GlobalHeader,
    GroupAddButton
  },
  props: {},
  setup () {
    return {
      activeTab: ref('vm'),
      fabButton: ref(false)
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupIndex {
}
</style>
