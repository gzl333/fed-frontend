<template>
  <div class="GroupQuotaIndex">

    <div class="column items-start q-py-none q-px-none">

      <div class="col-auto">
        <q-tabs
          v-model="tab"
          active-color="primary"
          align="left"
          narrow-indicator
        >
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="quota"
                       label="现有组配额"
                       to="/my/group/quota/list"/>
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="application"
                       label="申请记录"
                       to="/my/group/quota/application"/>
        </q-tabs>

      </div>

      <div class="col-auto">
        <q-separator/>
        <router-view class="router-view"/>
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
.router-view {
  width: $general-width-no-padding;
}
</style>
