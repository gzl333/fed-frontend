<template>
  <div class="LineChart">
    <div ref="container" :style="{ width: '205px', height: '40px' }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition])
export default defineComponent({
  name: 'LineChart',
  components: {},
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const container = ref<HTMLElement>()
    const lineData: any = ref([])
    lineData.value.push(0)
    lineData.value.push(props.chartData.usage)
    lineData.value.push(props.chartData.min)
    lineData.value.push(props.chartData.max)
    const getChartData = (data: []) => {
      console.log('我是data', data)
      lineData.value = data
    }
    onMounted(() => {
      const chart = echarts.init(container.value!)
      const option = computed(() => ({
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: ['初始', '平均', '最小', '最大']
        },
        yAxis: {
          type: 'value',
          show: false,
          max: 100,
          splitLine: { show: false }
        },
        series: [
          {
            data: lineData.value,
            type: 'line',
            symbol: 'none'
          }
        ]
      }))
      chart.setOption(option.value)
      watch(option, () => {
        chart.setOption(option.value)
      })
    })
    return {
      container,
      getChartData
    }
  }
})
</script>

<style lang="scss" scoped>
.LineChart {
}
</style>
