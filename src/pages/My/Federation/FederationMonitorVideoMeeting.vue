<template>
  <div class="FederationMonitorVideoMeeting.vue">
    <country-meeting-map ref="CRef"></country-meeting-map>
    <b-j-meeting-map ref="BRef"></b-j-meeting-map>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { $api } from 'boot/api'
import CountryMeetingMap from 'components/Chart/CountryMeetingMap.vue'
import BJMeetingMap from 'components/Chart/BJMeetingMap.vue'

export default defineComponent({
  name: 'FederationMonitorVideoMeeting.vue',
  components: {
    CountryMeetingMap,
    BJMeetingMap
  },
  props: {},
  emits: {},
  setup () {
    const CRef: any = ref(null)
    const BRef: any = ref(null)
    const allObj: any = ref({})
    const allData: any = ref([])
    const bjObj: any = ref({})
    const bjData: any = ref([])
    const getStatusData = async () => {
      const config = {
        query: {
          query: 'node_status'
        }
      }
      const startObj = {
        name: '网络中心'
      }
      await $api.monitor.getMonitorVideoQuery(config).then((res: any) => {
        for (const item of res.data[0].value) {
          const outArr = []
          outArr.push(item.metric.latitude)
          outArr.push(item.metric.longitude)
          allObj.value[item.metric.name] = outArr
          if (item.metric.name !== '网络中心') {
            const InArr = []
            const InObj: any = {}
            InArr.push(startObj)
            InObj.name = item.metric.name
            InObj.value = 7
            InObj.status = item.value[1]
            InArr.push(InObj)
            allData.value.push(InArr)
          }
          if ((item.metric.latitude > 115.7 && item.metric.latitude < 117.4) && (item.metric.longitude > 39.4 || item.metric.longitude < 41.6)) {
            bjObj.value[item.metric.name] = outArr
            if (item.metric.name !== '网络中心') {
              const InArr = []
              const InObj: any = {}
              InArr.push(startObj)
              InObj.name = item.metric.name
              InObj.value = 7
              InObj.status = item.value[1]
              InArr.push(InObj)
              bjData.value.push(InArr)
            }
          }
        }
      })
    }
    const getDelayData = async () => {
      const config = {
        query: {
          query: 'node_lantency'
        }
      }
      await $api.monitor.getMonitorVideoQuery(config).then((res) => {
        for (const item of res.data[0].value) {
          if (item.metric.name !== '网络中心') {
            for (const service of allData.value) {
              if (service[1].name === item.metric.name) {
                service[1].ping = item.value[1]
              }
            }
            for (const service of bjData.value) {
              if (service[1].name === item.metric.name) {
                service[1].ping = item.value[1]
              }
            }
          }
        }
      })
    }
    const sendData = async () => {
      await getStatusData()
      await getDelayData()
      CRef.value.getData(allObj.value, allData.value)
      BRef.value.getData(bjObj.value, bjData.value)
    }
    onMounted(() => {
      void sendData()
    })
    return {
      getStatusData,
      getDelayData,
      BRef,
      CRef,
      allData,
      sendData
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorVideoMeeting.vue {
}
</style>
