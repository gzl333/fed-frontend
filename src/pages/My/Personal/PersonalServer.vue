<template>
  <div class="PersonalServer">

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

      <div class="col-3">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选服务节点')" v-model="serviceSelection"
                      :options="serviceOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale ==='zh'? 'label':'labelEn'">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="serviceSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                  {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <server-table :servers="rows" :search="search.trim().toLowerCase()"/>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

import ServerTable from 'components/Server/ServerTable.vue'
// import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PersonalServer',
  components: { ServerTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const { locale } = useI18n({ useScope: 'global' })

    // service_id下拉列表
    const serviceOptions = computed(() => $store.getters['server/getPersonalAvailableServices'])
    const serviceSelection = ref('0')

    // 获取云主机列表数据
    const rows = computed(() => $store.getters['server/getPersonalServersByServiceId'](serviceSelection.value))

    // 搜索框
    const search = ref('')

    return {
      rows,
      serviceSelection,
      serviceOptions,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.PersonalServer {
}
</style>
