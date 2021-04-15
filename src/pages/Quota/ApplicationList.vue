<template>
  <div class="ApplicationList">
    this is ApplicationList
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ApplicationList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // application filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })
    watch(filterSelection, () => {
      $store.commit('applyQuota/storeQuotaListFilter', filterSelection.value.value)
      console.log($store.state.applyQuota.pages.quotaList)
    })
    const filterOptions = [
      {
        label: '全部状态',
        value: '0'
      },
      {
        label: '待审批',
        value: 'wait'
      },
      {
        label: '审批中',
        value: 'pending'
      },
      {
        label: '已通过',
        value: 'pass'
      },
      {
        label: '已拒绝',
        value: 'reject'
      },
      {
        label: '已取消',
        value: 'cancel'
      }
    ]

    return {
      filterOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.ApplicationList {
}
</style>
