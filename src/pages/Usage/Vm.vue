<template>
  <div class="Vm">
    <div class="row no-wrap min-routerview-height min-routerview-width">

      <div v-if="isTreeOpen" class="col-1.5 items-center bg-nord5 q-py-sm q-px-sm " >
        <div class="tree-title q-px-xs">
          机构与数据中心
        </div>
<!--        <q-scroll-area class="min-tree-size">-->
          <q-tree
            class="col-12 col-sm-6"
            default-expand-all
            :nodes="dataPointTree"
            node-key="key"
            selected-color="secondary"
            v-model:selected="selectedTree"
          />
<!--          <pre>{{dataPointTree}}</pre>-->
<!--        </q-scroll-area>-->
      </div>

      <div class="col-shrink bg-nord6 btn-area">
        <q-btn v-if="isTreeOpen" class="btn-close" unelevated color="nord9"
               icon="arrow_back_ios_new" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>折叠机构树</q-tooltip>
        </q-btn>
        <q-btn v-if="!isTreeOpen" class="btn-open" unelevated color="nord9"
               icon="arrow_forward_ios" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>展开机构树</q-tooltip>
        </q-btn>
      </div>

      <div class="col bg-nord6">
        vmlist
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
    // const dataPointTree = [
    //   {
    //     key: '0',
    //     label: '全部节点',
    //     children: [
    //       {
    //         key: '中国科学院计算机网络信息中心',
    //         label: '中国科学院计算机网络信息中心',
    //         selectable: false,
    //         children: [
    //           {
    //             key: '1',
    //             label: 'HR_204机房'
    //           }
    //         ]
    //       },
    //       {
    //         key: '地球大数据科学工程专项',
    //         label: '地球大数据科学工程专项',
    //         selectable: false,
    //         children: [
    //           {
    //             key: '2',
    //             label: '怀柔机房一层'
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ]
    const selectedTree = ref('0')
    watch(selectedTree, () => {
      // void $store.dispatch('usage/fetchServerList', { service_id: '1' })
      console.log(selectedTree.value)
    })
    const isTreeOpen = ref(true)
    const toggleTree = () => {
      isTreeOpen.value = !isTreeOpen.value
    }
    return {
      isTreeOpen,
      toggleTree,
      selectedTree,
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
.min-tree-size {
  min-height: calc(100vh - 180px);
  min-width: calc(100vw / 5);
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
.btn-close {
  top: calc((100vh - 114px) / 2 - 30px);
  left: -18px;

}
.btn-open {
  top: calc((100vh - 114px) / 2 - 30px);
}
</style>
