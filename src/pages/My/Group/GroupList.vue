<template>
  <div class="GroupList">

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
                      :options="filterOptions" map-options/>
          </div>
        </div>
      </div>

    </div>

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="groups"
      :columns="columns"
      row-key="name"
      no-data-label="暂无项目组"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="name" :props="props">
            <q-btn
              class="q-ma-none" :label="props.row.name" color="primary" padding="xs" flat dense unelevated
              :to="{path: `/my/group/detail/${props.row.id}`}">
              <q-tooltip>
                {{ $t('详情') }}
              </q-tooltip>
              <!--创建时间距离当下小于1小时则打上new标记-->
              <q-badge v-if="(new Date() - new Date(props.row.creation_time)) < 1000 * 60 * 60 * 1 "
                       color="light-green" floating transparent rounded align="middle">new
              </q-badge>
            </q-btn>
          </q-td>

          <q-td key="company" :props="props">
            {{ props.row.company }}
          </q-td>

          <q-td key="creation_time" :props="props">
            <div v-if="locale==='zh'">
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(' ')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(' ')[1] }}</div>
            </div>

            <div v-else>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(',')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(',')[1] }}</div>
            </div>
          </q-td>

          <q-td key="role" :props="props">
            <GroupRoleChip class="non-selectable" :role="props.row.myRole"/>
          </q-td>

          <q-td key="quota" :props="props">
            {{ $store.getters['vm/getGroupQuotasByGroupIdByStatus'](props.row.id)('valid').length }} /
            {{ $store.getters['vm/getGroupQuotasByGroupIdByStatus'](props.row.id)('expired').length }} /
            {{ $store.getters['vm/getGroupQuotasByGroupIdByStatus'](props.row.id)('exhausted').length }}
          </q-td>

          <q-td key="server" :props="props">
            {{ $store.getters['vm/getGroupServersByGroupId'](props.row.id).length }}台
          </q-td>

          <q-td key="member" :props="props">
            {{ $store.state.group.tables.groupMemberTable.byId[props.row.id]?.members.length }}人
          </q-td>

          <q-td key="desc" :props="props">
            {{ props.row.description }}
          </q-td>

          <q-td key="operation" :props="props">

            <div class="row justify-center items-center q-gutter-xs">
              <q-btn icon="info" flat dense padding="none" color="primary"
                     :to="{path: `/my/group/detail/${props.row.id}`}">
                <q-tooltip>详情</q-tooltip>
              </q-btn>

              <q-btn :disable="props.row.myRole!=='owner'" icon="settings" flat dense padding="none" color="primary"
                     :to="{path: `/my/group/edit/${props.row.id}`}">
                <q-tooltip>设置</q-tooltip>
              </q-btn>
            </div>

          </q-td>

        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--      todo 批量操作-->
      <!--      </template>-->

    </q-table>

    <q-separator/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import GroupRoleChip from 'components/Group/GroupRoleChip.vue'

export default defineComponent({
  name: 'GroupList',
  components: {
    GroupRoleChip
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // application filter
    const filterSelection = ref({
      label: locale.value === 'zh' ? '全部项目组' : 'All Groups',
      value: '0'
    })

    const filterOptionsZH = [
      {
        label: '全部项目组',
        value: '0'
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
        label: '作为成员',
        value: 'member'
      }
    ]
    const filterOptionsEN = [
      {
        label: 'All Groups',
        value: '0'
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

    // group分栏定义
    const columnsZH = [
      {
        name: 'name',
        label: '项目组名称',
        field: 'name',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'company',
        label: '所属单位',
        field: 'company',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '创建时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'role',
        label: '我的角色',
        field: 'role',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'quota',
        label: '可用配额 / 过期配额 / 用尽配额',
        field: 'quota',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'server',
        label: '云主机数量',
        field: 'server',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'member',
        label: '组员数量',
        field: 'member',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'desc',
        label: '备注',
        field: 'desc',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      }
    ]
    const columnsEN = columnsZH

    // i18n影响该配置对象取值
    const columns = computed(() => locale.value === 'zh' ? columnsZH : columnsEN)

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // group data
    const groups = computed(() => $store.getters['group/getGroupsByFilter'](filterSelection.value.value))

    return {
      $store,
      locale,
      filterSelection,
      filterOptions,
      columns,
      paginationTable,
      groups
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupList {
}
</style>
