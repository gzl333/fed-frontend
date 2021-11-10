<template>
  <div class="PieChart">
    <div ref="container" :style="{ width: '410px', height: '260px' }"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
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
          // left: 'center'
          right: 120
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
        legend: {
          orient: 'vertical',
          type: 'scroll',
          left: 0,
          top: 0,
          textStyle: {
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        // color: ['#F2C037', '#4caf50', '#027BE3'],
        series: [
          {
            name: '提供者',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            center: ['65%', '50%'],
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: '#fff',
            //   borderWidth: 2
            // },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '11',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: props.data
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
