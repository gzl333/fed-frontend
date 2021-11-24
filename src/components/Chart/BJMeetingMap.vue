<template>
  <div class="bjMeetingMap">
      <div ref="container" :style="{ width: '1230px', height: '600px' }"/>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
// import { StateInterface } from 'src/store'
// import { useStore } from 'vuex'

import * as echarts from 'echarts'
import bj from 'assets/map/BeiJing.json'
import { GeoJSONSourceInput } from 'echarts/types/src/coord/geo/geoTypes'
export default defineComponent({
  name: 'bjMeetingMap',
  components: {},
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
    const container = ref<HTMLElement>()
    const geoCoordsMap: any = {
      怀柔区: [116.63853, 40.322563],
      密云区: [116.849551, 40.382999],
      昌平区: [116.237832, 40.226854],
      顺义区: [116.663242, 40.1362],
      平谷区: [117.128025, 40.147115],
      门头沟区: [116.108179, 39.94648],
      海淀区: [116.304872, 39.96553],
      石景山区: [116.229612, 39.912017],
      西城区: [116.372397, 39.918561],
      东城区: [116.42272, 39.934579],
      朝阳区: [116.449767, 39.927254],
      大兴区: [116.348053, 39.732833],
      房山区: [116.149892, 39.755039],
      丰台区: [116.293105, 39.865042],
      通州区: [116.662928, 39.917001],
      延庆区: [115.981186, 40.462706]
    }
    const XAData = [
      [{
        name: '海淀区'
      }, {
        name: '海淀区',
        value: 12
      }],
      [{ name: '海淀区' }, {
        name: '朝阳区',
        value: 12,
        status: '0'
      }],
      [{ name: '海淀区' }, {
        name: '大兴区',
        value: 12,
        status: '0'
      }]
    ]
    const YCData = [
      [{
        name: '怀柔区'
      }, {
        name: '怀柔区',
        value: 12
      }],
      [{
        name: '怀柔区'
      },
      {
        name: '通州区',
        value: 12,
        status: '1'
      }],
      [{
        name: '怀柔区'
      }, {
        name: '石景山区',
        value: 12,
        status: '1'
      }]
    ]
    // const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
    const trainPath = 'path://M807.4 938.5c-139.5-8-250.2-31.7-250.2-173.2v-95.5c0-35.5 72.5-64.3 108-64.3h0.3l0.9-152.4c0-8.5-6.9-15.4-15.4-15.4H373.2c-8.5 0-15.4 6.9-15.4 15.4l0.6 148.7c33.6 2.1 103.8 30 103.8 64.1v95.5c0 142.2-111.8 168.4-252.3 175.3l-0.1 0.3 0.9 71.5c0 8.5 6.9 15.4 15.4 15.4h568.1c8.5 0 15.4-6.9 15.4-15.4l-0.8-69.8-1.4-0.2zM598.2 64.5V18.6c0-8.5-6.9-15.4-15.4-15.4H428.6c-8.5 0-15.4 6.9-15.4 15.4V67C212.1 111.8 61.7 291.3 61.7 506c0 153.6 77 289.2 194.4 370.3l42.7-136.7C236 681 196.7 597.4 196.7 504.7c0-177.4 143.8-321.3 321.3-321.3s321.3 143.8 321.3 321.3c0 97.9-43.8 185.5-112.8 244.5l40.1 127.4C884.2 795.4 961.4 659.7 961.4 506c0-218.8-156.2-401.1-363.2-441.5z'
    const convertData = function (data: any[]) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i]
        const fromCoords = geoCoordsMap[dataItem[0].name]
        const toCoords = geoCoordsMap[dataItem[1].name]
        if (fromCoords && toCoords) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoords, toCoords],
            value: dataItem[1].value
          })
        }
        // console.log(res)
      }
      return res
    }
    let index = 0
    // const color = ['#a6c84c', '#ffa022', '#46bee9']// 航线的颜色
    const series: any = [];
    [['海淀区', XAData], ['怀柔区', YCData]].forEach(function (item: any) {
      series.push({
        name: item[0] + ' Top3',
        type: 'lines',
        zlevel: 1,
        // effect: {
        //   show: false,
        //   period: 6,
        //   trailLength: 0.9,
        // arrow箭头的颜色
        // color: '#BDBDBD',
        // symbolSize: 6
        // },
        lineStyle: {
          normal: {
            // legend 颜色
            // color: color[i],
            width: 0,
            curveness: 0.2
          }
        },
        data: convertData(item[1])
      },
      {
        name: item[0] + ' Top3',
        type: 'lines',
        zlevel: 2,
        symbol: ['none', 'arrow'],
        symbolSize: 11,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          // symbol: 'none',
          symbol: trainPath,
          symbolSize: 8
        },
        lineStyle: {
          normal: {
            // 线段颜色
            color: function () {
              const length = item[1].length - 1
              const index1 = index
              if (index < length) {
                index = index + 1
              } else {
                index = 0
              }
              if (item[1][index1][1].status === '0') {
                return '#FF0000'
              } else {
                return '#00FF00'
              }
            },
            width: 2,
            opacity: 0.6,
            curveness: 0.2
          }
        },
        data: convertData(item[1])
      },
      {
        name: item[0] + ' Top3',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: true,
            // 点字体颜色
            color: '#fff',
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: function (val: number[]) {
          // console.log(val)
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
          console.log('dataItem', dataItem)
          const obj = {
            name: dataItem[1].name,
            value: geoCoordsMap[dataItem[1].name].concat([dataItem[1].value])
          }
          console.log('obj', obj)
          return {
            name: dataItem[1].name,
            value: geoCoordsMap[dataItem[1].name].concat([dataItem[1].value])
          }
        }
        )
      })
    })
    onMounted(() => {
      const chart = echarts.init(container.value!)
      echarts.registerMap('bj', bj as GeoJSONSourceInput)
      const option = computed(() => ({
        backgroundColor: '#ffffff',
        title: {
          text: '视频会议监控（北京市）',
          // subtext: '数据纯属虚构',
          left: 'center',
          textStyle: {
            color: '#000000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            if (params.seriesType === 'effectScatter') {
              return '线路：' + params.data.name + '' + params.data.value[2]
            } else if (params.seriesType === 'lines') {
              return params.data.fromName + '>' + params.data.toName + '<br />' + params.data.value
            } else {
              return params.name
            }
          }
        },
        legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          // data: ['西安 Top3', '西宁 Top3', '银川 Top3'],
          textStyle: {
            // legend 字体颜色
            // color: '#00FF00'
            fontWeight: 'bold',
            fontSize: 15
          },
          selectedMode: 'multiple'
        },
        geo: {
          map: 'bj',
          label: {
            emphasis: {
              show: true,
              // 地图高亮字体颜色
              color: '#00FF00'
            }
          },
          roam: true,
          // center: [105.97, 34.71],
          // 放大我们的地图
          zoom: 1.1,
          itemStyle: {
            normal: {
              areaColor: '#2E3F51',
              borderColor: '#445973',
              borderWidth: 1
            },
            emphasis: {
              areaColor: '#23293A'
            }
          }
        },
        series: series
      }))
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
.bjMeetingMap {
}
</style>
