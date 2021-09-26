<template>
  <div class="LineChart">
    <div ref="container" :style="{ width: '1000px', height: '300px' }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { StateInterface } from 'src/store'

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { useStore } from 'vuex'
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])
export default defineComponent({
  name: 'LineChart',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const container = ref<HTMLElement>()
    const services = computed(() => $store.getters['vm/getAllService']())
    onMounted(() => {
      const chart = echarts.init(container.value!)
      const option = computed(() => ({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: services.value
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: services.value[0],
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: services.value[1],
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: services.value[2],
            type: 'line',
            stack: 'Total',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          },
          {
            name: services.value[3],
            type: 'line',
            stack: 'Total',
            data: [320, 502, 301, 334, 390, 330, 320]
          }
        ]
      }))
      chart.setOption(option.value)
      watch(option, () => {
        chart.setOption(option.value)
      })
    })
    return {
      container
    }
  }
})
</script>

<style lang="scss" scoped>
.LineChart {
}
</style>
