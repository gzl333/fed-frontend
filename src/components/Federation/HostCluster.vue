<template>
  <div class="StorageCluster">
    <div v-if="JSON.stringify(hostData) !== '{}'">
      <div class="text-subtitle1 text-weight-bold">{{ hostData.name }}</div>
      <div class="row q-mt-sm">
        <div class="col-2">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">主机数</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowHost"
                      @click="refresh({ service_id: hostData.service_id, query: 'host_count' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ hostData.host_count }}</div>
          </q-card>
          <div class="row q-mt-sm">
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
                {{ parseInt(hostData.host_count) - parseInt(hostData.host_up_count) }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">集群状态</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowHealthy"
                      @click="refresh({ service_id: hostData.service_id, query: 'health_status' })"/>
            </div>
            <div :class="hostData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            hostData.health_status === '1' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl'">
              {{ hostData.health_status === '0' ? 'Healthy' : hostData.health_status === '1' ? 'Warning' : 'Fatal' }}
            </div>
          </q-card>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均CPU使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowCPUUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'cpu_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(hostData.cpu_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.max_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.min_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均内存使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowMemUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'mem_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(hostData.mem_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.max_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.min_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均磁盘使用率</div>
              <q-icon name="loop" class="col-1" size="xs" v-show="isShowDiskUsage"
                      @click="refresh({ service_id: hostData.service_id, query: 'disk_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(hostData.disk_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.max_disk_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(hostData.min_disk_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-1 q-ml-md">
          <q-card flat bordered class="no-border-radius q-pa-md">
            <div class="text-center q-mt-lg q-pb-sm q-pt-xs">
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
import { defineComponent, ref } from 'vue'
import { apiBase } from 'src/store'
import axios from 'axios'

export default defineComponent({
  name: 'HostCluster',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const hostData: any = ref({})
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
    void getHostQuery({ service_id: props.id }).then((resp) => {
      hostData.value = resp
    })
    const refresh = (payload: { service_id: string, query: string }) => {
      if (payload.query === 'host_count') {
        isShowHost.value = false
      } else if (payload.query === 'health_status') {
        isShowHealthy.value = false
      } else if (payload.query === 'cpu_usage') {
        isShowCPUUsage.value = false
      } else if (payload.query === 'mem_usage') {
        isShowMemUsage.value = false
      } else {
        isShowDiskUsage.value = false
      }
      const api = apiBase + '/monitor/server/query'
      const config = {
        params: payload
      }
      const newData = payload.query
      void axios.get(api, config).then((res) => {
        hostData.value[newData] = res.data[0].value[1]
        isShowHost.value = true
        isShowHealthy.value = true
        isShowCPUUsage.value = true
        isShowMemUsage.value = true
        isShowDiskUsage.value = true
      })
    }
    const intervalRefresh = () => {
      isShowHost.value = false
      isShowHealthy.value = false
      isShowCPUUsage.value = false
      isShowMemUsage.value = false
      isShowDiskUsage.value = false
      void getHostQuery({ service_id: props.id }).then(() => {
        isShowHost.value = true
        isShowHealthy.value = true
        isShowCPUUsage.value = true
        isShowMemUsage.value = true
        isShowDiskUsage.value = true
      })
    }
    return {
      hostData,
      isShowHost,
      isShowHealthy,
      isShowCPUUsage,
      isShowMemUsage,
      isShowDiskUsage,
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
