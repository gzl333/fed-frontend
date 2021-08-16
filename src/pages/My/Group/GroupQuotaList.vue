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
import { defineComponent, ref } from 'vue'
import QuotaTable from 'components/QuotaTable/QuotaTable.vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'GroupQuotaList',
  components: {
    QuotaTable
  },
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()

    // 进入本页面强制更新vm/userQuotaTable,数据更新来自后台，进入页面后应强制更新table,刷新quota状态
    // void $store.dispatch('vm/updateUserQuotaTable')

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

    const quotas = [
      {
        id: '9c70cbe2-690c-11eb-a4b7-c8009fe2eb10',
        tag: {
          value: 1,
          display: '普通配额'
        },
        user: {
          id: '9c70cbe2-690c-11eb-a4b7-c8009fe2eb10',
          username: 'shun'
        },
        service: '1',
        private_ip_total: 5,
        private_ip_used: 2,
        public_ip_total: 5,
        public_ip_used: 0,
        vcpu_total: 10,
        vcpu_used: 3,
        ram_total: 10240,
        ram_used: 4176,
        disk_size_total: 0,
        disk_size_used: 0,
        expiration_time: '2021-03-31T08:38:00Z',
        deleted: false,
        display: '[普通配额](vCPU: 10, RAM: 10240Mb, PublicIP: 5, PrivateIP: 5)',
        duration_days: 365,
        classification: 'personal',
        group: '123'
      }
    ]

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
