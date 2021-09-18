<template>
  <div class="ServiceList">
    this service list
    <pie-chart/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PieChart from 'components/Chart/PieChart.vue'

export default defineComponent({
  name: 'ServiceList',
  components: { PieChart },
  props: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.ServiceList {
}
</style>
