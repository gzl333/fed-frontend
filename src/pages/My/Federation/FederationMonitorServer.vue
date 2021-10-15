<template>
  <div class="FederationMonitorServer">
    <div class="row justify-end q-mt-xs">
      <q-icon class="col-1" name="refresh" size="md" v-show="isShow" @click="refresh"/>
      <q-select outlined v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3"/>
    </div>
    <host-cluster v-for="(serviceId, index) in services" :key="serviceId" :id="serviceId" :ref="el=>{divNodes[index] = el}" @is-emit="childEmit"></host-cluster>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, watch } from 'vue'
import HostCluster from 'components/Federation/HostCluster.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'FederationMonitorServer',
  components: {
    HostCluster
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const services = computed(() => $store.state.fed.tables.serviceTable.allIds)
    const isShow = ref(true)
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
        isShow.value = false
        node.intervalRefresh()
      })
    }, filterSelection.value.value * 1000)
    watch(filterSelection, () => {
      clearInterval(timer)
      timer = setInterval(() => {
        divNodes.value.forEach((node) => {
          isShow.value = false
          node.intervalRefresh()
        })
      }, filterSelection.value.value * 1000)
    })
    const refresh = () => {
      isShow.value = false
      divNodes.value.forEach((node) => {
        node.intervalRefresh()
      })
    }
    const childEmit = (val: boolean) => {
      isShow.value = val
    }
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      services,
      filterOptions,
      filterSelection,
      timer,
      divNodes,
      isShow,
      refresh,
      childEmit
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorServer {
}
</style>
