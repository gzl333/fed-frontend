<template>
  <div class="PersonalQuota">
    <div class="column items-start q-py-none q-px-none">
      <div class="col-auto">
        <q-tabs
          style="padding-right: 165px"
          v-model="tab"
          active-color="primary"
          align="left"
          narrow-indicator
        >
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="quota"
                       label="已有配额"
                       to="/my/personal/quota/list"/>
          <q-route-tab class="q-px-none q-py-none q-mr-md"
                       :ripple="false"
                       name="application"
                       label="申请记录"
                       to="/my/personal/quota/application"/>
        </q-tabs>
        <q-separator/>
      </div>
      <div class="col-auto">
        <router-view class="router-view"/>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'PersonalQuota',
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
.PersonalQuota {
}

.router-view {
  width: $general-width-no-padding;
}
</style>
