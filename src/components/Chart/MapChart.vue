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
    const mapChange = ref()
    const roamMap = (val: number) => {
      mapChange.value = val
    }
    onMounted(() => {
      const chart: any = echarts.init(container.value!)
      echarts.registerMap('china', china as GeoJSONSourceInput)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      chart.setOption(props.option)
      const { option } = toRefs(props)
      // const roamMap = (flag: any) => {
      //   const currentZoom = chart.getOption().geo[0].zoom
      //   let increaseAmplitude = 0
      //   if (flag === 1) {
      //     increaseAmplitude = 0.8
      //     // option.value.geo.zoom = option.value.geo.zoom * increaseAmplitude
      //   } else {
      //     increaseAmplitude = 1.2
      //     // option.value.geo.zoom = option.value.geo.zoom * increaseAmplitude
      //   }
      //   chart.setOption({
      //     geo: {
      //       zoom: currentZoom * increaseAmplitude
      //     }
      //   })
      // }
      watch(option, () => {
        chart.clear()
        chart.setOption(props.option)
      }, { deep: true })
      watch(mapChange, () => {
        if (mapChange.value !== null) {
          const currentZoom = chart.getOption().geo[0].zoom
          let increaseAmplitude = 0
          if (mapChange.value === 1) {
            increaseAmplitude = 0.8
          } else {
            increaseAmplitude = 1.2
          }
          if ((currentZoom * increaseAmplitude >= 1) && (currentZoom * increaseAmplitude <= 5)) {
            chart.setOption({
              geo: {
                zoom: currentZoom * increaseAmplitude
              }
            })
          }
          mapChange.value = null
        }
      })
    })
    return {
      container,
      roamMap
    }
  }
})
</script>

<style lang="scss" scoped>
.CountryMeetingMap {
}
</style>
