<template>
  <div class="HistogramChart">
    <div ref="container" :style="{ width: '1000px', height: '400px' }">1111</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref, onMounted } from 'vue'
import { StateInterface } from 'src/store'
import * as echarts from 'echarts/core'
import {
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useStore } from 'vuex'
echarts.use([
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
])
export default defineComponent({
  name: 'HistogramChart',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const container = ref<HTMLElement>()
    const services = computed(() => $store.getters['vm/getAllService'](true))
    onMounted(() => {
      const chart = echarts.init(container.value!)
      const option = computed(() => ({
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: services.value,
          source: [
            { product: 'Matcha Latte', 科技云联邦研发与运行: 43.3, 大规模对象存储: 85.8, 国家基础学科公共科学数据中心: 93.7, 中国科技云智能运管: 61.5 },
            { product: 'Milk Tea', 科技云联邦研发与运行: 83.1, 大规模对象存储: 73.4, 国家基础学科公共科学数据中心: 55.1, 中国科技云智能运管: 71.5 },
            { product: 'Cheese Cocoa', 科技云联邦研发与运行: 86.4, 大规模对象存储: 65.2, 国家基础学科公共科学数据中心: 82.5, 中国科技云智能运管: 81.5 },
            { product: 'Walnut Brownie', 科技云联邦研发与运行: 72.4, 大规模对象存储: 53.9, 国家基础学科公共科学数据中心: 39.1, 中国科技云智能运管: 51.5 }
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
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
.HistogramChart {
}
</style>
