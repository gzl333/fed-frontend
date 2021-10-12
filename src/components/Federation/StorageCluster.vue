<template>
  <div class="StorageCluster">
    <div v-if="JSON.stringify(cephData) !== '{}'">
      <div class="row justify-between q-mt-sm">
        <div class="text-subid1 text-weight-bold">{{ cephData.name }}</div>
      </div>
      <div class="row q-mt-xs">
        <div class="col-6 row q-mt-md">
          <div class="col-3">
            <q-card flat bordered class="q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">集群状态</div>
                <q-icon class="col-1" name="loop" size="xs"
                        @click="refresh({ service_id: cephData.service_id, query: 'health_status' })"/>
              </div>
              <div :class="cephData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' : cephData.health_status === '1' ?
                    'text-warning text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' : 'text-negative text-center text-h4 text-weight-bold q-mt-xl q-pb-xl'">
                {{ cephData.health_status === '0' ? 'Healthy' : cephData.health_status === '1' ? 'Warning' : 'Fatal' }}
              </div>
            </q-card>
          </div>
          <div class="col-3 q-ml-xl">
            <q-card flat bordered class="q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">集群容量</div>
                <q-icon name="loop" class="col-1" size="xs"
                        @click="refresh({ service_id: cephData.service_id, query: 'cluster_total_bytes' })"/>
              </div>
              <div class="text-center text-h4 text-weight-medium q-mt-xl q-pb-xl">{{
                  (cephData.cluster_total_bytes / Math.pow(1024, 5)).toFixed(2) + 'PiB'
                }}
              </div>
            </q-card>
          </div>
          <div class="col-3 q-ml-xl">
            <q-card flat bordered class="q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">当前容量</div>
                <q-icon name="loop" class="col-1" size="xs"
                        @click="refresh({ service_id: cephData.service_id, query: 'cluster_total_used_bytes' })"/>
              </div>
              <div class="text-center text-h4 text-weight-medium q-mt-xl q-pb-xl">{{
                  (cephData.cluster_total_used_bytes / Math.pow(1024, 4)).toFixed(2) + 'TiB'
                }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-5 right">
          <div class="row">
            <div class="col-11 text-center">OSD状态</div>
            <q-icon name="loop" class="col-1" size="xs"/>
          </div>
          <div class="row q-ml-md">
            <div class="col-4 q-mt-md">
              <q-card flat bordered class="no-border-radius q-pb-md">
                <div class="row">
                  <div class="col-11 text-center">OSD总数</div>
                  <q-icon name="loop" class="col-1" size="xs"/>
                </div>
                <div class="text-center text-h4 text-weight-medium q-mt-lg q-pb-lg q-pa-lg">{{
                    parseInt(cephData.osd_in) + parseInt(cephData.osd_up) + parseInt(cephData.osd_out) + parseInt(cephData.osd_down)
                  }}
                </div>
              </q-card>
            </div>
            <q-separator vertical inset class="q-ml-md"/>
            <div class="row col-7 q-ml-md q-mt-sm">
              <div class="col-5">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD IN</div>
                  <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">
                    {{ cephData.osd_in }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-ml-lg">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD UP</div>
                  <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">
                    {{ cephData.osd_up }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-mt-sm">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD OUT</div>
                  <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">
                    {{ cephData.osd_out }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-ml-lg q-mt-sm">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD DOWN</div>
                  <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">
                    {{ cephData.osd_down }}
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="col-1">
          <q-card flat bordered class="no-border-radius q-pb-md">
            <q-card-section>
              <div class="text-center q-mt-xl">
                <p class="text-primary">Go To</p>
                <p class="text-primary">Grafana</p>
                <p>详细信息</p>
              </div>
            </q-card-section>
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

interface cephInterface {
  [key: string]: any
}
export default defineComponent({
  name: 'StorageCluster',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const cephData: cephInterface = ref({})
    const refreshTime = ref(5)
    const refresh = (payload: { service_id: string, query: string }) => {
      const api = apiBase + '/monitor/ceph/query'
      const config = {
        params: payload
      }
      const newData = payload.query
      void axios.get(api, config).then((res) => {
        cephData.value[newData] = res.data[0].value[1]
      })
    }
    const deliveryTime = (time: number) => {
      refreshTime.value = time
    }
    const intervalRefresh = () => {
      // void $store.dispatch('obs/loadCeph', props.id)
    }
    void $store.dispatch('obs/loadCeph', props.id).then((resp) => {
      cephData.value = resp
    })
    return {
      cephData,
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
