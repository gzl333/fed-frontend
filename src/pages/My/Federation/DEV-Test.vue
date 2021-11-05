<template>
  <div class="DEV-Test">
    this is DEV-Test
    <pie-chart/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PieChart from 'components/Chart/PieChart.vue'

export default defineComponent({
  name: 'DEV-Test',
  components: { PieChart },
  props: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.DEV-Test {
}
</style>
