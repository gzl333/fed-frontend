<template>
  <div class="FederationMonitorServer">
    <div class="row justify-end">
      <q-select outlined v-model="filterSelection" :options="filterOptions" label="刷新时间" class="col-3" @update:model-value="handleClick"/>
    </div>
    <div v-for="(item, index) in services" :key="index">
      <host-cluster :id="item" ref="childRef"></host-cluster>
  </div>
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
    const services = computed(() => $store.getters['vm/getAllServices'])
    const filterSelection = ref({
      label: '每5s刷新',
      value: 5
    })
    let time = filterSelection.value.value
    const childRef: any = ref(null)
    const handleClick = () => {
      childRef.value.deliveryTime(filterSelection.value.value)
      time = filterSelection.value.value
    }
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
      childRef.value.intervalRefresh()
    }, time * 1000)
    watch(filterSelection, (oldValue, newValue) => {
      clearInterval(timer)
      timer = setInterval(() => {
        childRef.value.intervalRefresh()
      }, time * 1000)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      services,
      filterOptions,
      filterSelection,
      timer,
      childRef,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationMonitorServer {
}
</style>
