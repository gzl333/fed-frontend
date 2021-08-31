<template>
  <div class="GroupQuotaList">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label label="搜索">
              <template v-slot:append>
                <!--                      <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer"/>-->
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label label="筛选" v-model="filterSelection"
                      :options="filterOptions"/>
          </div>
        </div>
      </div>

    </div>

    <QuotaTable :quotas="quotas" is-group/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import QuotaTable from 'components/Quota/QuotaTable.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupQuotaList',
  components: {
    QuotaTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    void $store.dispatch('vm/loadGroupQuotaTable')

    // application filter
    const filterSelection = ref({
      label: '全部',
      value: '0'
    })

    const filterOptions = [
      {
        label: '全部',
        value: '0'
      },
      {
        label: '可用',
        value: 'valid'
      },
      {
        label: '不可用',
        value: 'invalid'
      }
    ]

    const quotas = computed(() => $store.getters['vm/getGroupQuotasByFilter'](filterSelection.value.value))

    return {
      quotas,
      filterSelection,
      filterOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaList {
}
</style>
