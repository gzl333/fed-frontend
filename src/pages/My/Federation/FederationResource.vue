<template>
  <div class="FederationResource">
    <!--    <div>{{treeData}}</div>-->
      <div class="row">
        <div class="col-5 column">
          <div class="row items-center q-gutter-lg text-h6">
            <div class="col-auto row items-end">
              <div class="text-grey">当前机构数量：</div>
              <div class="text-primary text-h4">{{ $store.state.fed.tables.dataCenterTable.allIds?.length }}</div>
            </div>
            <div class="col-auto row items-end">
              <div class="text-grey">当前服务数量：</div>
              <div class="text-primary text-h4">
                {{ $store.state.fed.tables.serviceTable.allIds?.length }}
              </div>
            </div>
          </div>
          <div class="q-pa-md text-subtitle1">
            <q-tree
              ref="tree"
              :nodes="treeData"
              default-expand-all
              node-key="label"
              tick-strategy="strict"
              v-model:ticked="ticked"
              @update:ticked="transfer"
            />
          </div>
        </div>
        <div class="col-7">
          <bei-jing-map ref="map"></bei-jing-map>
        </div>
      </div>
    <q-separator class="q-my-md"/>
    <div class="row justify-between">
      <div class="col-auto text-h6 text-grey">服务自主资源配置</div>
      <div class="col-auto row q-gutter-lg">
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计CPU:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ serviceCpuNum.reduce((accumulator, item) => accumulator + item.value, 0) }}核
          </div>
        </div>
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计内存:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ serviceRamNum.reduce((accumulator, item) => accumulator + item.value, 0) / 1024 }}GB
          </div>
        </div>
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计硬盘:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ serviceDiskNum.reduce((accumulator, item) => accumulator + item.value, 0) }}GB
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mt-lg">
      <resource-pie-chart :data="serviceCpuNum" title="CPU"></resource-pie-chart>
      <resource-pie-chart :data="serviceRamNum" title="内存"></resource-pie-chart>
      <resource-pie-chart :data="serviceDiskNum" title="硬盘"></resource-pie-chart>
    </div>
    <q-separator class="q-my-md"/>
    <div class="row justify-between">
      <div class="col-auto text-h6 text-grey">联邦资源配置</div>
      <div class="col-auto row q-gutter-lg">
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计CPU:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ fedCpuNum.reduce((accumulator, item) => accumulator + item.value, 0) }}核
          </div>
        </div>
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计内存:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ fedRamNum.reduce((accumulator, item) => accumulator + item.value, 0) / 1024 }}GB
          </div>
        </div>
        <div class="col-auto row">
          <div class="col-auto text-h6 text-grey">
            总计硬盘:
          </div>
          <div class="col-auto text-h6 text-primary">
            {{ fedDiskNum.reduce((accumulator, item) => accumulator + item.value, 0) }}GB
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mt-lg">
      <resource-pie-chart :data="fedCpuNum" title="CPU"></resource-pie-chart>
      <resource-pie-chart :data="fedRamNum" title="内存"></resource-pie-chart>
      <resource-pie-chart :data="fedDiskNum" title="硬盘"></resource-pie-chart>
    </div>
    <q-separator class="q-my-lg"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick, watch } from 'vue'
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
    const treeData = computed(() => $store.getters['fed/getMechanismTree'])
    const fedCpuNum = computed(() => $store.getters['fed/getFedCpuPie'])
    const fedRamNum = computed(() => $store.getters['fed/getFedRamPie'])
    const fedDiskNum = computed(() => $store.getters['fed/getFedDiskPie'])
    const serviceCpuNum = computed(() => $store.getters['fed/getServiceCpuPie'])
    const serviceRamNum = computed(() => $store.getters['fed/getServiceRamPie'])
    const serviceDiskNum = computed(() => $store.getters['fed/getServiceDiskPie'])
    const defaultTicked = computed(() => $store.getters['fed/getDefaultTicked'])
    const ticked = ref([])
    const map: any = ref(null)
    const tree: any = ref(null)
    void nextTick(() => {
      tree.value.setTicked(defaultTicked.value, true)
    })
    const transfer = (target: string[]) => {
      const coordinateArr = []
      for (const item of target) {
        const coordinateObj: Record<string, string | number | number[]> = {}
        coordinateObj.name = item
        coordinateObj.value = 12
        coordinateObj.LngAndLat = []
        for (const dataCenter of Object.values($store.state.fed.tables.dataCenterTable.byId)) {
          if (dataCenter.name === item) {
            coordinateObj.LngAndLat.push(dataCenter.longitude)
            coordinateObj.LngAndLat.push(dataCenter.latitude)
          }
        }
        coordinateArr.push(coordinateObj)
      }
      map.value.change(coordinateArr)
    }
    watch(treeData, () => {
      void nextTick(() => {
        tree.value.expandAll()
      })
    })
    watch(defaultTicked, () => {
      void nextTick(() => {
        tree.value.setTicked(defaultTicked.value, true)
      })
    })
    return {
      transfer,
      map,
      tree,
      fedCpuNum,
      fedRamNum,
      fedDiskNum,
      serviceCpuNum,
      serviceRamNum,
      serviceDiskNum,
      treeData,
      ticked
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationResource {
}
</style>
