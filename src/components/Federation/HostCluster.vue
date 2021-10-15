<template>
  <div class="StorageCluster">
    <div v-if="JSON.stringify(hostData) !== '{}'">
      <div class="text-subtitle1 text-weight-bold">{{ hostData.name }}</div>
      <div class="row q-mt-sm">
        <div class="col-2">
          <q-card flat bordered class="no-border-radius q-pb-xs">
            <div class="row q-pb-lg">
              <div class="col-11 text-center">主机数</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowHost"
                      @click="refresh({ service_id: hostData.service_id, type: 'host' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ hostData.host_count }}</div>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">在线</div>
              <div class="text-center text-h4 text-weight-regular text-positive q-mt-sm q-pa-sm">{{hostData.host_up_count }}
              </div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">掉线</div>
              <div class="text-center text-h4 text-weight-regular text-negative q-mt-sm q-pa-sm">
                {{ parseFloat(hostData.host_count) - parseFloat(hostData.host_up_count) }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius q-pb-lg">
            <div class="row">
              <div class="col-11 text-center">集群状态</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowHealthy" @click="refresh({ service_id: hostData.service_id, type: 'healthy' })"/>
            </div>
            <div :class="hostData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            hostData.health_status === '1' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md' :
            'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md'">
              {{ hostData.health_status === '0' ? 'Healthy' : hostData.health_status === '1' ? 'Warning' : 'Fatal' }}
            </div>
          </q-card>
        </div>
        <div class="col-2 q-ml-md" v-for="(item, index) in dataArr" :key="index">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均{{item.name}}使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="item.isOrNotShow" @click="refresh({ service_id: hostData.service_id, type: item.name})"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-md">{{ parseFloat(item.usage).toFixed(2) + '%' }}</div>
            <line-chart :ref="el=>{divNodes[index] = el}" :chartData="item"></line-chart>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(item.max).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(item.min).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-1 q-ml-md">
          <q-card flat bordered class="no-border-radius q-pa-md">
            <div class="text-center q-mt-lg q-pb-lg q-pt-md">
              <p class="text-primary">Go To</p>
              <p class="text-primary">Grafana</p>
              <p>详细信息</p>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { apiBase } from 'src/store'
import axios from 'axios'
import LineChart from 'components/Chart/LineChart.vue'
export default defineComponent({
  name: 'HostCluster',
  components: {
    LineChart
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    const hostData: any = ref({})
    const dataArr: any = ref([])
    const divNodes = ref<typeof LineChart[]>([])
    const isShowHost = ref(true)
    const isShowHealthy = ref(true)
    const getHostQuery = async (payload: { service_id: string }) => {
      const api = apiBase + '/monitor/server/query'
      const hostQuery: string[] = ['host_count', 'host_up_count', 'health_status', 'cpu_usage', 'max_cpu_usage', 'min_cpu_usage', 'mem_usage', 'max_mem_usage', 'min_mem_usage', 'disk_usage', 'max_disk_usage', 'min_disk_usage']
      const config = {
        params: {
          service_id: payload.service_id,
          query: ''
        }
      }
      const hostObject: Record<string, string> = {}
      for (const item of hostQuery) {
        config.params.query = item
        await axios.get(api, config).then((res) => {
          if (!hostObject.name) {
            hostObject.name = res.data[0].monitor.name
          }
          if (!hostObject.service_id) {
            hostObject.service_id = res.data[0].monitor.service_id
          }
          hostObject[item] = res.data[0].value[1]
        }).catch((error) => {
          console.log(error)
        })
      }
      const hostArr = []
      const cpuObj: Record<string, string | boolean> = {}
      cpuObj.name = 'CPU'
      cpuObj.isOrNotShow = true
      cpuObj.usage = hostObject.cpu_usage
      cpuObj.min = hostObject.min_cpu_usage
      cpuObj.max = hostObject.max_cpu_usage
      const memObj: Record<string, string | boolean> = {}
      memObj.name = '内存'
      memObj.isOrNotShow = true
      memObj.usage = hostObject.mem_usage
      memObj.min = hostObject.min_mem_usage
      memObj.max = hostObject.max_mem_usage
      const diskObj: Record<string, string | boolean> = {}
      diskObj.name = '磁盘'
      diskObj.isOrNotShow = true
      diskObj.usage = hostObject.disk_usage
      diskObj.min = hostObject.min_disk_usage
      diskObj.max = hostObject.max_disk_usage
      hostArr.push(cpuObj)
      hostArr.push(memObj)
      hostArr.push(diskObj)
      return {
        hostObject,
        hostArr
      }
    }
    const refresh = async (payload: { service_id: string, type: string }) => {
      const api = apiBase + '/monitor/server/query'
      const config = {
        params: {
          service_id: payload.service_id,
          query: ''
        }
      }
      if (payload.type === 'host') {
        isShowHost.value = false
        const hostQueryArr = ['host_count', 'host_up_count']
        for (const item of hostQueryArr) {
          config.params.query = item
          const newData = item
          await axios.get(api, config).then((res) => {
            hostData.value[newData] = res.data[0].value[1]
            isShowHost.value = true
          })
        }
      } else if (payload.type === 'healthy') {
        isShowHealthy.value = false
        config.params.query = 'health_status'
        void await axios.get(api, config).then((res) => {
          hostData.value.health_status = res.data[0].value[1]
          isShowHealthy.value = true
        })
      } else if (payload.type === 'CPU') {
        dataArr.value[0].isOrNotShow = false
        const cpuArr = ['cpu_usage', 'min_cpu_usage', 'max_cpu_usage']
        const cpuChart: number[] = []
        for (const item of cpuArr) {
          config.params.query = item
          await axios.get(api, config).then((res) => {
            if (config.params.query === 'cpu_usage') {
              dataArr.value[0].usage = res.data[0].value[1]
            } else if (config.params.query === 'min_cpu_usage') {
              dataArr.value[0].min = res.data[0].value[1]
            } else {
              dataArr.value[0].max = res.data[0].value[1]
            }
          })
        }
        cpuChart.push(0)
        cpuChart.push(dataArr.value[0].usage)
        cpuChart.push(dataArr.value[0].min)
        cpuChart.push(dataArr.value[0].max)
        divNodes.value[0].getChartData(cpuChart)
        dataArr.value[0].isOrNotShow = true
      } else if (payload.type === '内存') {
        dataArr.value[1].isOrNotShow = false
        const memArr = ['mem_usage', 'min_mem_usage', 'max_mem_usage']
        const memChart: number[] = []
        for (const item of memArr) {
          config.params.query = item
          await axios.get(api, config).then((res) => {
            if (config.params.query === 'mem_usage') {
              dataArr.value[1].usage = res.data[0].value[1]
            } else if (config.params.query === 'min_mem_usage') {
              dataArr.value[1].min = res.data[0].value[1]
            } else {
              dataArr.value[1].max = res.data[0].value[1]
            }
          })
        }
        memChart.push(0)
        memChart.push(dataArr.value[1].usage)
        memChart.push(dataArr.value[1].min)
        memChart.push(dataArr.value[1].max)
        divNodes.value[1].getChartData(memChart)
        dataArr.value[1].isOrNotShow = true
      } else {
        dataArr.value[2].isOrNotShow = false
        const diskArr = ['disk_usage', 'min_disk_usage', 'max_disk_usage']
        const diskChart: number[] = []
        for (const item of diskArr) {
          config.params.query = item
          await axios.get(api, config).then((res) => {
            if (config.params.query === 'disk_usage') {
              dataArr.value[2].usage = res.data[0].value[1]
            } else if (config.params.query === 'min_disk_usage') {
              dataArr.value[2].min = res.data[0].value[1]
            } else {
              dataArr.value[2].max = res.data[0].value[1]
            }
          })
        }
        diskChart.push(0)
        diskChart.push(dataArr.value[2].usage)
        diskChart.push(dataArr.value[2].min)
        diskChart.push(dataArr.value[2].max)
        divNodes.value[2].getChartData(diskChart)
        dataArr.value[2].isOrNotShow = true
      }
    }
    const intervalRefresh = () => {
      isShowHost.value = false
      isShowHealthy.value = false
      dataArr.value[0].isOrNotShow = false
      dataArr.value[1].isOrNotShow = false
      dataArr.value[2].isOrNotShow = false
      void getHostQuery({ service_id: props.id }).then((res) => {
        hostData.value = res.hostObject
        dataArr.value = res.hostArr
        const cpuChart: number[] = []
        const memChart: number[] = []
        const diskChart: number[] = []
        cpuChart.push(0)
        cpuChart.push(hostData.value.cpu_usage)
        cpuChart.push(hostData.value.min_cpu_usage)
        cpuChart.push(hostData.value.max_cpu_usage)
        memChart.push(0)
        memChart.push(hostData.value.mem_usage)
        memChart.push(hostData.value.min_mem_usage)
        memChart.push(hostData.value.max_mem_usage)
        diskChart.push(0)
        diskChart.push(hostData.value.disk_usage)
        diskChart.push(hostData.value.min_disk_usage)
        diskChart.push(hostData.value.max_disk_usage)
        divNodes.value[0].getChartData(cpuChart)
        divNodes.value[1].getChartData(memChart)
        divNodes.value[2].getChartData(diskChart)
        isShowHost.value = true
        isShowHealthy.value = true
        dataArr.value[0].isOrNotShow = true
        dataArr.value[1].isOrNotShow = true
        dataArr.value[2].isOrNotShow = true
        emit('is-emit', true)
      })
    }
    onMounted(() => {
      void getHostQuery({ service_id: props.id }).then((res) => {
        hostData.value = res.hostObject
        dataArr.value = res.hostArr
      })
    })
    return {
      hostData,
      dataArr,
      isShowHost,
      isShowHealthy,
      divNodes,
      intervalRefresh,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
.StorageCluster {
  .right {
    border: 1px solid #E0E0E0;
  }
}
</style>
