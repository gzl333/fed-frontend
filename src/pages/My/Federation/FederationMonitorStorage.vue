<template>
  <div class="FederationMonitorStorage">
    <div class="row justify-end">
      <q-select outlined v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3"/>
    </div>
    <div class="box" v-for="(item, index) in $store.state.obs.tables.cephTable.allIds" :key="index">
      <div class="row justify-between q-mt-sm">
        <div class="text-subtitle1 text-weight-bold">{{ $store.state.obs.tables.cephTable.byId[item]?.name }}</div>
      </div>
      <div class="row q-mt-xs">
        <div class="col-6 row q-mt-md">
            <div class="col-3">
              <q-card flat bordered class="q-pb-md no-border-radius">
                  <div class="row">
                    <div class="col-11 text-center">集群状态</div>
                    <q-icon class="col-1" name="loop" size="xs" @click="refresh"/>
                  </div>
                  <div :class="$store.state.obs.tables.cephTable.byId[item]?.health_status[1] === '0' ?
                  'text-positive text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' :
                  $store.state.obs.tables.cephTable.byId[item]?.health_status === '1' ?
                  'text-warning text-center text-h4 text-weight-bold q-mt-xl q-pb-xl' : 'text-negative text-center text-h4 text-weight-bold q-mt-xl q-pb-xl'">
                    {{$store.state.obs.tables.cephTable.byId[item]?.health_status[1] === '0' ? 'Healthy' : $store.state.obs.tables.cephTable.byId[item]?.health_status[1] === '1' ? 'Warning' : 'Fatal' }}
                  </div>
              </q-card>
            </div>
            <div class="col-3 q-ml-xl">
              <q-card flat bordered class="q-pb-md no-border-radius">
                  <div class="row">
                    <div class="col-11 text-center">集群容量</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-xl q-pb-xl">{{ ($store.state.obs.tables.cephTable.byId[item]?.cluster_total_bytes[1] / Math.pow(1024, 5)).toFixed(2) + 'PiB' }}</div>
              </q-card>
            </div>
            <div class="col-3 q-ml-xl">
              <q-card flat bordered class="q-pb-md no-border-radius">
                  <div class="row">
                    <div class="col-11 text-center">当前容量</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-xl q-pb-xl">{{ ($store.state.obs.tables.cephTable.byId[item]?.cluster_total_used_bytes[1] / Math.pow(1024, 4)).toFixed(2) + 'TiB' }}</div>
              </q-card>
            </div>
        </div>
        <div class="col-5 right">
          <div class="row">
            <div class="col-11 text-center">OSD状态</div>
            <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
          </div>
          <div class="row q-ml-md">
              <div class="col-4 q-mt-md">
              <q-card flat bordered class="no-border-radius q-pb-md">
                  <div class="row">
                    <div class="col-11 text-center">OSD总数</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-lg q-pb-lg q-pa-lg">{{ 200 }}</div>
              </q-card>
            </div>
            <q-separator vertical inset class="q-ml-md"/>
            <div class="row col-7 q-ml-md q-mt-sm">
                <div class="col-5">
                  <q-card flat bordered class="no-border-radius">
                      <div class="text-center">OSD IN</div>
                      <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">{{ $store.state.obs.tables.cephTable.byId[item]?.osd_in[1] }}</div>
                  </q-card>
                </div>
                <div class="col-5 q-ml-lg">
                  <q-card flat bordered class="no-border-radius">
                      <div class="text-center">OSD UP</div>
                      <div class="text-center text-h5 text-weight-bold text-positive q-mt-md q-pb-sm">{{ $store.state.obs.tables.cephTable.byId[item]?.osd_up[1] }}</div>
                  </q-card>
                </div>
                <div class="col-5 q-mt-sm">
                  <q-card flat bordered class="no-border-radius">
                      <div class="text-center">OSD OUT</div>
                      <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">{{ $store.state.obs.tables.cephTable.byId[item]?.osd_out[1] }}</div>
                  </q-card>
                </div>
                <div class="col-5 q-ml-lg q-mt-sm">
                  <q-card flat bordered class="no-border-radius">
                      <div class="text-center">OSD DOWN</div>
                      <div class="text-center text-h5 text-weight-bold q-mt-md q-pb-sm">{{ $store.state.obs.tables.cephTable.byId[item]?.osd_down[1] }}</div>
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
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
export default defineComponent({
  name: 'FederationMonitorStorage',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const listData = ref([
      {
        id: 0,
        name: 'apios-ceph（A所-上海）',
        clusterStatus: 'Healthy',
        clusterCapacity: 10,
        currentCapacity: 20.8,
        OSDTotal: 200,
        OSDIN: 200,
        OSDUP: 200,
        OSDDOWN: 0,
        OSDOUT: 0
      },
      {
        id: 1,
        name: 'fen-ceph（B所-北京）',
        clusterStatus: 'Warning',
        clusterCapacity: 10,
        currentCapacity: 20.8,
        OSDTotal: 200,
        OSDIN: 199,
        OSDUP: 199,
        OSDDOWN: 1,
        OSDOUT: 1
      },
      {
        id: 2,
        name: 'bigdata-ceph（B所-上海）',
        clusterStatus: 'Healthy',
        clusterCapacity: 20,
        currentCapacity: 30.8,
        OSDTotal: 300,
        OSDIN: 200,
        OSDUP: 200,
        OSDDOWN: 0,
        OSDOUT: 0
      },
      {
        id: 3,
        name: 'obs-ceph（C所-北京）',
        clusterStatus: 'Fatal',
        clusterCapacity: 30,
        currentCapacity: 50.5,
        OSDTotal: 350,
        OSDIN: 198,
        OSDUP: 199,
        OSDDOWN: 2,
        OSDOUT: 1
      }
    ])
    const filterSelection = ref({
      label: '每5s刷新',
      value: 'all'
    })
    const filterOptions = [
      {
        label: '每5s刷新',
        value: '0'
      },
      {
        label: '每30s刷新',
        value: '1'
      },
      {
        label: '每1min刷新',
        value: '2'
      },
      {
        label: '每10min刷新',
        value: '3'
      },
      {
        label: '每30min刷新',
        value: '4'
      },
      {
        label: '每1h刷新',
        value: '5'
      }
    ]
    const refresh = () => {
      console.log('刷新')
    }
    onMounted(() => {
      // void $store.dispatch('obs/loadCephTable')
      console.log($store.state.obs)
    })
    return {
      listData,
      filterOptions,
      filterSelection,
      refresh
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorStorage {
  .box {
    .right {
      border: 1px solid #E0E0E0;
    }
  }
}
</style>
