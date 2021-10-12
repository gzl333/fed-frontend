<template>
  <div class="StorageCluster">
    <div v-if="JSON.stringify(serverData) !== '{}'">
      <div class="text-subid2 text-weight-bold">{{ serverData.name }}</div>
      <div class="row q-mt-sm">
        <div class="col-2">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">主机数</div>
              <q-icon name="loop" class="col-1" size="xs" @click="refresh({ service_id: serverData.service_id, query: 'host_count' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ serverData.host_count }}</div>
          </q-card>
          <div class="row justify-between q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">在线</div>
              <div class="text-center text-h4 text-weight-regular text-positive q-mt-sm q-pa-sm">{{
                  serverData.host_up_count
                }}
              </div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">掉线</div>
              <div class="text-center text-h4 text-weight-regular text-negative q-mt-sm q-pa-sm">
                {{ parseInt(serverData.host_count) - parseInt(serverData.host_up_count) }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">集群状态</div>
              <q-icon name="loop" class="col-1" size="xs" @click="refresh({ service_id: serverData.service_id, query: 'health_status' })"/>
            </div>
            <div :class="serverData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            serverData.health_status === '1' ? 'text-warning text-center text-h4 text-weight-bold q-mt-lg q-pa-xl' :
            'text-negative text-center text-h4 text-weight-bold q-mt-lg q-pa-xl'">
              {{ serverData.health_status === '0' ? 'Healthy' : serverData.health_status === '1' ? 'Warning' : 'Fatal' }}
            </div>
          </q-card>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均CPU使用率</div>
              <q-icon name="loop" class="col-1" size="xs" @click="refresh({ service_id: serverData.service_id, query: 'cpu_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(serverData.cpu_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row justify-between q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.max_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.min_cpu_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均内存使用率</div>
              <q-icon name="loop" class="col-1" size="xs" @click="refresh({ service_id: serverData.service_id, query: 'mem_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(serverData.mem_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row justify-between q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.max_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.min_mem_usage).toFixed(2) + '%' }}</div>
            </q-card>
          </div>
        </div>
        <div class="col-2 q-ml-md">
          <q-card flat bordered class="no-border-radius">
            <div class="row">
              <div class="col-11 text-center">平均磁盘使用率</div>
              <q-icon name="loop" class="col-1" size="xs" @click="refresh({ service_id: serverData.service_id, query: 'disk_usage' })"/>
            </div>
            <div class="text-center text-h4 text-weight-regular q-mt-sm q-pa-sm">{{ parseInt(serverData.disk_usage).toFixed(2) + '%' }}</div>
          </q-card>
          <div class="row justify-between q-mt-sm">
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最大</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.max_disk_usage).toFixed(2) + '%' }}</div>
            </q-card>
            <q-card flat bordered class="no-border-radius col-6">
              <div class="col-11 text-center">最小</div>
              <div class="text-center text-h5 q-mt-md q-pa-sm">{{ parseInt(serverData.min_disk_usage).toFixed(2) + '%' }}</div>
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
import { useStore } from 'vuex'
import { apiBase, StateInterface } from 'src/store'
import axios from 'axios'

interface serverInterface {
  [key: string]: any
}

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
    const $store = useStore<StateInterface>()
    const serverData: serverInterface = ref({})
    const refreshTime = ref(5)
    const refresh = (payload: { service_id: string, query: string }) => {
      const api = apiBase + '/monitor/server/query'
      const config = {
        params: payload
      }
      const newData = payload.query
      void axios.get(api, config).then((res) => {
        serverData.value[newData] = res.data[0].value[1]
      })
    }
    const deliveryTime = (time: number) => {
      refreshTime.value = time
    }
    const intervalRefresh = () => {
      // console.log(55555)
      // void $store.dispatch('obs/loadServer', props.id)
    }
    void $store.dispatch('obs/loadServer', props.id).then((resp) => {
      serverData.value = resp
    })
    return {
      serverData,
      deliveryTime,
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
