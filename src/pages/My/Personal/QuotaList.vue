<template>
  <div class="QuotaList">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input dense outlined v-model="search">
              <template v-slot:prepend>
                <q-icon name="search"/>
              </template>
              <template v-slot:append v-if="search">
                <q-icon name="close" @click="search = ''" class="cursor-pointer"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label label="筛选配额状态" v-model="statusSelection"
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

    <QuotaTable :quotas="quotas" :search="search.trim().toLowerCase()"/>

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

    // status filter
    const statusSelection = ref('0')
    const statusOptions = [ // 此处修改应与getter对应
      {
        value: '0',
        label: '全部配额',
        labelEn: 'All Quotas'
      },
      {
        value: 'valid',
        label: '可用',
        labelEn: 'Valid'
      },
      {
        value: 'invalid',
        label: '不可用',
        labelEn: 'Invalid'
      }
    ]
    // 获取quota数据
    const quotas = computed(() => $store.getters['server/getPersonalQuotasByFilter'](statusSelection.value))
    // 搜索框
    const search = ref('')

    return {
      quotas,
      statusSelection,
      statusOptions,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaList {
}
</style>
