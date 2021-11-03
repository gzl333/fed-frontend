<template>
  <div class="PieChart">
    <div ref="container" :style="{ width: '400px', height: '350px' }"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

export default defineComponent({
  name: 'PieChart',
  components: {},
  props: {
    data: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const container = ref<HTMLElement>()
    onMounted(() => {
      const chart = echarts.init(container.value!)
      const option = computed(() => ({
        title: {
          text: props.title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (data: any) {
            if (props.title === '内存') {
              return data.seriesName + '<br/>' + data.name + ': ' + data.value / 1024 + ' GB'
            } else if (props.title === 'CPU') {
              return data.seriesName + '<br/>' + data.name + ': ' + data.value + ' 核'
            } else {
              return data.seriesName + '<br/>' + data.name + ': ' + data.value + ' GB'
            }
          }
        },
        // color: ['#F2C037', '#4caf50', '#027BE3'],
        series: [
          {
            name: '提供者',
            type: 'pie',
            radius: '50%',
            data: props.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
.PieChart {
}
</style>
