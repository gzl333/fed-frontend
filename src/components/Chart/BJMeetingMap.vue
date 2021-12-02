<template>
  <div class="bjMeetingMap">
    <div ref="container" :style="{ width: '900', height: '600px' }"/>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'

import * as echarts from 'echarts'
import bj from 'assets/map/BeiJing.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'

export default defineComponent({
  name: 'bjMeetingMap',
  components: {},
  props: {},
  setup () {
    const container = ref<HTMLElement>()
    const geoCoordsMap: any = ref({})
    const connectData: any = ref([])
    const series: any = ref([])
    let index = 0
    const style = 'path://M807.4 938.5c-139.5-8-250.2-31.7-250.2-173.2v-95.5c0-35.5 72.5-64.3 108-64.3h0.3l0.9-152.4c0-8.5-6.9-15.4-15.4-15.4H373.2c-8.5 0-15.4 6.9-15.4 15.4l0.6 148.7c33.6 2.1 103.8 30 103.8 64.1v95.5c0 142.2-111.8 168.4-252.3 175.3l-0.1 0.3 0.9 71.5c0 8.5 6.9 15.4 15.4 15.4h568.1c8.5 0 15.4-6.9 15.4-15.4l-0.8-69.8-1.4-0.2zM598.2 64.5V18.6c0-8.5-6.9-15.4-15.4-15.4H428.6c-8.5 0-15.4 6.9-15.4 15.4V67C212.1 111.8 61.7 291.3 61.7 506c0 153.6 77 289.2 194.4 370.3l42.7-136.7C236 681 196.7 597.4 196.7 504.7c0-177.4 143.8-321.3 321.3-321.3s321.3 143.8 321.3 321.3c0 97.9-43.8 185.5-112.8 244.5l40.1 127.4C884.2 795.4 961.4 659.7 961.4 506c0-218.8-156.2-401.1-363.2-441.5z'
    const convertData = function (data: any[]) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i]
        const fromCoords = geoCoordsMap.value[dataItem[0].name]
        const toCoords = geoCoordsMap.value[dataItem[1].name]
        if (fromCoords && toCoords) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoords, toCoords],
            value: dataItem[1].value,
            status: dataItem[1].status,
            ping: dataItem[1].ping,
            ipv4: dataItem[1].ipv4
          })
        }
      }
      return res
    }
    const getData = (coodrs: Record<string, number[]>, data: []) => {
      geoCoordsMap.value = coodrs
      connectData.value = data
      const dataArr = []
      const startArr = ['网络中心', connectData.value]
      dataArr.push(startArr)
      dataArr.forEach(function (item: any) {
        series.value.push(
          {
            name: item[0],
            type: 'lines',
            zlevel: 2,
            symbol: ['none'],
            symbolSize: 9,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.3,
              symbol: style,
              symbolSize: 6
            },
            lineStyle: {
              normal: {
                // 线段颜色
                color: function () {
                  const length = item[1].length - 1
                  const copyIndex = index
                  if (index < length) {
                    index = index + 1
                  } else {
                    index = 0
                  }
                  if (item[1][copyIndex][1].status === '0') {
                    return '#FF0000'
                  } else {
                    return '#00FF00'
                  }
                },
                width: 1.3,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke',
              number: 3,
              scale: 5
            },
            label: {
              normal: {
                show: true,
                // 点字体颜色
                // color: '#fff',
                position: 'right',
                formatter: '{b}'
              }
            },
            symbolSize: function (val: number[]) {
              return val[2]
            },
            itemStyle: {
              normal: {
                // 点的颜色
                // color: color[i]
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            data: item[1].map(function (dataItem: any) {
              return {
                name: dataItem[1].name,
                value: geoCoordsMap.value[dataItem[1].name].concat([dataItem[1].value]),
                status: dataItem[1].status
              }
            }
            )
          })
      })
    }

    onMounted(() => {
      const chart = echarts.init(container.value!)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      const option = computed(() => ({
        backgroundColor: '#FAFAFA',
        title: {
          text: '视频会议节点网络状态-北京市',
          left: '55%',
          textStyle: {
            color: '#000000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            if (params.seriesType === 'effectScatter') {
              const status = params.data.status === '0' ? '离线' : '在线'
              return params.data.name + '<br/>' + '状态:' + status
            } else if (params.seriesType === 'lines') {
              const name = params.data.fromName + '——' + params.data.toName
              const status = params.data.status === '0' ? '<span style="color: red">离线</span>' : '<span style="color: green">在线</span>'
              const ipv4 = params.data.ipv4
              if (params.data.status === '0') {
                return name + '<br/>' + '状态:' + status + '</br>' + 'IP地址:' + ipv4
              } else {
                return name + '<br/>' + '状态:' + status + '</br>' + 'ping值:' + params.data.ping + '</br>' + 'IP地址:' + ipv4
              }
            } else {
              return params.name
            }
          }
        },
        geo: {
          map: 'bj',
          label: {
            emphasis: {
              show: true,
              // 地图高亮字体颜色
              color: '#012248'
            }
          },
          roam: 'none',
          center: [116.335858, 39.9799827],
          zoom: 5.5,
          itemStyle: {
            normal: {
              areaColor: '#E6E6E6',
              borderColor: 'skyblue',
              borderWidth: 1
            },
            emphasis: {
              areaColor: '#F5A9A9'
            }
          }
        },
        series: series.value
      }))
      chart.setOption(option.value)
      watch(option, () => {
        chart.clear()
        chart.setOption(option.value)
      })
      watch(series.value, () => {
        chart.clear()
        chart.setOption(option.value)
      })
    })

    return {
      container,
      getData
    }
  }
})
</script>

<style lang="scss" scoped>
.bjMeetingMap {
}
</style>
