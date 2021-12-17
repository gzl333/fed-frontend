<template>
  <div class="CountryMeetingMap row">
    <div ref="container" style="width: 95%; height: 100%;"/>
    <div style="background-color: #FAFAFA; width: 5%;" class="row column justify-end">
      <q-btn outline color="white" text-color="black" icon="add" class="q-mb-md" @click="roamMap(0)"/>
      <q-btn outline color="white" text-color="black" icon="remove" @click="roamMap(1)"/>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'

import * as echarts from 'echarts'
import china from 'assets/map/China.json'
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
    let myChart: any
    const roamMap = (flag: any) => {
      const currentZoom = myChart.getOption().geo[0].zoom
      let increaseAmplitude = 0
      if (flag === 1) {
        increaseAmplitude = 0.8
      } else {
        increaseAmplitude = 1.2
      }
      if ((currentZoom * increaseAmplitude >= 1) && (currentZoom * increaseAmplitude <= 150)) {
        myChart.setOption({
          geo: {
            zoom: currentZoom * increaseAmplitude
          }
        })
      }
    }
    onMounted(() => {
      const chart: any = echarts.init(container.value!)
      myChart = chart
      echarts.registerMap('china', china as GeoJSONSourceInput)
      chart.setOption(props.option)
      // chart.on('mouseup', function (params: any) {
      //   console.log(params)
      //   console.log(chart.getOption().geo)
      // })
      const { option } = toRefs(props)
      watch(option, () => {
        console.log(props.option)
        chart.clear()
        chart.setOption(props.option)
      }, { deep: true })
    })
    return {
      container,
      myChart,
      roamMap
    }
  }
})
</script>

<style lang="scss" scoped>
.CountryMeetingMap {
}
</style>
