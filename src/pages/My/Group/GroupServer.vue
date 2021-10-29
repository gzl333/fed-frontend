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
              <template v-slot:append>
                <q-icon name="close" @click="search = ''" class="cursor-pointer" />
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

    <server-table :servers="rows" :search="search.trim().toLowerCase()" is-group/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'
import ServerTable from 'components/Server/ServerTable.vue'

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

    const filterOptions = computed(() => $store.getters['account/getGroupOptions'])

    const rows = computed(() => $store.getters['server/getGroupServersByGroupId'](filterSelection.value.value))
    // 搜索框
    const search = ref('')
    return {
      $store,
      filterSelection,
      filterOptions,
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
