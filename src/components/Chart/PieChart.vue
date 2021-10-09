<template>
  <div class="PieChart">
    <div ref="container" :style="{ width: '600px', height: '300px' }"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { StateInterface } from 'src/store'
// import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'

/* echarts引入 */
// 引入echarts对象
import * as echarts from 'echarts/core'
// 按需引入echarts组件
import {
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import {
  PieChart
} from 'echarts/charts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import { useStore } from 'vuex'
// 注册所需组件
echarts.use(
  [TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
)
/* echarts引入 */

export default defineComponent({
  name: 'PieChart',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const $router = useRouter()
    // const { locale } = useI18n({ useScope: 'global' })

    // 绑定div容器的引用，在vue编译过程中绑定容器引用
    const container = ref<HTMLElement>()

    // onMounted时再渲染echarts，否则div容器的引用还未绑定
    onMounted(() => {
      // 初始化当前chart对象
      const chart = echarts.init(container.value!)

      // 一定要在最外部包裹computed，其他写法都不是完整的响应式对象
      const option = computed(() => ({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '10',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            // data数组可用getter写
            data: [
              {
                name: $store.state.fed.tables.serviceTable.byId[1]?.name,
                value: 999
              },
              {
                name: $store.state.fed.tables.serviceTable.byId[2]?.name,
                value: 555
              }

            ]
          }
        ]
      }))

      // onMounted时必须渲染一次, 否则切换页面不显示
      chart.setOption(option.value)

      // 保持图表数据更新的方法
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
