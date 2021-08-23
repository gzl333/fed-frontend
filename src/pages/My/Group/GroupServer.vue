<template>
  <div class="GroupServer">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label :label="$t('搜索')">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选组')"
                      v-model="filterSelection" :options="filterOptions"/>
          </div>
        </div>
      </div>
    </div>

    <server-table :servers="rows" is-group/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'
import ServerTable from 'components/ServerTable/ServerTable.vue'

export default defineComponent({
  name: 'GroupServer',
  components: { ServerTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // application filter
    const filterSelection = ref({
      label: locale.value === 'zh' ? '全部项目组' : 'All Groups',
      value: '0'
    })

    const filterOptions = computed(() => $store.getters['vm/getGroupOptions'])

    const rows = computed(() => $store.getters['vm/getGroupServersByGroupId'](filterSelection.value.value))

    return {
      $store,
      filterSelection,
      filterOptions,
      rows
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupServer {
}
</style>
