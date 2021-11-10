<template>
  <div class="BeiJingMap row">
    <div ref="container" :style="{ width: '600px', height: '450px' }"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from 'vue'

import * as echarts from 'echarts'
import bj from 'assets/map/beijing.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'

export default defineComponent({
  name: 'BeiJingMap',
  components: {},
  props: {
  },
  setup () {
    const container = ref<HTMLElement>()
    const sanData = ref([])
    const change = (data: []) => {
      sanData.value = data
    }
    onMounted(() => {
      const chart = echarts.init(container.value!)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      const labelData = [
        { name: '怀柔区', value: 38.4, lng: 116.63853, lat: 40.322563 },
        { name: '密云区', value: 47.9, lng: 116.849551, lat: 40.382999 },
        { name: '昌平区', value: 196.3, lng: 116.237832, lat: 40.226854 },
        { name: '顺义区', value: 102, lng: 116.663242, lat: 40.1362 },
        { name: '平谷区', value: 42.3, lng: 117.128025, lat: 40.147115 },
        { name: '门头沟区', value: 30.8, lng: 116.108179, lat: 39.94648 },
        { name: '海淀区', value: 369.4, lng: 116.304872, lat: 39.96553 },
        { name: '石景山区', value: 65.2, lng: 116.229612, lat: 39.912017 },
        { name: '西城区', value: 129.8, lng: 116.372397, lat: 39.918561 },
        { name: '东城区', value: 90.5, lng: 116.42272, lat: 39.934579 },
        { name: '朝阳区', value: 395.5, lng: 116.449767, lat: 39.927254 },
        { name: '大兴区', value: 156.2, lng: 116.348053, lat: 39.732833 },
        { name: '房山区', value: 104.6, lng: 116.149892, lat: 39.755039 },
        { name: '丰台区', value: 232.4, lng: 116.293105, lat: 39.865042 },
        { name: '通州区', value: 42.3, lng: 116.662928, lat: 39.917001 },
        { name: '延庆区', value: 42.3, lng: 115.981186, lat: 40.462706 }
      ]
      const convertData = function (data: any) {
        const res = []
        for (let i = 0; i < data.length; i++) {
          const geoCoord = data[i].LngAndLat
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        return res
      }
      const option = computed(() => ({
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b}'
        },
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
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#ECEFF4',
              borderColor: '#4C566A'
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          },
          zoom: 1.2
        },
        series: [{
          name: '机构',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: convertData(sanData.value),
          symbolSize: function (val: number[]) {
            return val[2]
          },
          showEffectOn: 'emphasis',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params: any) {
                return params.name
              },
              lineHeight: 20,
              backgroundColor: '#fafafa',
              borderColor: '#31CCEC',
              borderWidth: '1',
              borderRadius: 5,
              padding: [5, 15, 4],
              color: '#1d1d1d',
              fontSize: 14,
              fontWeight: 'normal'
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#027BE3'
            }
          }
        }, {
          name: '机构数',
          type: 'map',
          mapType: 'bj',
          geoIndex: 0,
          itemStyle: {
            normal: { label: { show: true } },
            emphasis: { label: { show: true } }
          },
          data: labelData
        }]
      }))
      chart.setOption(option.value)
      watch(option, () => {
        chart.setOption(option.value)
      })
    })
    return {
      container,
      change
    }
  }
})
</script>

<style lang="scss" scoped>
.BeiJingMap {
}
</style>
