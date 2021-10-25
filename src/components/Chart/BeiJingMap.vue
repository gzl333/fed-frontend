<template>
  <div class="BeiJingMap">
    <div ref="container" :style="{ width: '700px', height: '450px' }"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import * as echarts from 'echarts'
import bj from 'assets/map/beijing.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'

export default defineComponent({
  name: 'BeiJingMap',
  components: {},
  props: {},
  setup () {
    const container = ref<HTMLElement>()
    onMounted(() => {
      const chart = echarts.init(container.value!)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      const labelData = [
        {
          name: '怀柔区',
          lng: 116.63853,
          lat: 40.322563
        },
        {
          name: '密云区',
          lng: 116.849551,
          lat: 40.382999
        },
        {
          name: '昌平区',
          lng: 116.237832,
          lat: 40.226854
        },
        {
          name: '顺义区',
          lng: 116.663242,
          lat: 40.1362
        },
        {
          name: '平谷区',
          lng: 117.128025,
          lat: 40.147115
        },
        {
          name: '门头沟区',
          lng: 116.108179,
          lat: 39.94648
        },
        {
          name: '海淀区',
          lng: 116.304872,
          lat: 39.96553
        },
        {
          name: '石景山区',
          lng: 116.229612,
          lat: 39.912017
        },
        {
          name: '西城区',
          lng: 116.372397,
          lat: 39.918561
        },
        {
          name: '东城区',
          lng: 116.42272,
          lat: 39.934579
        },
        {
          name: '朝阳区',
          lng: 116.449767,
          lat: 39.927254
        },
        {
          name: '大兴区',
          lng: 116.348053,
          lat: 39.732833
        },
        {
          name: '房山区',
          lng: 116.149892,
          lat: 39.755039
        },
        {
          name: '丰台区',
          lng: 116.293105,
          lat: 39.865042
        }
      ]
      const seriesData = []
      seriesData.push({
        name: '区域',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: labelData,
        label: {
          normal: {
            show: true,
            padding: [10, 20],
            color: '#fff',
            areaColor: '#323c48',
            backgroundColor: '#00A2FF',
            borderRadius: 6,
            formatter: '{b}'
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: 1
      })
      seriesData.push({
        type: 'lines',
        symbol: 'circle',
        symbolSize: [10, 10],
        color: '#ff8003',
        opacity: 1,
        label: {
          show: true,
          padding: [10, 20],
          color: '#fff',
          backgroundColor: '#4C566A',
          borderRadius: 6,
          formatter: '{b}'
        },
        lineStyle: {
          type: 'solid',
          opacity: 1,
          color: '#B48EAD'
        },
        data: [
          {
            name: '中国科学院计算机网络信息中心',
            value: 10,
            coords: [[116.342428, 39.99322], [116.1, 40.9]]
          },
          {
            name: '地球大数据科学工程专项',
            value: 10,
            coords: [[116.63853, 40.322563], [115.73853, 40.8]]
          }
        ]
      })
      const option = {
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}'
        },
        series: seriesData,
        geo: {
          map: 'bj',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#ECEFF4',
              borderColor: '#4C566A'
            }
          }
        }
      }
      chart.setOption(option)
    })
    return {
      container
    }
  }
})
</script>

<style lang="scss" scoped>
.BeiJingMap {
}
</style>
