<template>
  <div class="GroupServer">

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

      <div class="col-3">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选组')" v-model="groupSelection"
                      :options="groupOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale ==='zh'? 'label':'labelEn'">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="groupSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                  {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <server-table :servers="rows" :search="search.trim().toLowerCase()" is-group/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
// import { useI18n } from 'vue-i18n'
import ServerTable from 'components/Server/ServerTable.vue'

export default defineComponent({
  name: 'GroupServer',
  components: { ServerTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const { locale } = useI18n({ useScope: 'global' })

    // group filter
    const groupSelection = ref('0')

    const groupOptions = computed(() => $store.getters['account/getGroupOptions'])

    const rows = computed(() => $store.getters['server/getGroupServersByGroupId'](groupSelection.value))
    // 搜索框
    const search = ref('')
    return {
      groupSelection,
      groupOptions,
      rows,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupServer {
}
</style>
