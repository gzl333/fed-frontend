<template>
  <div class="GroupQuotaDetail">
    <quota-detail-card :quota-id="quotaId" is-group/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import QuotaDetailCard from 'components/Quota/QuotaDetailCard.vue'

export default defineComponent({
  name: 'GroupQuotaDetail',
  components: {
    QuotaDetailCard
  },
  props: {},
  setup () {
    const $route = useRoute()
    // 从route对象中读取id参数
    const quotaId = $route.params.quotaId as string
    return {
      quotaId
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaDetail {
}
</style>
