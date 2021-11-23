<template>
  <div class="DEV-Test">
    this is DEV-Test
    <q-slider v-model="slider" :min="0" :max="1000"/>

    <!--chart调用者提供：1.option值。 2.container尺寸-->
    <pie-chart :option="option" style="width: 600px; height: 300px"/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import PieChart from 'components/Chart/PieChart.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'DEV-Test',
  components: { PieChart },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    const slider = ref(0)

    // 把option包裹成响应式对象。一定要在最外部包裹computed，其他写法都不是完整的响应式对象
    // 内部可用store getter/响应式对象/函数等来写
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
          data: [
            {
              name: $store.state.fed.tables.serviceTable.byId[1]?.name,
              value: slider.value
            },
            {
              name: $store.state.fed.tables.serviceTable.byId[2]?.name,
              value: $store.state.fed.tables.serviceAllocationTable.byId['2']?.vcpu_total
            }
          ]
        }
      ]
    }))

    return {
      option,
      slider
    }
  }
})
</script>

<style lang="scss" scoped>
.DEV-Test {
}
</style>
