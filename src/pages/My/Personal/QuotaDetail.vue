<template>
  <div class="QuotaDetail">
    <quota-detail-card :quota-id="quotaId" :is-group="false"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import QuotaDetailCard from 'components/Quota/QuotaDetailCard.vue'

export default defineComponent({
  name: 'QuotaDetail',
  components: {
    QuotaDetailCard
  },
  props: {},
  setup () {
    const $route = useRoute()
    // 从route对象中读取id参数
    const quotaId = $route.params.id as string
    return {
      quotaId
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaDetail {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.content-area {
  width: $general-width-no-padding;
}

.quota-area {
  margin-top: 10px;
  padding: 15px 0;
  height: 150px;
  border: $grey-4 1px solid;
  border-radius: 5px;
}

.quota-column {
  height: 120px;
}

</style>
