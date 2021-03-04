<template>
  <div class="Vm">
    <div class="row no-wrap min-routerview-height min-routerview-width">

      <div class="col-1.5 items-center bg-nord5 q-py-sm q-pl-sm q-pr-none non-selectable " v-if="isTreeOpen">
        <div class="tree-title q-px-xs">
          机构与数据中心
        </div>
        <q-tree class="col-12 col-sm-6"
                tick-strategy="leaf-filtered"
                default-expand-all
                :nodes="dataPointTree"
                label-key="name"
                node-key="id"
                children-key="dataPoints"
                v-model:ticked="tickedKeys"
                color="nord9"
                selected-color="nord11"
        />
        <pre>{{tickedKeys}}</pre>
      </div>

      <div class="col-shrink bg-nord5 btn-area">
        <q-btn v-if="isTreeOpen" class="btn-tree" unelevated color="nord9"
               icon="arrow_back_ios_new" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>折叠机构树</q-tooltip>
        </q-btn>
        <q-btn v-if="!isTreeOpen" class="btn-tree" unelevated color="nord9"
               icon="arrow_forward_ios" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>展开机构树</q-tooltip>
        </q-btn>
      </div>

      <div class="col bg-nord6">
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'

export default defineComponent({
  name: 'Vm',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    onMounted(() => { void $store.dispatch('usage/updateDataPointTree') })
    const dataPointTree = computed(() => $store.state.usage.dataPointTree)
    const tickedKeys = ref([])
    watch(tickedKeys, () => {
      void $store.dispatch('usage/fetchServerList', { service_id: '1' })
    })
    const isTreeOpen = ref(true)
    const toggleTree = () => {
      isTreeOpen.value = !isTreeOpen.value
    }
    return {
      isTreeOpen,
      toggleTree,
      tickedKeys,
      dataPointTree
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}
.min-routerview-height {
  min-height: calc(100vh - 114px);
}
.min-routerview-width {
  min-width: calc(100vw - 165px);
}
.tree-title {
  border-radius: 3px;
  background-color: $nord9;
  text-align: center;
  color: white;
  line-height: 30px;
}
.btn-area {
  //border-right: 0.5px solid $nord9;
}
.btn-tree {
  top: calc((100vh - 114px) / 2 - 30px);
}
</style>
