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
                      @click="refresh({ service_id: hostData.service_id, query: 'host_count,host_up_count' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ hostData.host_count }}</div>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">在线</div>
              <div class="text-center text-h4 text-weight-regular text-positive q-mt-sm q-pa-sm">{{
                  hostData.host_up_count
                }}
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
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowHealthy"
                      @click="refresh({ service_id: hostData.service_id, query: 'health_status' })"/>
            </div>
            <div :class="hostData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            hostData.health_status === '1' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md' :
            'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md'">
              {{ hostData.health_status === '0' ? 'Healthy' : hostData.health_status === '1' ? 'Warning' : 'Fatal' }}
            </div>
          </q-card>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均CPU使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowCPUUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'cpu_usage,min_cpu_usage,max_cpu_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-md">{{ parseFloat(hostData.cpu_usage).toFixed(2) + '%' }}</div>
            <cpu-line-chart ref="childCPU"></cpu-line-chart>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.max_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.min_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均内存使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowMemUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'mem_usage,min_mem_usage,max_mem_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-md">{{ parseFloat(hostData.mem_usage).toFixed(2) + '%' }}</div>
            <mem-line-chart ref="childMem"></mem-line-chart>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.max_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.min_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均磁盘使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowDiskUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'disk_usage,min_disk_usage,max_disk_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-md">{{ parseFloat(hostData.disk_usage).toFixed(2) + '%' }}</div>
            <disk-line-chart ref="childDisk"></disk-line-chart>
          </q-card>
          <div class="row q-mt-xs">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.max_disk_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(hostData.min_disk_usage).toFixed(2) + '%' }}</div>
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
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { apiBase } from 'src/store'
import axios from 'axios'
import CpuLineChart from 'components/Chart/CpuLineChart.vue'
import MemLineChart from 'components/Chart/MemLineChart.vue'
import DiskLineChart from 'components/Chart/DiskLineChart.vue'
export default defineComponent({
  name: 'HostCluster',
  components: {
    CpuLineChart,
    MemLineChart,
    DiskLineChart
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const hostData: any = ref({})
    const childCPU: any = ref(null)
    const childMem: any = ref(null)
    const childDisk: any = ref(null)
    const isShowHost = ref(true)
    const isShowHealthy = ref(true)
    const isShowCPUUsage = ref(true)
    const isShowMemUsage = ref(true)
    const isShowDiskUsage = ref(true)
    const getHostQuery = async (payload: { service_id: string }) => {
      const api = apiBase + '/monitor/server/query'
      const hostQuery: string[] = ['host_count', 'host_up_count', 'health_status', 'cpu_usage', 'max_cpu_usage', 'min_cpu_usage', 'mem_usage', 'max_mem_usage', 'min_mem_usage', 'disk_usage', 'max_disk_usage', 'min_disk_usage']
      const config = {
        params: {
          service_id: payload.service_id,
          query: ''
        }
      }
      interface HostInterface {
        [key: string]: string
      }
      const hostObject: HostInterface = {}
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
      return hostObject
    }
    const refresh = async (payload: { service_id: string, query: string }) => {
      const api = apiBase + '/monitor/server/query'
      const config = {
        params: payload
      }
      let newData = payload.query
      if (payload.query.indexOf('host_count') !== -1) {
        isShowHost.value = false
        const hostArr = payload.query.split(',')
        for (const item of hostArr) {
          config.params.query = item
          newData = item
          await axios.get(api, config).then((res) => {
            hostData.value[newData] = res.data[0].value[1]
            isShowHost.value = true
          })
        }
      } else if (payload.query.indexOf('cpu_usage') !== -1) {
        isShowCPUUsage.value = false
        const cpuArr = payload.query.split(',')
        const cpuChart: number[] = []
        for (const item of cpuArr) {
          config.params.query = item
          newData = item
          await axios.get(api, config).then((res) => {
            hostData.value[newData] = res.data[0].value[1]
            isShowCPUUsage.value = true
          })
        }
        cpuChart.push(0)
        cpuChart.push(hostData.value.cpu_usage)
        cpuChart.push(hostData.value.min_cpu_usage)
        cpuChart.push(hostData.value.max_cpu_usage)
        childCPU.value.getChartData(cpuChart)
      } else if (payload.query.indexOf('mem_usage') !== -1) {
        isShowMemUsage.value = false
        const memArr = payload.query.split(',')
        const memChart: number[] = []
        for (const item of memArr) {
          config.params.query = item
          newData = item
          await axios.get(api, config).then((res) => {
            hostData.value[newData] = res.data[0].value[1]
            isShowMemUsage.value = true
          })
        }
        memChart.push(0)
        memChart.push(hostData.value.mem_usage)
        memChart.push(hostData.value.min_mem_usage)
        memChart.push(hostData.value.max_mem_usage)
        childMem.value.getChartData(memChart)
      } else if (payload.query.indexOf('disk_usage') !== -1) {
        isShowDiskUsage.value = false
        const diskArr = payload.query.split(',')
        const diskChart: number[] = []
        for (const item of diskArr) {
          config.params.query = item
          newData = item
          await axios.get(api, config).then((res) => {
            hostData.value[newData] = res.data[0].value[1]
            isShowDiskUsage.value = true
          })
        }
        diskChart.push(0)
        diskChart.push(hostData.value.disk_usage)
        diskChart.push(hostData.value.min_disk_usage)
        diskChart.push(hostData.value.max_disk_usage)
        childDisk.value.getChartData(diskChart)
      } else {
        isShowHealthy.value = false
        void await axios.get(api, config).then((res) => {
          hostData.value[newData] = res.data[0].value[1]
          isShowHealthy.value = true
        })
      }
    }
    const intervalRefresh = () => {
      isShowHost.value = false
      isShowHealthy.value = false
      isShowCPUUsage.value = false
      isShowMemUsage.value = false
      isShowDiskUsage.value = false
      const cpuChart: number[] = []
      const memChart: number[] = []
      const diskChart: number[] = []
      void getHostQuery({ service_id: props.id }).then((res) => {
        hostData.value = res
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
        childCPU.value.getChartData(cpuChart)
        childMem.value.getChartData(memChart)
        childDisk.value.getChartData(diskChart)
        isShowHost.value = true
        isShowHealthy.value = true
        isShowCPUUsage.value = true
        isShowMemUsage.value = true
        isShowDiskUsage.value = true
      })
    }
    onMounted(() => {
      void getHostQuery({ service_id: props.id }).then((resp) => {
        const cpuChart: number[] = []
        const menChart: number[] = []
        const diskChart: number[] = []
        hostData.value = resp
        cpuChart.push(0)
        cpuChart.push(hostData.value.cpu_usage)
        cpuChart.push(hostData.value.min_cpu_usage)
        cpuChart.push(hostData.value.max_cpu_usage)
        menChart.push(0)
        menChart.push(hostData.value.mem_usage)
        menChart.push(hostData.value.min_mem_usage)
        menChart.push(hostData.value.max_mem_usage)
        diskChart.push(0)
        diskChart.push(hostData.value.disk_usage)
        diskChart.push(hostData.value.min_disk_usage)
        diskChart.push(hostData.value.max_disk_usage)
        void nextTick(() => {
          console.log(childCPU.value)
          childCPU.value.getChartData(cpuChart)
          childMem.value.getChartData(menChart)
          childDisk.value.getChartData(diskChart)
        })
      })
    })
    return {
      hostData,
      isShowHost,
      isShowHealthy,
      isShowCPUUsage,
      isShowMemUsage,
      isShowDiskUsage,
      childCPU,
      childMem,
      childDisk,
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
