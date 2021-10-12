<template>
  <div class="FederationMonitorStorage">
    <div class="row justify-end">
      <q-select outlined v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3"/>
    </div>
      <storage-cluster v-for="(serviceId, index) in services" :key="serviceId" :id="serviceId" :ref="el=>{divNodes[index] = el}"></storage-cluster>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import StorageCluster from 'components/Federation/StorageCluster.vue'
import HostCluster from 'components/Federation/HostCluster.vue'
export default defineComponent({
  name: 'FederationMonitorStorage',
  components: {
    StorageCluster
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const services = computed(() => $store.getters['vm/getAllServices'])
    const filterSelection = ref({
      label: '每5s刷新',
      value: 5
    })
    const divNodes = ref<typeof HostCluster[]>([])
    const filterOptions = [
      {
        label: '每5s刷新',
        value: 5
      },
      {
        label: '每30s刷新',
        value: 30
      },
      {
        label: '每1min刷新',
        value: 60
      },
      {
        label: '每10min刷新',
        value: 600
      },
      {
        label: '每30min刷新',
        value: 1800
      },
      {
        label: '每1h刷新',
        value: 3600
      }
    ]
    let timer = setInterval(() => {
      divNodes.value.forEach((node) => {
        node.intervalRefresh()
      })
    }, filterSelection.value.value * 1000)
    watch(filterSelection, (oldValue, newValue) => {
      clearInterval(timer)
      timer = setInterval(() => {
        divNodes.value.forEach((node) => {
          node.intervalRefresh()
        })
      }, filterSelection.value.value * 1000)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      filterOptions,
      filterSelection,
      timer,
      services,
      divNodes
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorStorage {
}
</style>
