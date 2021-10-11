<template>
  <div class="QuotaList">

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

    <QuotaTable :quotas="quotas"/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import QuotaTable from 'components/Quota/QuotaTable.vue'

export default defineComponent({
  name: 'QuotaList',
  components: {
    QuotaTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // // 进入本页面强制更新vm/userQuotaTable,数据更新来自后台，进入页面后应强制更新table,刷新quota状态
    // void $store.dispatch('vm_obsolete/updateUserQuotaTable')

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
      // 此处修改应与getter对应
      // ,
      // {
      //   label: '长期',
      //   value: null
      // },
      // {
      //   label: '未过期',
      //   value: 'notExpired'
      // },
      // {
      //   label: '已过期',
      //   value: 'expired'
      // },
      // {
      //   label: '未用尽',
      //   value: 'notExhausted'
      // },
      // {
      //   label: '已用尽',
      //   value: 'exhausted'
      // }
    ]

    // 获取quota数据
    const quotas = computed(() => $store.getters['server/getPersonalQuotasByFilter'](filterSelection.value.value))

    return {
      quotas,
      filterSelection,
      filterOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaList {
}
</style>
