<template>
  <div class="PersonalIndex">
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
                {{ $t('个人资源') }}
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
                    class="q-px-none q-py-md q-mr-md text-bold"
                    name="server"
                    icon="computer"
                    :label="$t('云主机')"
                    :ripple="false"
                    to="/my/personal/server"
                  />
                  <!--                  <q-route-tab-->
                  <!--                    disable-->
                  <!--                    no-caps-->
                  <!--                    class="q-px-none q-py-md q-mx-md"-->
                  <!--                    name="obs"-->
                  <!--                    icon="fas fa-database"-->
                  <!--                    label="对象存储"-->
                  <!--                    :ripple="false"-->
                  <!--                    to="/my/personal/obs"-->
                  <!--                  />-->
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="quota"
                    icon="fas fa-file-alt"
                    :label="$t('云主机配额')"
                    :ripple="false"
                    to="/my/personal/quota"
                  />
<!--                  <q-route-tab-->
<!--                    no-caps-->
<!--                    class="q-px-none q-py-md q-mx-sm"-->
<!--                    name="vpn"-->
<!--                    icon="vpn_lock"-->
<!--                    label="VPN"-->
<!--                    :ripple="false"-->
<!--                    to="/my/personal/vpn"-->
<!--                  />-->
                </q-tabs>
              </div>

              <div class="col-1">
                <personal-add-button/>
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
// import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
import PersonalAddButton from 'components/Personal/PersonalAddButton.vue'

export default defineComponent({
  name: 'PersonalIndex',
  components: {
    // GlobalHeaderContent,
    PersonalAddButton
  },
  props: {},
  setup () {
    const activeTab = ref('server')
    const fabButton = ref(false)

    return {
      activeTab,
      fabButton
    }
  }
})
</script>

<style lang="scss" scoped>
.PersonalIndex {
}
</style>
