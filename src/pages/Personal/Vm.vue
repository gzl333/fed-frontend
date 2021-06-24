<template>
  <div class="Vm">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label :label="$t('搜索')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选服务节点')" v-model="serviceSelection"
                      :options="serviceOptions"/>
          </div>
        </div>
      </div>
    </div>

    <vm-table :vms="rows"/>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

import VmTable from 'components/Personal/VmTable.vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Vm',
  components: { VmTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // service_id下拉列表
    const serviceOptions = computed(() => $store.getters['vm/getServiceOptions'])
    const serviceSelection = ref({
      label: locale.value === 'zh' ? '全部服务节点' : 'All Service Nodes',
      value: '0'
    })

    $store.commit('vm/storeVmListFilter', '0') // 不能去掉！从其它界面重新进入时必须设置这个值
    watch(serviceSelection, () => {
      $store.commit('vm/storeVmListFilter', serviceSelection.value.value)
    })

    // 获取云主机列表数据
    const rows = computed(() => $store.getters['vm/getServersByServiceId'])

    return {
      $store,
      rows,
      serviceSelection,
      serviceOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}
</style>
