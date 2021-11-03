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
                <q-icon name="close" @click="search = ''" class="cursor-pointer"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label label="筛选我的角色" v-model="roleSelection"
                      :options="roleOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale ==='zh'? 'label':'labelEn'">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="roleSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                  {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
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
// import { useI18n } from 'vue-i18n'

import GroupTable from 'components/Group/GroupTable.vue'

export default defineComponent({
  name: 'GroupList',
  components: {
    GroupTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const { locale } = useI18n({ useScope: 'global' })

    // role filter
    const roleSelection = ref('all')

    const roleOptions = [
      {
        value: 'all',
        label: '全部项目组',
        labelEn: 'All Groups'
      },
      {
        value: 'owner',
        label: '作为组长',
        labelEn: 'As Group Owner'
      },
      {
        value: 'leader',
        label: '作为管理员',
        labelEn: 'AS Group Manager'
      },
      {
        value: 'member',
        label: '作为组员',
        labelEn: 'As Group Member'
      }
    ]

    // group data
    const groups = computed(() => $store.getters['account/getGroupsByFilter'](roleSelection.value))

    // 搜索框
    const search = ref('')

    return {
      roleSelection,
      roleOptions,
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
