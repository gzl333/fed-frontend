<template>
  <div class="FederationResource">
    <div class="row">
      <div class="row column col-grow">
        <div class="text-dark text-h5 ">当前机构数量：{{ $store.state.fed.tables.dataCenterTable.allIds?.length }}</div>
        <div class="row">
        </div>
        <div class="row">
          <q-scroll-area class="q-mt-md" style="height: 200px; width: 300px; max-width: 300px;">
            <q-option-group
              v-model="group"
              :options="filterOptions"
              color="primary"
              type="toggle"
              @update:model-value="transfer"
            />
          </q-scroll-area>
          <bei-jing-map ref="map"></bei-jing-map>
        </div>
      </div>
      <div class="box q-pa-md col-4 q-mt-xl">
        <q-card class="my-card no-shadow">
          <q-card-section class="row justify-center">
            <div class="title text-h6 text-center text-weight-bold col-4 shadow-5">资源总量</div>
          </q-card-section>
          <q-tabs v-model="tab" class="text-primary row">
            <q-tab label="服务自主资源配置" name="one" class="col-6 text-blue-8"/>
            <q-tab label="联邦资源配置" name="two" class="col-6 text-blue-8"/>
          </q-tabs>
          <q-separator/>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="one">
              <div class="row text-center">
                <span class="text-h6 col-2 q-mt-md">CPU</span>
                <div class="cpu text-h5 col-8 text-weight-bold text-white q-py-md">
                  {{ privateNum.vcpu_total }}
                </div>
                <span class="text-h6 col-2 text-weight-bold q-mt-md">核</span>
              </div>
              <div class="row text-center q-mt-md">
                <span class="text-h6 col-2 text-weight-bold q-mt-md">内存</span>
                <div class="mem text-h5 col-8 text-weight-bold text-white q-py-md">
                  {{ privateNum.ram_total / 1024 }}
                </div>
                <span class="text-h6 col-2 text-weight-bold q-mt-md">GB</span>
              </div>
              <div class="row text-center q-mt-md">
                <span class="text-h6 col-2 text-weight-bold q-mt-md">硬盘</span>
                <div class="disk text-h5 col-8 text-weight-bold text-white q-py-md">
                  {{ privateNum.disk_size_total }}
                </div>
                <span class="text-h6 col-2 text-weight-bold q-mt-md">GB</span>
              </div>
            </q-tab-panel>
            <q-tab-panel name="two">
              <div class="row text-center">
                <span class="text-h6 col-2 q-mt-md">CPU</span>
                <div class="cpu text-h5 col-8 q-py-md text-weight-bold text-white">{{ shareNum.vcpu_total }}</div>
                <span class="text-h6 col-2 q-mt-md text-weight-bold">核</span>
              </div>
              <div class="row text-center q-mt-md">
                <span class="text-h6 col-2 q-mt-lg text-weight-bold">内存</span>
                <div class="mem text-h5 col-8 q-py-md text-weight-bold text-white">{{ shareNum.ram_total / 1024 }}</div>
                <span class="text-h6 col-2 q-mt-md text-weight-bold">GB</span>
              </div>
              <div class="row text-center q-mt-md">
                <span class="text-h6 col-2 q-mt-lg text-weight-bold">硬盘</span>
                <div class="disk text-h5 col-8 q-py-md text-weight-bold text-white">{{ shareNum.disk_size_total }}</div>
                <span class="text-h6 col-2 q-mt-md text-weight-bold">GB</span>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <q-separator class="q-my-lg"/>
    <div class="text-h5">当前服务数量：{{ $store.state.fed.tables.serviceTable.allIds?.length }}</div>
    <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row items-center q-gutter-lg q-my-md">
      <div class="column items-center text-bold text-subtitle1"> {{ dataCenter.name }}:</div>
      <div v-for="service in dataCenter.services" :key="service" class="text-h7 column items-center">
        {{ $store.state.fed.tables.serviceTable.byId[service]?.name }}
        <div>
          <q-icon
            v-if="$store.state.fed.tables.serviceTable.byId[service]?.service_type.toLowerCase().includes('ev')"
            name="img:svg/EVCloud-Logo-Horizontal.svg"
            style="width: 100px;height: 20px"/>
          <q-icon
            v-if="$store.state.fed.tables.serviceTable.byId[service]?.service_type.toLowerCase().includes('open')"
            name="img:svg/OpenStack-Logo-Horizontal.svg"
            style="width: 100px;height: 20px"/>
        </div>
      </div>
    </div>
    <q-separator class="q-my-lg"/>
    <div class="text-h5">资源分布</div>
    <div class="row q-mt-lg">
      <resource-pie-chart :data="cpuNum" title="CPU"></resource-pie-chart>
      <resource-pie-chart :data="ramNum" title="内存"></resource-pie-chart>
      <resource-pie-chart :data="diskNum" title="硬盘"></resource-pie-chart>
    </div>
    <q-separator class="q-my-lg"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import ResourcePieChart from 'components/Chart/PieChartResource.vue'
import BeiJingMap from 'components/Chart/BeiJingMap.vue'

export default defineComponent({
  name: 'FederationResource',
  components: {
    ResourcePieChart,
    BeiJingMap
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const privateNum = computed(() => $store.getters['fed/getPrivateNum'])
    const shareNum = computed(() => $store.getters['fed/getShareNum'])
    const cpuNum = computed(() => $store.getters['fed/getPieCpuNum'])
    const ramNum = computed(() => $store.getters['fed/getPieRamNum'])
    const diskNum = computed(() => $store.getters['fed/getPieDiskNum'])
    const filterOptions = computed(() => $store.getters['fed/getMechanismOptions'])
    const dataCenters = computed(() => Object.values($store.state.fed.tables.dataCenterTable.byId))
    const tab = ref('one')
    const group = ref([])
    const map: any = ref(null)
    const transfer = (value: []) => {
      const coordinateArr = []
      for (const item of value) {
        const coordinateObj: Record<string, string | number | number[]> = {}
        coordinateObj.name = $store.state.fed.tables.dataCenterTable.byId[item].name
        coordinateObj.value = 10
        if (item === '1') {
          coordinateObj.LngAndLat = [116.342428, 39.99322]
        } else {
          coordinateObj.LngAndLat = [116.63853, 40.322563]
        }
        coordinateArr.push(coordinateObj)
      }
      map.value.change(coordinateArr)
    }
    return {
      transfer,
      map,
      tab,
      privateNum,
      shareNum,
      cpuNum,
      ramNum,
      diskNum,
      dataCenters,
      group,
      filterOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationResource {
  .box {
    background: linear-gradient(to top, #306EEF, #306EEF) left top no-repeat, /*上左*/
    linear-gradient(to right, #306EEF, #306EEF) left top no-repeat, /*左上*/
    linear-gradient(to left, #306EEF, #306EEF) right top no-repeat, /*上右*/
    linear-gradient(to bottom, #306EEF, #306EEF) right top no-repeat, /*上右*/
    linear-gradient(to left, #306EEF, #306EEF) left bottom no-repeat, /*下左*/
    linear-gradient(to bottom, #306EEF, #306EEF) left bottom no-repeat, /*左下*/
    linear-gradient(to top, #306EEF, #306EEF) right bottom no-repeat, /*下右*/
    linear-gradient(to left, #306EEF, #306EEF) right bottom no-repeat; /*右下*/
    background-size: 3px 50px, 50px 3px, 3px 50px, 50px 3px;
    .my-card {
      .title {
        background-color: #fafcfd;
      }
      .cpu {
        background: $nord8;
      }
      .mem {
        background: $nord8;
      }
      .disk {
        background: $nord8;
      }
    }
  }
}
</style>
