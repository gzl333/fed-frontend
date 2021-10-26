<template>
  <div class="GroupQuotaApply">
    <div class="column q-py-md">

      <div class="col">
        <div class="row items-center title-area q-pb-md">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="$router.back()"/>
          <span> {{ $t('申请项目组云主机配额') }}</span>
        </div>
      </div>

      <div class="col">
        <quota-apply-card :is-group="true" :service-id="serviceId" :group-id="groupId"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import QuotaApplyCard from 'components/Quota/QuotaApplyCard.vue'

export default defineComponent({
  name: 'GroupQuotaApply',
  components: {
    QuotaApplyCard
  },
  props: {},
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })

    // 获取url所传参数.
    const serviceId = $route.query.service as string // string or undefined
    const groupId = $route.query.group as string

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    return {
      serviceId,
      groupId,
      locale,
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaApply {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
