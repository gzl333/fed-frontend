<template>
  <div class="GroupIndex">
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
                {{ $t('项目组资源') }}
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
                    no-caps
                    class="q-px-none q-py-md q-mr-md"
                    name="list"
                    icon="format_list_bulleted"
                    :label="$t('项目组')"
                    :ripple="false"
                    to="/my/group/list"
                  />
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-sm"
                    name="server"
                    icon="computer"
                    :label="$t('云主机')"
                    :ripple="false"
                    to="/my/group/server"
                  />
                  <!--                  <q-route-tab-->
                  <!--                    disable-->
                  <!--                    no-caps-->
                  <!--                    class="q-px-none q-py-md q-mx-md"-->
                  <!--                    name="obs"-->
                  <!--                    icon="fas fa-database"-->
                  <!--                    :label="$t('组对象存储')"-->
                  <!--                    :ripple="false"-->
                  <!--                    to="/my/group_obsolete/obs"-->
                  <!--                  />-->
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="quota"
                    icon="fas fa-file-alt"
                    :label="$t('云主机配额')"
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

<!--      <q-scroll-area style="height: calc(100vh - 300px); width: 1720px;" visible>-->

        <div class="col-auto q-pt-xl">
          <div class="row justify-center">
            <!--          <div class="col"/>-->
            <!--          <div class="col-xs-12 col-md-10">-->
            <router-view class="content-fixed-width"/>
            <!--          </div>-->
            <!--          <div class="col"/>-->
          </div>
        </div>

<!--      </q-scroll-area>-->

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
import GroupAddButton from 'components/Group/GroupAddButton.vue'

export default defineComponent({
  name: 'GroupIndex',
  components: {
    // GlobalHeaderContent,
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
