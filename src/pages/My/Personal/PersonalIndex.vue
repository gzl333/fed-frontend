<template>
  <div class="PersonalIndex">
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
                {{ $t('个人资源') }}
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
                    name="vm"
                    icon="computer"
                    :label="$t('云主机')"
                    :ripple="false"
                    to="/my/personal/vm"
                  />
<!--                  <q-route-tab-->
<!--                    disable-->
<!--                    no-caps-->
<!--                    class="q-px-none q-py-md q-mx-md"-->
<!--                    name="disk"-->
<!--                    icon="fas fa-compact-disc"-->
<!--                    label="云硬盘"-->
<!--                    :ripple="false"-->
<!--                    to="/my/personal/vd"-->
<!--                    exact-->
<!--                  />-->
                  <q-route-tab
                    disable
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="obs"
                    icon="fas fa-database"
                    label="对象存储"
                    :ripple="false"
                    to="/my/personal/obs"
                  />
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-md"
                    name="quota"
                    icon="fas fa-file-alt"
                    :label="$t('云主机配额')"
                    :ripple="false"
                    to="/my/personal/quota"
                  />
                  <q-route-tab
                    no-caps
                    class="q-px-none q-py-md q-mx-sm"
                    name="vpn"
                    icon="vpn_lock"
                    label="VPN"
                    :ripple="false"
                    to="/my/personal/vpn"
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
import GlobalHeader from 'components/GlobalHeader/GlobalHeader.vue'
import GlobalAddButton from 'components/Personal/PersonalAddButton.vue'

export default defineComponent({
  name: 'PersonalIndex',
  components: {
    GlobalHeader,
    GlobalAddButton
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
.PersonalIndex {
}

.btn-add {
  float: right;
  top: 33px;
  right: 20px;
}
</style>
