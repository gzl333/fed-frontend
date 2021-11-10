<template>
  <div class="FederationResource">
    <!--    <div>{{treeDate}}</div>-->
    <div class="row">
      <div class="row column col-grow">
        <div class="text-dark text-h5 ">当前机构数量：{{ $store.state.fed.tables.dataCenterTable.allIds?.length }}</div>
        <div class="row">
        </div>
        <div class="row">
          <div class="col-5">
            <div class="q-pa-md text-subtitle1">
              <q-tree
                ref="tree"
                :nodes="treeDate"
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
      </div>
    </div>
    <q-separator class="q-my-md"/>
    <div class="text-h5">服务自主资源配置</div>
    <div class="row q-mt-lg">
      <resource-pie-chart :data="fedCpuNum" title="CPU"></resource-pie-chart>
      <resource-pie-chart :data="fedRamNum" title="内存"></resource-pie-chart>
      <resource-pie-chart :data="fedDiskNum" title="硬盘"></resource-pie-chart>
    </div>
    <q-separator class="q-my-md"/>
    <div class="text-h5">联邦资源配置</div>
    <div class="row q-mt-lg">
      <resource-pie-chart :data="serviceCpuNum" title="CPU"></resource-pie-chart>
      <resource-pie-chart :data="serviceRamNum" title="内存"></resource-pie-chart>
      <resource-pie-chart :data="serviceDiskNum" title="硬盘"></resource-pie-chart>
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
    const treeDate = computed(() => $store.getters['fed/getMechanismTree'])
    const fedCpuNum = computed(() => $store.getters['fed/getFedCpuPie'])
    const fedRamNum = computed(() => $store.getters['fed/getFedRamPie'])
    const fedDiskNum = computed(() => $store.getters['fed/getFedDiskPie'])
    const serviceCpuNum = computed(() => $store.getters['fed/getServiceCpuPie'])
    const serviceRamNum = computed(() => $store.getters['fed/getServiceRamPie'])
    const serviceDiskNum = computed(() => $store.getters['fed/getServiceDiskPie'])
    const map: any = ref(null)
    const tree: any = ref(null)
    const ticked = ref([])
    const transfer = (target: string[]) => {
      const coordinateArr = []
      for (const item of target) {
        const coordinateObj: Record<string, string | number | number[]> = {}
        coordinateObj.name = item
        coordinateObj.value = 10
        if (item === '中国科学院计算机网络信息中心') {
          coordinateObj.LngAndLat = [116.342428, 39.99322]
        } else {
          coordinateObj.LngAndLat = [116.63853, 40.322563]
        }
        coordinateArr.push(coordinateObj)
      }
      map.value.change(coordinateArr)
    }
    watch(treeDate, () => {
      void nextTick(() => {
        tree.value.expandAll()
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
      treeDate,
      ticked
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationResource {
}
</style>
