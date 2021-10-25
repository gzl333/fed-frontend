<template>
  <div class="FederationResource">
      <div class="row">
        <div class="row column col-grow">
          <div class="text-dark text-h5 ">当前机构</div>
          <bei-jing-map></bei-jing-map>
          <div class="row">
            <div class="col-auto">
              <span class="text-dark text-h4 text-weight-bold">{{ $store.state.fed.tables.dataCenterTable.allIds?.length }}</span>
              <span class="text-dark text-h6 text-weight-bold q-ml-sm">机构</span>
            </div>
            <div class="col-auto q-ml-md">
              <span class="text-dark text-h4 text-weight-bold">{{ $store.state.fed.tables.serviceTable.allIds?.length }}</span>
              <span class="text-dark text-h6 text-weight-bold q-ml-sm">服务</span>
            </div>
          </div>
        </div>
        <div class="box q-pa-md col-5">
          <q-card class="my-card no-shadow">
            <q-card-section class="row justify-center">
              <div class="title text-h6 text-center text-weight-bold col-4 shadow-5">资源总量</div>
            </q-card-section>
            <q-tabs v-model="tab" class="text-primary row">
              <q-tab label="服务自主资源配置" name="one" class="col-6 text-blue-8"/>
              <q-tab label="联邦资源配置" name="two" class="col-6 text-blue-8"/>
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="one">
                <div class="row text-center">
                  <span class="text-h6 col-2 q-mt-lg">CPU</span>
                  <div class="cpu text-h4 col-8 q-pa-md text-weight-bold text-white">{{ privateNum.vcpu_total }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">核</span>
                </div>
                <div class="row text-center q-mt-lg">
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">内存</span>
                  <div class="mem text-h4 col-8 q-pa-md text-weight-bold text-white">{{ privateNum.ram_total / 1024 }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">GB</span>
                </div>
                <div class="row text-center q-mt-lg">
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">硬盘</span>
                  <div class="disk text-h4 col-8 q-pa-md text-weight-bold text-white">{{ privateNum.disk_size_total }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">GB</span>
                </div>
              </q-tab-panel>
              <q-tab-panel name="two">
                <div class="row text-center">
                  <span class="text-h6 col-2 q-mt-lg">CPU</span>
                  <div class="cpu text-h4 col-8 q-pa-md text-weight-bold text-white">{{ shareNum.vcpu_total }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">核</span>
                </div>
                <div class="row text-center q-mt-md">
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">内存</span>
                  <div class="mem text-h4 col-8 q-pa-md text-weight-bold text-white">{{ shareNum.ram_total / 1024 }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">GB</span>
                </div>
                <div class="row text-center q-mt-md">
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">硬盘</span>
                  <div class="disk text-h4 col-8 q-pa-md text-weight-bold text-white">{{ shareNum.disk_size_total }}</div>
                  <span class="text-h6 col-2 q-mt-lg text-weight-bold">GB</span>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>
    <q-separator class="q-my-lg"/>
    <div class="text-h5">当前服务</div>
         <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row items-center q-gutter-lg q-my-md">
           <div class="text-bold text-subtitle1"> {{dataCenter.name}}:</div>
           <div v-for="service in dataCenter.services" :key="service" class="text-h7">
             {{ $store.state.fed.tables.serviceTable.byId[service]?.name }}
           </div>
         </div>
    <q-separator class="q-my-lg"/>
    <div class="text-h5">资源分布</div>
    <div class="row q-mt-lg">
        <resource-pie-chart :data="cpuNum" title="CPU" ></resource-pie-chart>
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
    const tab = ref('one')
    const dataCenters = computed(() => Object.values($store.state.fed.tables.dataCenterTable.byId))
    return {
      privateNum,
      shareNum,
      tab,
      cpuNum,
      ramNum,
      diskNum,
      dataCenters
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationResource {
  .box {
    background: linear-gradient(to top, #306EEF, #306EEF) left top no-repeat,/*上左*/
    linear-gradient(to right, #306EEF, #306EEF) left top no-repeat,/*左上*/
    linear-gradient(to left, #306EEF, #306EEF) right top no-repeat,/*上右*/
    linear-gradient(to bottom, #306EEF, #306EEF) right top no-repeat,/*上右*/
    linear-gradient(to left, #306EEF, #306EEF) left bottom no-repeat,/*下左*/
    linear-gradient(to bottom, #306EEF, #306EEF) left bottom no-repeat,/*左下*/
    linear-gradient(to top, #306EEF, #306EEF) right bottom no-repeat,/*下右*/
    linear-gradient(to left, #306EEF, #306EEF) right bottom no-repeat;/*右下*/
    background-size: 3px 50px, 50px 3px, 3px 50px, 50px 3px;
    .my-card {
      .title {
        border: #cceff5 5px double;
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
