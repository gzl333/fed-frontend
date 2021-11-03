<template>
  <div class="GroupQuotaApplication">

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
            <q-select outlined dense stack-label label="筛选申请状态" v-model="statusSelection"
                      :options="statusOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale ==='zh'? 'label':'labelEn'">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="statusSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                  {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
          </div>
        </div>
      </div>

    </div>

    <quota-application-table :applications="applications" :search="search.trim().toLowerCase()" is-group/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

import QuotaApplicationTable from 'components/Quota/QuotaApplicationTable.vue'

export default defineComponent({
  name: 'GroupQuotaApplication',
  components: { QuotaApplicationTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // status filter
    const statusSelection = ref('0')
    const statusOptions = [
      {
        value: '0',
        label: '全部申请状态',
        labelEn: 'All Applications'
      },
      {
        value: 'wait',
        label: '待审批',
        labelEn: 'Submitted'
      },
      {
        value: 'pending',
        label: '审批中',
        labelEn: 'Auditing'
      },
      {
        value: 'pass',
        label: '已通过',
        labelEn: 'Approved'
      },
      {
        value: 'reject',
        label: '已拒绝',
        labelEn: 'Rejected'
      },
      {
        value: 'cancel',
        label: '已取消',
        labelEn: 'Canceled'
      }
    ]
    // 获取quota列表数据
    const applications = computed(() => $store.getters['server/getGroupApplicationsByFilter'](statusSelection.value))
    // 搜索框
    const search = ref('')

    return {
      applications,
      statusOptions,
      statusSelection,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupQuotaApplication {
}
</style>
