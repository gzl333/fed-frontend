<template>
  <div class="FederationMonitorStorage">
    <div class="box" v-for="(item, index) in listData" :key="index">
      <div class="row justify-between q-mt-sm">
        <div class="text-subtitle1 text-weight-bold">{{item.name}}</div>
        <q-select outlined v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-2"/>
      </div>
      <div class="row q-mt-md">
        <div class="col-6 row q-mt-md">
            <div class="col-3">
              <q-card flat bordered class="q-pb-lg q-pt-xs">
                <q-card-section>
                  <div class="row justify-center">
                    <div class="col-11 text-center">集群状态</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div :class="item.clusterStatus === 'Healthy' ? 'text-positive text-center text-h4 text-weight-bold q-mt-xl' : item.clusterStatus === 'Warning' ? 'text-warning text-center text-h4 text-weight-bold q-mt-xl' : 'text-negative text-center text-h4 text-weight-bold q-mt-xl'">{{item.clusterStatus}}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3 q-ml-xl">
              <q-card flat bordered class="q-pb-lg q-pt-xs">
                <q-card-section>
                  <div class="row justify-center">
                    <div class="col-11 text-center">集群容量</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-xl">{{ item.clusterCapacity + 'TB' }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-3 q-ml-xl">
              <q-card flat bordered class="q-pb-lg q-pt-xs">
                <q-card-section>
                  <div class="row justify-center">
                    <div class="col-11 text-center">当前容量</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-xl">{{item.currentCapacity + 'GB'}}</div>
                </q-card-section>
              </q-card>
            </div>
        </div>
        <div class="col-5 right">
          <div class="row justify-center">
            <div class="col-11 text-center">OSD状态</div>
            <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
          </div>
          <div class="row q-ml-md">
              <div class="col-4 q-mt-sm">
              <q-card flat bordered class="my-card q-pb-md">
                <q-card-section>
                  <div class="row justify-center">
                    <div class="col-11 text-center">OSD总数</div>
                    <q-icon name="loop" class="col-1" size="xs" @click="refresh"/>
                  </div>
                  <div class="text-center text-h4 text-weight-medium q-mt-xl">{{ item.OSDTotal }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-7 q-ml-lg row">
                <div class="col-5">
                  <q-card flat bordered class="my-card">
                    <q-card-section>
                      <div class="text-center">OSD IN</div>
                      <div class="text-center text-h5 text-weight-bold text-positive">{{ item.OSDIN }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-5 q-ml-lg">
                  <q-card flat bordered class="my-card">
                    <q-card-section>
                      <div class="text-center">OSD UP</div>
                      <div class="text-center text-h5 text-weight-bold text-positive">{{ item.OSDUP }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-5 q-mt-xs">
                  <q-card flat bordered class="my-card">
                    <q-card-section>
                      <div class="text-center">OSD OUT</div>
                      <div class="text-center text-h5 text-weight-bold">{{ item.OSDOUT }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-5 q-ml-lg q-mt-xs">
                  <q-card flat bordered class="my-card">
                    <q-card-section>
                      <div class="text-center">OSD DOWN</div>
                      <div class="text-center text-h5 text-weight-bold">{{ item.OSDDOWN }}</div>
                    </q-card-section>
                  </q-card>
                </div>
            </div>
          </div>
        </div>
        <div class="col-1">
          <q-card flat bordered class="my-card q-pb-md">
            <q-card-section>
              <div class="text-center q-mt-xl">
                <p class="text-primary">Go To</p>
                <p class="text-primary">Grafana</p>
                <p class="text-primary">详细信息</p>
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

export default defineComponent({
  name: 'FederationMonitorStorage',
  components: {},
  props: {},
  setup () {
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
