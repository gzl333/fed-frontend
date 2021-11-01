<template>
  <div class="GroupList">

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
            <q-select outlined dense stack-label :label="$t('筛选')" v-model="filterSelection"
                      :options="filterOptions" map-options/>
          </div>
        </div>
      </div>

    </div>

    <group-table :groups="groups" :search="search.trim().toLowerCase()"/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import GroupTable from 'components/Group/GroupTable.vue'

export default defineComponent({
  name: 'GroupList',
  components: {
    GroupTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // application filter
    const filterSelection = ref({
      label: locale.value === 'zh' ? '全部项目组' : 'All Groups',
      value: 'all'
    })

    const filterOptionsZH = [
      {
        label: '全部项目组',
        value: 'all'
      },
      {
        label: '作为组长',
        value: 'owner'
      },
      {
        label: '作为管理员',
        value: 'leader'
      },
      {
        label: '作为组员',
        value: 'member'
      }
    ]
    const filterOptionsEN = [
      {
        label: 'All Groups',
        value: 'all'
      },
      {
        label: 'As Group Owner',
        value: 'owner'
      },
      {
        label: 'As Group Manager',
        value: 'leader'
      },
      {
        label: 'As Group Member',
        value: 'member'
      }
    ]
    const filterOptions = computed(() => locale.value === 'zh' ? filterOptionsZH : filterOptionsEN)

    // group data
    const groups = computed(() => $store.getters['account/getGroupsByFilter'](filterSelection.value.value))

    // 搜索框
    const search = ref('')

    return {
      locale,
      filterSelection,
      filterOptions,

      groups,
      search
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupList {
}
</style>
