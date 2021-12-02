<template>
  <div class="FederationMonitorVideoMeeting">
    <div class="row justify-end">
      <q-icon class="col-1" name="refresh" size="md" v-show="isShow" @click="refresh"/>
      <q-select outlined dense v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3"/>
    </div>
    <q-card flat bordered class="my-card row q-mt-md">
      <div class="col-9">
        <map-chart :option="countryOption" style="width: 900px; height: 600px"></map-chart>
      </div>
      <div class="col-3">
        <q-card class="my-card q-mt-md">
          <q-scroll-area style="height: 550px">
            <div v-for="item in countryCardData" :key="item[1].name" class="q-py-xs q-px-md">
              <div class="row justify-center">{{ item[1].name }}</div>
              <div class="row">
                <div class="col-2">IP地址:</div>
                <div class="col-5" v-for="(item1, index) in item[1].ipv4" :key="index">{{ item1 }}</div>
              </div>
              <div class="row">
                <div class="col-7">
                  <span>状态:</span>
                  <span :class="item[1].status === '0' ? 'text-negative' : 'text-positive'">
                    {{item[1].status === '0' ? '离线' : '在线' }}
                  </span>
                </div>
                <div v-if="item[1].status === '1'" class="col-5">
                  ping:{{ (parseFloat(item[1].ping) * 1000).toFixed(3) }}ms
                </div>
              </div>
              <q-separator class="q-mt-sm"/>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </q-card>
    <q-card flat bordered class="my-card row q-mt-md">
      <div class="col-9">
        <map-chart :option="bjOption" style="width: 900px; height: 600px"></map-chart>
      </div>
      <div class="col-3">
        <q-card class="my-card q-mt-md">
          <q-scroll-area style="height: 550px">
            <div v-for="item in bjCardData" :key="item[1].name" class="q-py-xs q-px-md">
              <div class="row justify-center">{{ item[1].name }}</div>
              <div class="row">
                <div class="col-2">IP地址:</div>
                <div class="col-5" v-for="(item1, index) in item[1].ipv4" :key="index">{{ item1 }}</div>
              </div>
              <div class="row">
                <div class="col-7">
                  <span>状态:</span>
                  <span :class="item[1].status === '0' ? 'text-negative' : 'text-positive'">
                    {{item[1].status === '0' ? '离线' : '在线' }}
                  </span>
                </div>
                <div v-if="item[1].status === '1'" class="col-5">
                  ping:{{ (parseFloat(item[1].ping) * 1000).toFixed(3) }}ms
                </div>
              </div>
              <q-separator class="q-mt-sm"/>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { $api } from 'boot/api'
import MapChart from 'components/Chart/MapChart.vue'

export default defineComponent({
  name: 'FederationMonitorVideoMeeting',
  components: {
    MapChart
  },
  props: {},
  emits: {},
  setup () {
    const statusData = ref([])
    const pingData = ref([])
    // 父组件展示需要的数据
    const countryCardData: any = ref([])
    const bjCardData: any = ref([])
    // 所有服务经纬度数据
    const countryObj: Record<string, any> = ref({})
    // 全国地图需要的数据
    const countryFilterData: any = ref([])
    const countrySeries: any = ref([])
    // 北京地图需要的数据
    const bjFilterData: any = ref([])
    const bjSeries: any = ref([])
    // 其他数据
    const isShow = ref(true)
    const filterSelection = ref({
      label: '每30s刷新',
      value: 30
    })
    const filterOptions = [
      {
        label: '每30s刷新',
        value: 30
      },
      {
        label: '每1min刷新',
        value: 60
      },
      {
        label: '每10min刷新',
        value: 600
      },
      {
        label: '每30min刷新',
        value: 1800
      },
      {
        label: '每1h刷新',
        value: 3600
      }
    ]
    const style = 'path://M807.4 938.5c-139.5-8-250.2-31.7-250.2-173.2v-95.5c0-35.5 72.5-64.3 108-64.3h0.3l0.9-152.4c0-8.5-6.9-15.4-15.4-15.4H373.2c-8.5 0-15.4 6.9-15.4 15.4l0.6 148.7c33.6 2.1 103.8 30 103.8 64.1v95.5c0 142.2-111.8 168.4-252.3 175.3l-0.1 0.3 0.9 71.5c0 8.5 6.9 15.4 15.4 15.4h568.1c8.5 0 15.4-6.9 15.4-15.4l-0.8-69.8-1.4-0.2zM598.2 64.5V18.6c0-8.5-6.9-15.4-15.4-15.4H428.6c-8.5 0-15.4 6.9-15.4 15.4V67C212.1 111.8 61.7 291.3 61.7 506c0 153.6 77 289.2 194.4 370.3l42.7-136.7C236 681 196.7 597.4 196.7 504.7c0-177.4 143.8-321.3 321.3-321.3s321.3 143.8 321.3 321.3c0 97.9-43.8 185.5-112.8 244.5l40.1 127.4C884.2 795.4 961.4 659.7 961.4 506c0-218.8-156.2-401.1-363.2-441.5z'
    const countryOption = computed(() => ({
      backgroundColor: '#FAFAFA',
      title: {
        text: '视频会议节点网络状态-全国',
        left: '55%',
        textStyle: {
          color: '#000000'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          if (params.seriesType === 'effectScatter') {
            const status = params.data.status === '0' ? '<span style="color: red">离线</span>' : '<span style="color: green">在线</span>'
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
        map: 'china',
        label: {
          emphasis: {
            show: true,
            color: '#012248'
          }
        },
        roam: 'none',
        top: '30%',
        left: '25%',
        zoom: 1.5,
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
      series: countrySeries.value
    }))
    const bjOption = computed(() => ({
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
      series: bjSeries.value
    }))
    const convertData = function (data: any[]) {
      const res = []
      for (let i = 0; i < data.length; i++) {
        const dataItem = data[i]
        const fromCoords = countryObj.value[dataItem[0].name]
        const toCoords = countryObj.value[dataItem[1].name]
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
    const getCountryData = () => {
      const dataArr = []
      dataArr.push(countryFilterData.value)
      dataArr.forEach(function (item: any) {
        countrySeries.value.push(
          {
            type: 'lines',
            zlevel: 1,
            symbol: ['none'],
            symbolSize: 9,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.3,
              symbol: style,
              symbolSize: 5
            },
            lineStyle: {
              normal: {
                // 线段颜色
                color: function (item1: any) {
                  if (item1.data.status === '0') {
                    return '#FF0000'
                  } else {
                    return '#00FF00'
                  }
                },
                width: 1.2,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item)
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 1,
            rippleEffect: {
              brushType: 'stroke',
              number: 2,
              scale: 4
            },
            label: {
              normal: {
                show: true,
                // color: '#012248',
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
                color: '#5882FA'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            data: item.map(function (dataItem: any) {
              return {
                name: dataItem[1].name,
                value: countryObj.value[dataItem[1].name].concat([dataItem[1].value]),
                status: dataItem[1].status
              }
            }
            )
          })
      })
    }
    const getBJData = () => {
      const dataArr = []
      dataArr.push(bjFilterData.value)
      dataArr.forEach(function (item: any) {
        bjSeries.value.push(
          {
            type: 'lines',
            zlevel: 1,
            symbol: ['none'],
            symbolSize: 9,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.3,
              symbol: style,
              symbolSize: 5
            },
            lineStyle: {
              normal: {
                // 线段颜色
                color: function (item1: any) {
                  if (item1.data.status === '0') {
                    return '#FF0000'
                  } else {
                    return '#00FF00'
                  }
                },
                width: 1.2,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item)
          },
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 1,
            rippleEffect: {
              brushType: 'stroke',
              number: 2,
              scale: 4
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
                color: '#5882FA'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            data: item.map(function (dataItem: any) {
              return {
                name: dataItem[1].name,
                value: countryObj.value[dataItem[1].name].concat([dataItem[1].value]),
                status: dataItem[1].status
              }
            }
            )
          })
      })
    }
    const getStatusData = async () => {
      const config = {
        query: {
          query: 'node_status'
        }
      }
      await $api.monitor.getMonitorVideoQuery(config).then((res: any) => {
        statusData.value = res.data
        handleStatusData()
      })
    }
    const getDelayData = async () => {
      const config = {
        query: {
          query: 'node_lantency'
        }
      }
      await $api.monitor.getMonitorVideoQuery(config).then((res) => {
        pingData.value = res.data
        handlePingData()
      })
    }
    const handleStatusData = () => {
      const startObj = {
        name: '网络中心'
      }
      statusData.value.forEach((item: any) => {
        item.value.forEach((item1: any) => {
          const outArr = []
          outArr.push(item1.metric.latitude)
          outArr.push(item1.metric.longitude)
          countryObj.value[item1.metric.name] = outArr
          const inArr = []
          const inObj: Record<string, any> = {}
          inArr.push(startObj)
          inObj.name = item1.metric.name
          inObj.value = 4
          inObj.status = item1.value[1]
          inObj.ipv4 = item1.metric.ipv4s
          inArr.push(inObj)
          countryCardData.value.push(inArr)
          if ((item1.metric.latitude > 115.7 && item1.metric.latitude < 117.4) && (item1.metric.longitude > 39.4 || item1.metric.longitude < 41.6)) {
            const inArr = []
            const inObj: Record<string, any> = {}
            inArr.push(startObj)
            inObj.name = item1.metric.name
            inObj.value = 4
            inObj.status = item1.value[1]
            inObj.ipv4 = item1.metric.ipv4s
            inArr.push(inObj)
            bjCardData.value.push(inArr)
          }
        })
      })
    }
    const handlePingData = () => {
      pingData.value.forEach((item: any) => {
        item.value.forEach((item1: any) => {
          for (const service of countryCardData.value) {
            if (service[1].name === item1.metric.name) {
              service[1].ping = item1.value[1]
            }
          }
          for (const service of bjCardData.value) {
            if (service[1].name === item1.metric.name) {
              service[1].ping = item1.value[1]
            }
          }
        })
      })
    }
    const filterData = () => {
      countryFilterData.value = countryCardData.value.filter((item: any) => item[1].name !== '网络中心')
      bjFilterData.value = bjCardData.value.filter((item: any) => item[1].name !== '网络中心')
    }
    const refresh = () => {
      isShow.value = false
      countryObj.value = {}
      countryCardData.value = []
      bjCardData.value = []
      void sendData().then(() => {
        isShow.value = true
      })
    }
    const sendData = async () => {
      await getStatusData()
      await getDelayData()
      filterData()
      getCountryData()
      getBJData()
    }
    let timer = setInterval(() => {
      void refresh()
    }, filterSelection.value.value * 1000)
    onMounted(() => {
      void sendData()
      // console.log(countryObj.value)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    watch(filterSelection, () => {
      clearInterval(timer)
      timer = setInterval(() => {
        void refresh()
      }, filterSelection.value.value * 1000)
    })
    return {
      countryCardData,
      bjCardData,
      filterSelection,
      filterOptions,
      isShow,
      countryOption,
      bjOption,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorVideoMeeting {
}
</style>
