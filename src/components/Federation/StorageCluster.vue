<template>
  <div class="StorageCluster">
    <div v-if="JSON.stringify(storageData) !== '{}'">
      <div class="text-subtitle1 text-weight-bold">{{ storageData.name }}</div>
      <div class="row">
        <div class="col-6 row q-mt-md">
          <div style="width: 190px">
            <q-card flat bordered class="my-card q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">集群状态</div>
                <q-icon class="col-1" name="loop" size="xs" v-show="isShowHealth"
                        @click="refresh({ service_id: storageData.service_id, query: 'health_status' })"/>
              </div>
              <div :class="storageData.health_status === '0' ? 'text-positive text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' : storageData.health_status === '1' ?
                    'text-warning text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' : 'text-negative text-center text-h4 text-weight-bold q-mt-xl q-pb-xl'">
                {{
                  storageData.health_status === '0' ? 'Healthy' : storageData.health_status === '1' ? 'Warning' : 'Fatal'
                }}
              </div>
            </q-card>
          </div>
          <div class="q-ml-md" style="width: 190px">
            <q-card flat bordered class="q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">集群容量</div>
                <q-icon name="loop" class="col-1" size="xs" v-show="isShowClusterTotal"
                        @click="refresh({ service_id: storageData.service_id, query: 'cluster_total_bytes' })"/>
              </div>
              <div class="text-center text-h4 text-weight-regular q-mt-xl q-pb-xl">{{
                  (storageData.cluster_total_bytes / Math.pow(1024, 5)).toFixed(2) + 'PiB'
                }}
              </div>
            </q-card>
          </div>
          <div class="q-ml-md" style="width: 190px">
            <q-card flat bordered class="q-pb-md no-border-radius">
              <div class="row">
                <div class="col-11 text-center">当前容量</div>
                <q-icon name="loop" class="col-1" size="xs" v-show="isShowClusterUsed"
                        @click="refresh({ service_id: storageData.service_id, query: 'cluster_total_used_bytes' })"/>
              </div>
              <div class="text-center text-h4 text-weight-regular q-mt-xl q-pb-xl">{{
                  (storageData.cluster_total_used_bytes / Math.pow(1024, 4)).toFixed(2) + 'TiB'
                }}
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-5 right">
          <div class="row">
            <div class="col-11 text-center">OSD状态</div>
            <q-icon name="loop" class="col-1" size="xs" v-show="isShowOSD"
                    @click="refresh({ service_id: storageData.service_id, query: 'osd_in,osd_out,osd_up,osd_down' })"/>
          </div>
          <div class="row q-ml-md">
<!--            <div class="col-4 q-mt-md">-->
<!--              <q-card flat bordered class="no-border-radius q-pb-md">-->
<!--                <div class="text-center">OSD总数</div>-->
<!--                <div class="text-center text-h4 text-weight-regular q-mt-lg q-pa-lg">-->
<!--                    {{ storageData.osd_in }}-->
<!--                </div>-->
<!--              </q-card>-->
<!--            </div>-->
<!--            <q-separator vertical inset class="q-ml-md"/>-->
            <div class="row col-12 q-ml-md q-mt-sm">
              <div class="col-5">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD IN</div>
                  <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">
                    {{ storageData.osd_in }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-ml-lg">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD UP</div>
                  <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">
                    {{ storageData.osd_up }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-mt-sm">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD OUT</div>
                  <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">
                    {{ storageData.osd_out }}
                  </div>
                </q-card>
              </div>
              <div class="col-5 q-ml-lg q-mt-sm">
                <q-card flat bordered class="no-border-radius">
                  <div class="text-center">OSD DOWN</div>
                  <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">
                    {{ storageData.osd_down }}
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
import { $api } from 'boot/api'

export default defineComponent({
  name: 'StorageCluster',
  components: {},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    const storageData: any = ref({})
    const isShowHealth = ref(true)
    const isShowClusterTotal = ref(true)
    const isShowClusterUsed = ref(true)
    const isShowOSD = ref(true)
    const getStorageQuery = async (payload: { service_id: string }) => {
      // const api = apiBase + '/monitor/ceph/query'
      const storageQuery: string[] = ['health_status', 'cluster_total_bytes', 'cluster_total_used_bytes', 'osd_in', 'osd_out', 'osd_up', 'osd_down']
      const config = {
        query: {
          service_id: payload.service_id,
          query: ''
        }
      }
      const storageObject: Record<string, string> = {}
      for (const item of storageQuery) {
        config.query.query = item
        await $api.monitor.getMonitorCephQuery(config).then((res) => {
          if (!storageObject.name) {
            storageObject.name = res.data[0].monitor.name
          }
          if (!storageObject.service_id) {
            storageObject.service_id = res.data[0].monitor.service_id
          }
          storageObject[item] = res.data[0].value[1]
        }).catch((error) => {
          console.log(error)
        })
      }
      return storageObject
    }
    void getStorageQuery({ service_id: props.id }).then((res) => {
      storageData.value = res
    })
    const refresh = async (payload: { service_id: string, query: string }) => {
      // const api = apiBase + '/monitor/ceph/query'
      const config = {
        query: payload
      }
      let newData = payload.query
      if (payload.query === 'health_status') {
        isShowHealth.value = false
        await $api.monitor.getMonitorCephQuery(config).then((res) => {
          storageData.value[newData] = res.data[0].value[1]
          isShowHealth.value = true
        })
      } else if (payload.query === 'cluster_total_bytes') {
        isShowClusterTotal.value = false
        await $api.monitor.getMonitorCephQuery(config).then((res) => {
          storageData.value[newData] = res.data[0].value[1]
          isShowClusterTotal.value = true
        })
      } else if (payload.query === 'cluster_total_used_bytes') {
        isShowClusterUsed.value = false
        await $api.monitor.getMonitorCephQuery(config).then((res) => {
          storageData.value[newData] = res.data[0].value[1]
          isShowClusterUsed.value = true
        })
      } else {
        isShowOSD.value = false
        const arr = payload.query.split(',')
        for (const item of arr) {
          config.query.query = item
          newData = item
          await $api.monitor.getMonitorCephQuery(config).then((res) => {
            storageData.value[newData] = res.data[0].value[1]
            isShowOSD.value = true
          })
        }
      }
    }
    const intervalRefresh = () => {
      isShowHealth.value = false
      isShowClusterTotal.value = false
      isShowClusterUsed.value = false
      isShowOSD.value = false
      void getStorageQuery({ service_id: props.id }).then((res) => {
        storageData.value = res
        isShowHealth.value = true
        isShowClusterTotal.value = true
        isShowClusterUsed.value = true
        isShowOSD.value = true
        emit('is-emit', true)
      })
    }
    return {
      storageData,
      isShowHealth,
      isShowClusterTotal,
      isShowClusterUsed,
      isShowOSD,
      intervalRefresh,
      refresh
    }
  }

})
</script>

<style lang="scss" scoped>
.StorageCluster {
  .right {
    border: 1px solid $grey-4;
  }
}
</style>
