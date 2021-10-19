<template>
  <div class="StorageCluster">
<!--    <div>{{ hostData }}</div>-->
    <div v-if="JSON.stringify(hostData) !== '{}'">
      <div v-for="(item, index) in hostData" :key="index">
        <div class="text-subtitle1 text-weight-bold">{{ item.name }}</div>
        <div class="row q-mt-sm">
          <div class="col-2">
            <q-card flat bordered class="no-border-radius q-pb-xs">
              <div class="row q-pb-lg">
                <div class="col-11 text-center">主机数</div>
                <q-icon name="loop" class="col-1" size="xs" v-show="item.isShowHost"
                        @click="refresh({ service_id: item.service_id, type: 'host', num: index })"/>
              </div>
              <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ item.host_count }}</div>
            </q-card>
            <div class="row q-mt-xs">
              <q-card flat bordered class="no-border-radius col-6">
                <div class="col-11 text-center">在线</div>
                <div class="text-center text-h4 text-weight-regular text-positive q-mt-sm q-pa-sm">{{ item.host_up_count }}</div>
              </q-card>
              <q-card flat bordered class="no-border-radius col-6">
                <div class="col-11 text-center">掉线</div>
                <div class="text-center text-h4 text-weight-regular text-negative q-mt-sm q-pa-sm">
                  {{ parseFloat(item.host_count) - parseFloat(item.host_up_count) }}
                </div>
              </q-card>
            </div>
          </div>
          <div class="col-2 q-ml-md">
            <q-card flat bordered class="no-border-radius q-pb-lg">
              <div class="row">
                <div class="col-11 text-center">集群状态</div>
                <q-icon name="loop" class="col-1" size="xs" v-show="item.isShowStatus"
                        @click="refresh({ service_id: item.service_id, type: 'healthy', num: index })"/>
              </div>
              <div :class="item.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            item.health_status === '1' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md' :
            'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl q-pb-md'">
                {{ item.health_status === '0' ? 'Healthy' : item.health_status === '1' ? 'Warning' : 'Fatal' }}
              </div>
            </q-card>
          </div>
          <div class="col-2 q-ml-md" v-for="(list, index1) in item.data" :key="index1">
            <q-card flat bordered class="no-border-radius">
              <div class="row">
                <div class="col-11 text-center">平均{{ list.name }}使用率</div>
                <q-icon name="loop" class="col-1" size="xs" v-show="list.isOrNotShow"
                        @click="refresh({ service_id: item.service_id, type: list.name, num: index})"/>
              </div>
              <div class="text-center text-h4 text-weight-regular q-mt-md">{{ parseFloat(list.usage).toFixed(2) + '%' }}
              </div>
              <line-chart :ref="el=>{divNodes[index1] = el}" :chartData="list"></line-chart>
            </q-card>
            <div class="row q-mt-xs">
              <q-card flat bordered class="no-border-radius col-6">
                <div class="col-11 text-center">最大</div>
                <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(list.max).toFixed(2) + '%' }}</div>
              </q-card>
              <q-card flat bordered class="no-border-radius col-6">
                <div class="col-11 text-center">最小</div>
                <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseFloat(list.min).toFixed(2) + '%' }}</div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { $api } from 'boot/api'
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
    const hostData: any = ref([])
    const divNodes = ref<typeof LineChart[]>([])
    const getHostQuery = async (payload: { service_id: string }) => {
      const hostQuery: string[] = ['host_count', 'host_up_count', 'health_status', 'cpu_usage', 'max_cpu_usage', 'min_cpu_usage', 'mem_usage', 'max_mem_usage', 'min_mem_usage', 'disk_usage', 'max_disk_usage', 'min_disk_usage']
      const config = {
        query: {
          service_id: payload.service_id,
          query: ''
        }
      }
      const hostDataArr = []
      let length = 0
      config.query.query = hostQuery[0]
      await $api.monitor.getMonitorServerQuery(config).then((res) => {
        length = res.data.length
      })
      for (let i = 0; i < length; i++) {
        const hostObject: Record<string, any> = {}
        const hostObjectCpu: Record<string, string | boolean> = {}
        const hostObjectMem: Record<string, string | boolean> = {}
        const hostObjectDisk: Record<string, string | boolean> = {}
        const arr = []
        if (!hostObject.isShowHost) {
          hostObject.isShowHost = true
        }
        if (!hostObject.isShowStatus) {
          hostObject.isShowStatus = true
        }
        for (const item of hostQuery) {
          config.query.query = item
          await $api.monitor.getMonitorServerQuery(config).then((res) => {
            hostObject.isShowHost = false
            hostObject.isShowStatus = false
            if (!hostObject.name) {
              hostObject.name = res.data[i].monitor.name
            }
            if (!hostObject.service_id) {
              hostObject.service_id = res.data[i].monitor.service_id
            }
            if (item === 'host_count' || item === 'host_up_count' || item === 'health_status') {
              hostObject[item] = res.data[i].value[1]
            } else if (item.indexOf('cpu') !== -1) {
              if (item === 'cpu_usage') {
                hostObjectCpu.name = 'CPU'
                hostObjectCpu.isOrNotShow = true
                hostObjectCpu.usage = res.data[i].value[1]
              } else if (item === 'max_cpu_usage') {
                hostObjectCpu.max = res.data[i].value[1]
              } else {
                hostObjectCpu.min = res.data[i].value[1]
              }
            } else if (item.indexOf('mem') !== -1) {
              if (item === 'mem_usage') {
                hostObjectMem.name = '内存'
                hostObjectMem.isOrNotShow = true
                hostObjectMem.usage = res.data[i].value[1]
              } else if (item === 'max_mem_usage') {
                hostObjectMem.max = res.data[i].value[1]
              } else {
                hostObjectMem.min = res.data[i].value[1]
              }
            } else {
              if (item === 'disk_usage') {
                hostObjectDisk.name = '磁盘'
                hostObjectDisk.isOrNotShow = true
                hostObjectDisk.usage = res.data[i].value[1]
              } else if (item === 'max_disk_usage') {
                hostObjectDisk.max = res.data[i].value[1]
              } else {
                hostObjectDisk.min = res.data[i].value[1]
              }
            }
          }).catch((error) => {
            console.log(error)
          })
        }
        arr.push(hostObjectCpu)
        arr.push(hostObjectMem)
        arr.push(hostObjectDisk)
        hostObject.data = arr
        hostDataArr.push(hostObject)
        hostObject.isShowHost = true
        hostObject.isShowStatus = true
      }
      return hostDataArr
    }
    const refresh = async (payload: { service_id: string, type: string, num: number }) => {
      const config = {
        query: {
          service_id: payload.service_id,
          query: ''
        }
      }
      if (payload.type === 'host') {
        hostData.value[payload.num].isShowHost = false
        const hostQueryArr = ['host_count', 'host_up_count']
        for (const item of hostQueryArr) {
          config.query.query = item
          await $api.monitor.getMonitorServerQuery(config).then((res) => {
            hostData.value[payload.num][item] = res.data[payload.num].value[1]
            hostData.value[payload.num].isShowHost = true
          })
        }
      } else if (payload.type === 'healthy') {
        hostData.value[payload.num].isShowStatus = false
        config.query.query = 'health_status'
        void await $api.monitor.getMonitorServerQuery(config).then((res) => {
          hostData.value[payload.num].health_status = res.data[payload.num].value[1]
          hostData.value[payload.num].isShowStatus = true
        })
      } else if (payload.type === 'CPU') {
        hostData.value[payload.num].data[0].isOrNotShow = false
        const cpuArr = ['cpu_usage', 'min_cpu_usage', 'max_cpu_usage']
        const cpuChart: number[] = []
        for (const item of cpuArr) {
          config.query.query = item
          await $api.monitor.getMonitorServerQuery(config).then((res) => {
            if (item === 'cpu_usage') {
              hostData.value[payload.num].data[0].usage = res.data[payload.num].value[1]
            } else if (item === 'min_cpu_usage') {
              hostData.value[payload.num].data[0].min = res.data[payload.num].value[1]
            } else {
              hostData.value[payload.num].data[0].max = res.data[payload.num].value[1]
            }
          })
          cpuChart.push(0)
          cpuChart.push(hostData.value[payload.num].data[0].usage)
          cpuChart.push(hostData.value[payload.num].data[0].min)
          cpuChart.push(hostData.value[payload.num].data[0].max)
          divNodes.value[0].getChartData(cpuChart)
          hostData.value[payload.num].data[0].isOrNotShow = true
        }
      } else if (payload.type === '内存') {
        hostData.value[payload.num].data[1].isOrNotShow = false
        const memArr = ['mem_usage', 'min_mem_usage', 'max_mem_usage']
        const memChart: number[] = []
        for (const item of memArr) {
          config.query.query = item
          await $api.monitor.getMonitorServerQuery(config).then((res) => {
            if (item === 'mem_usage') {
              hostData.value[payload.num].data[1].usage = res.data[payload.num].value[1]
            } else if (item === 'min_mem_usage') {
              hostData.value[payload.num].data[1].min = res.data[payload.num].value[1]
            } else {
              hostData.value[payload.num].data[1].max = res.data[payload.num].value[1]
            }
          })
        }
        memChart.push(0)
        memChart.push(hostData.value[payload.num].data[1].usage)
        memChart.push(hostData.value[payload.num].data[1].min)
        memChart.push(hostData.value[payload.num].data[1].max)
        divNodes.value[1].getChartData(memChart)
        hostData.value[payload.num].data[1].isOrNotShow = true
      } else {
        hostData.value[payload.num].data[2].isOrNotShow = false
        const diskArr = ['disk_usage', 'min_disk_usage', 'max_disk_usage']
        const diskChart: number[] = []
        for (const item of diskArr) {
          config.query.query = item
          await $api.monitor.getMonitorServerQuery(config).then((res) => {
            if (config.query.query === 'disk_usage') {
              hostData.value[payload.num].data[2].usage = res.data[payload.num].value[1]
            } else if (config.query.query === 'min_disk_usage') {
              hostData.value[payload.num].data[2].min = res.data[payload.num].value[1]
            } else {
              hostData.value[payload.num].data[2].max = res.data[payload.num].value[1]
            }
          })
        }
        diskChart.push(0)
        diskChart.push(hostData.value[payload.num].data[2].usage)
        diskChart.push(hostData.value[payload.num].data[2].min)
        diskChart.push(hostData.value[payload.num].data[2].max)
        divNodes.value[2].getChartData(diskChart)
        hostData.value[payload.num].data[2].isOrNotShow = true
      }
    }
    const intervalRefresh = () => {
      for (const item of hostData.value) {
        item.isShowHost = false
        item.isShowStatus = false
        for (const val of item.data) {
          val.isOrNotShow = false
        }
      }
      void getHostQuery({ service_id: props.id }).then((res) => {
        hostData.value = res
        const cpuChart: number[] = []
        const memChart: number[] = []
        const diskChart: number[] = []
        for (let i = 0; i < res.length; i++) {
          cpuChart.push(0)
          cpuChart.push(hostData.value[i].data[0].usage)
          cpuChart.push(hostData.value[i].data[0].min)
          cpuChart.push(hostData.value[i].data[0].max)
          memChart.push(0)
          memChart.push(hostData.value[i].data[1].usage)
          memChart.push(hostData.value[i].data[1].min)
          memChart.push(hostData.value[i].data[1].max)
          diskChart.push(0)
          diskChart.push(hostData.value[i].data[2].usage)
          diskChart.push(hostData.value[i].data[2].min)
          diskChart.push(hostData.value[i].data[2].max)
          divNodes.value[0].getChartData(cpuChart)
          divNodes.value[1].getChartData(memChart)
          divNodes.value[2].getChartData(diskChart)
        }
        for (const item of hostData.value) {
          item.isShowHost = true
          item.isShowStatus = true
          for (const val of item.data) {
            val.isOrNotShow = true
          }
        }
        emit('is-emit', true)
      })
    }
    onMounted(() => {
      void getHostQuery({ service_id: props.id }).then((res) => {
        hostData.value = res
      })
      console.log('divnodes', divNodes.value)
    })
    return {
      hostData,
      divNodes,
      intervalRefresh,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
.StorageCluster {
}
</style>
