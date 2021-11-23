<template>
  <div class="PieChart">

    <!--container尺寸由调用者决定-->
    <div ref="container" style="width: 100%; height: 100%;"/>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, toRefs } from 'vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
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
// 注册所需组件
echarts.use(
  [TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
)
/* echarts引入 */

export default defineComponent({
  name: 'PieChart',
  components: {},
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    // const $store = useStore<StateInterface>()
    // const $router = useRouter()
    // const { locale } = useI18n({ useScope: 'global' })

    // 绑定div容器的引用，在vue编译过程中绑定容器引用
    const container = ref<HTMLElement>()

    // onMounted时再渲染echarts，否则div容器的引用还未绑定
    onMounted(() => {
      // 初始化当前chart对象
      const chart = echarts.init(container.value!)

      // onMounted时必须渲染一次, 否则切换页面不显示
      chart.setOption(props.option)

      // 保持图表数据更新的方法
      const { option } = toRefs(props)
      watch(option, // watch所监听的值： 放法1： 把props.option转化成响应式对象。 方法2：写成函数返回值形式() => props.option
        () => {
          chart.setOption(props.option)
        },
        { deep: true })
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
