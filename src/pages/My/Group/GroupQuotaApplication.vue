<template>
  <div class="GroupQuotaApplication">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label :label="$t('搜索')">
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

    <quota-application-table :applications="applications" is-group/>

  </div>
</template>

<script lang="ts">
import { /* computed, */defineComponent, ref } from 'vue'
import QuotaApplicationTable from 'components/QuotaTable/QuotaApplicationTable.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupQuotaApplication',
  components: { QuotaApplicationTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

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
    const applications = [{
      group: '567',
      classification: 'personal',
      company: '',
      contact: 'zlguo@cnic.cn',
      creation_time: '2021-06-21T01:17:53.571333Z',
      deleted: false,
      disk_size: 128,
      duration_days: 1,
      id: '80c58c80-d22e-11eb-bcd3-c8009fe2eb03',
      private_ip: 1,
      public_ip: 1,
      purpose: '',
      ram: 3072,
      result_desc: '',
      service: '82a060ea-b93b-11eb-90bc-c8009fe2eb03',
      status: 'pass',
      vcpu: 2
    }]
    return {
      $store,
      applications,
      filterOptions,
      filterSelection
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaApplication {
}
</style>
