<template>
  <div class="ApplicationList">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input dense outlined v-model="search">
              <template v-slot:prepend>
                <q-icon name="search"/>
              </template>
              <template v-slot:append v-if="search">
                <q-icon name="close" @click="search = ''" class="cursor-pointer" />
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

    <quota-application-table :applications="applications" :search="search.trim().toLowerCase()"/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import QuotaApplicationTable from 'components/Quota/QuotaApplicationTable.vue'

export default defineComponent({
  name: 'ApplicationList',
  components: {
    QuotaApplicationTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // 进入本页面强制更新personalQuotaApplicationTable
    void $store.dispatch('server/loadPersonalQuotaApplicationTable')

    // application filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
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
    // 获取quota列表数据
    const applications = computed(() => $store.getters['server/getPersonalApplicationsByFilter'](filterSelection.value.value))
    // 搜索框
    const search = ref('')

    return {
      $store,
      applications,
      filterOptions,
      filterSelection,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.ApplicationList {
}

.application-card {
  width: 900px;
}

</style>
