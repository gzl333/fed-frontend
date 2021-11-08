<template>
  <div class="GroupTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="groups"
      :columns="columns"
      row-key="name"
      :loading="!$store.state.account.tables.groupTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无项目组"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
      :filter="search"
      :filter-method="searchMethod"
      no-results-label="无搜索结果"
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

          <q-td key="role" :props="props">
            <GroupRoleChip class="non-selectable" :role="props.row.myRole"/>
          </q-td>

          <q-td key="member" :props="props">
            <q-btn color="primary" flat padding="none" dense
                   :to="{path:`/my/group/detail/${props.row.id}`, query: {show: 'member'} }">
              {{ $store.state.account.tables.groupMemberTable.byId[props.row.id]?.members.length }}人
            </q-btn>
          </q-td>

          <q-td key="server" :props="props">
            <q-btn color="primary" flat padding="none" dense
                   :to="{path:`/my/group/detail/${props.row.id}`, query: {show: 'server'} }">
              {{ $store.getters['server/getGroupServersByGroupId'](props.row.id).length }}台
            </q-btn>
          </q-td>

          <q-td key="quota" :props="props">
            <q-btn color="primary" flat padding="none" dense
                   :to="{path:`/my/group/detail/${props.row.id}`, query: {show: 'quota'} }">
              {{ $store.getters['server/getGroupQuotasByGroupIdByStatus'](props.row.id, 'valid').length }}个
            </q-btn>
          </q-td>

          <q-td key="desc" :props="props">
            {{ props.row.description }}
          </q-td>

          <q-td key="company" :props="props">
            {{ props.row.company }}
          </q-td>

          <q-td key="creation_time" :props="props">
            <div v-if="$i18n.locale==='zh'">
              <div>{{ new Date(props.row.creation_time).toLocaleString($i18n.locale).split(' ')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString($i18n.locale).split(' ')[1] }}</div>
            </div>

            <div v-else>
              <div>{{ new Date(props.row.creation_time).toLocaleString($i18n.locale).split(',')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString($i18n.locale).split(',')[1] }}</div>
            </div>
          </q-td>

          <q-td key="operation" :props="props">

            <div class="column justify-center items-start q-gutter-xs">

              <q-btn icon="info" flat dense padding="none" color="primary"
                     :to="{path: `/my/group/detail/${props.row.id}`}">
                {{$t('查看详情')}}
              </q-btn>

            </div>

          </q-td>

        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--      todo 批量操作-->
      <!--      </template>-->

    </q-table>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>

    <q-separator/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import GroupRoleChip from 'components/Group/GroupRoleChip.vue'
import { GroupInterface } from 'src/store/account/state'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'GroupTable',
  components: {
    GroupRoleChip
  },
  props: {
    groups: {
      type: Array as PropType<GroupInterface[]>,
      required: true
    },
    search: {
      type: String,
      required: false
    }
  },
  setup (/* props */) {
    // const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // group分栏定义
    const columns = computed(() => [
      {
        name: 'name',
        label: locale.value === 'zh' ? '项目组名称' : 'Group',
        field: 'name',
        align: 'center',
        style: 'padding: 15px 0px; max-width: 200px;white-space: normal;',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'role',
        label: locale.value === 'zh' ? '我的角色' : 'My Role',
        field: 'role',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'member',
        label: locale.value === 'zh' ? '成员' : 'Members',
        field: 'member',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'server',
        label: locale.value === 'zh' ? '云主机' : 'Servers',
        field: 'server',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'quota',
        label: locale.value === 'zh' ? '可用配额' : 'Valid Quotas',
        field: 'quota',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'desc',
        label: locale.value === 'zh' ? '备注' : 'Note',
        field: 'desc',
        align: 'center',
        style: 'padding: 15px 0px; max-width: 150px;white-space: normal;',
        headerStyle: 'padding: 0 5px'

      },
      {
        name: 'company',
        label: locale.value === 'zh' ? '所属单位' : 'Organization',
        field: 'company',
        align: 'center',
        style: 'padding: 15px 0px; max-width: 150px;white-space: normal;',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: locale.value === 'zh' ? '创建时间' : 'Creation Time',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: locale.value === 'zh' ? '操作' : 'Operations',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      }
    ])

    // 搜索方法，可扩展成更模糊的
    const searchMethod = (rows: GroupInterface[], terms: string): GroupInterface[] => rows.filter(group => group.id.toLowerCase().includes(terms) || group.name.toLowerCase().includes(terms) || group.description.toLowerCase().includes(terms) || group.company.toLowerCase().includes(terms))

    return {
      columns,
      searchMethod
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupTable {
}
</style>
