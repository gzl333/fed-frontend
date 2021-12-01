<template>
  <div class="FederationMonitorVideoMeeting">
    <div class="row justify-end">
      <q-icon class="col-1" name="refresh" size="md" v-show="isShow" @click="refresh"/>
      <q-select outlined dense v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3"/>
    </div>
    <q-card flat bordered class="my-card row q-mt-md">
      <div class="col-9">
        <country-meeting-map ref="CRef"></country-meeting-map>
      </div>
      <div class="col-3">
        <q-card class="my-card q-mt-md">
          <q-scroll-area style="height: 550px">
            <div v-for="item in countryCardData" :key="item[1].name">
              <div class="row q-pa-sm">
                <div class="col-4">{{ item[1].name }}</div>
                <div class="col-3">
                  <span>状态:</span>
                  <span :class="item[1].status === '0' ? 'text-negative' : 'text-positive'">{{
                      item[1].status === '0' ? '离线' : '在线'
                    }}</span>
                </div>
                <div class="col-5" v-if="item[1].status === '1'">ping:{{ (parseFloat(item[1].ping) * 1000).toFixed(3) }}ms</div>
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </q-card>
    <q-card flat bordered class="my-card row q-mt-md">
      <div class="col-9">
        <b-j-meeting-map ref="BRef"></b-j-meeting-map>
      </div>
      <div class="col-3">
        <q-card class="my-card q-mt-md">
          <q-scroll-area style="height: 550px">
            <div v-for="item in bjCardData" :key="item[1].name">
              <div class="row q-pa-sm">
                <div class="col-4">{{ item[1].name }}</div>
                <div class="col-3">
                  <span>状态:</span>
                  <span :class="item[1].status === '0' ? 'text-negative' : 'text-positive'">{{
                      item[1].status === '0' ? '离线' : '在线'
                    }}</span>
                </div>
                <div class="col-5" v-if="item[1].status === '1'">ping:{{ (parseFloat(item[1].ping) * 1000).toFixed(3) }}ms
                </div>
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import { $api } from 'boot/api'
import CountryMeetingMap from 'components/Chart/CountryMeetingMap.vue'
import BJMeetingMap from 'components/Chart/BJMeetingMap.vue'

export default defineComponent({
  name: 'FederationMonitorVideoMeeting',
  components: {
    CountryMeetingMap,
    BJMeetingMap
  },
  props: {},
  emits: {},
  setup () {
    const CRef: any = ref(null)
    const BRef: any = ref(null)
    const statusData: any = ref([])
    const pingData: any = ref([])
    const countryCardData: any = ref([])
    const bjCardData: any = ref([])
    const countryObj: any = ref({})
    const countryFilterData: any = ref([])
    const bjObj: any = ref({})
    const bjFilterData: any = ref([])
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
          const InArr = []
          const InObj: any = {}
          InArr.push(startObj)
          InObj.name = item1.metric.name
          InObj.value = 4
          InObj.status = item1.value[1]
          InArr.push(InObj)
          countryCardData.value.push(InArr)
          if ((item1.metric.latitude > 115.7 && item1.metric.latitude < 117.4) && (item1.metric.longitude > 39.4 || item1.metric.longitude < 41.6)) {
            bjObj.value[item1.metric.name] = outArr
            const InArr = []
            const InObj: any = {}
            InArr.push(startObj)
            InObj.name = item1.metric.name
            InObj.value = 4
            InObj.status = item1.value[1]
            InArr.push(InObj)
            bjCardData.value.push(InArr)
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
      bjObj.value = {}
      bjCardData.value = []
      void sendData().then(() => {
        isShow.value = true
      })
    }
    const sendData = async () => {
      await getStatusData()
      await getDelayData()
      filterData()
      CRef.value.getData(countryObj.value, countryFilterData.value)
      BRef.value.getData(bjObj.value, bjFilterData.value)
    }
    let timer = setInterval(() => {
      void refresh()
    }, filterSelection.value.value * 1000)
    onMounted(() => {
      void sendData()
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
      BRef,
      CRef,
      countryCardData,
      bjCardData,
      filterSelection,
      filterOptions,
      isShow,
      timer,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorVideoMeeting {
}
</style>
