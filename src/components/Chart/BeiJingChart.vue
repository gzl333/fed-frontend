<template>
  <div class="CountryMeetingMap">
    <div ref="container" style="width: 100%; height: 100%;"/>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'

import * as echarts from 'echarts'
import bj from 'assets/map/BeiJing.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'

export default defineComponent({
  name: 'CountryMeetingMap',
  components: {},
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const container = ref<HTMLElement>()
    onMounted(() => {
      const chart = echarts.init(container.value!)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      chart.setOption(props.option)
      const { option } = toRefs(props)
      watch(option, () => {
        chart.setOption(props.option)
      }, { deep: true })
    })

    return {
      container
    }
  }
})
</script>

<style lang="scss" scoped>
.CountryMeetingMap {
}
</style>
