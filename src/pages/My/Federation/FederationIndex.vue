<template>
  <div class="Federation">
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
                    name="resource"
                    icon="insert_chart_outlined"
                    :label="$t('联邦资源统计')"
                    :ripple="false"
                    to="/my/federation/resource"
                  />
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
// import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
// import GlobalAddButton from 'components/Personal/PersonalAddButton.vue'

export default defineComponent({
  name: 'Federation',
  components: {
    // GlobalHeaderContent,
    // GlobalAddButton
  },
  props: {},
  setup () {
    return {
      isDev: process.env.DEV,
      activeTab: ref('member_list')
    }
  }
})
</script>

<style lang="scss" scoped>
.Federation {
}
</style>
