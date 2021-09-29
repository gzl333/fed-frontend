<template>
  <div class="GroupQuotaIndex">

    <div class="column items-start q-py-none q-px-none">

      <div class="col-auto">
        <q-tabs
          v-model="tab"
          indicator-color="primary"
          active-color="primary"
          align="left"
          inline-label
        >
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="quota"
                       icon="fas fa-file-alt"
                       :label="$t('现有组配额')"
                       to="/my/group/quota/list"/>
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="application"
                       icon="rule"
                       :label="$t('申请记录')"
                       to="/my/group/quota/application"/>
        </q-tabs>
      </div>

      <div class="col-auto">
        <q-separator/>
        <router-view class="content-fixed-width-no-padding"/>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GroupQuotaIndex',
  components: {},
  props: {},
  setup () {
    const tab = ref('quota')
    return {
      tab
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaIndex {
}
</style>
