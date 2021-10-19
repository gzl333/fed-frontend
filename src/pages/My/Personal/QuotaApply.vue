<template>
  <div class="Apply">
    <div class="column q-py-md">

      <div class="col q-pb-md title-area">
        <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
               @click="$router.back"/>
        {{ $t('申请个人云主机配额') }}
      </div>

      <div class="col">
        <quota-apply-card :is-group="false" :service-id="serviceDesignated"/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import QuotaApplyCard from 'components/Quota/QuotaApplyCard.vue'

export default defineComponent({
  name: 'Apply',
  components: {
    QuotaApplyCard
  },
  props: {},
  setup () {
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 获取url所传参数.
    const serviceDesignated = $route.query.service as string // string or undefined

    return {
      serviceDesignated,
      locale
    }
  }
})
</script>

<style lang="scss" scoped>
.Apply {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
