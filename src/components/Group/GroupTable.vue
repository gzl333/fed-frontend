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
            <div v-if="locale==='zh'">
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(' ')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(' ')[1] }}</div>
            </div>

            <div v-else>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(',')[0] }}</div>
              <div>{{ new Date(props.row.creation_time).toLocaleString(locale).split(',')[1] }}</div>
            </div>
          </q-td>

          <q-td key="operation" :props="props">

            <div class="row justify-center items-center q-gutter-xs">
              <q-btn icon="info" flat dense padding="none" color="primary"
                     :to="{path: `/my/group/detail/${props.row.id}`}">
                <q-tooltip>详情</q-tooltip>
              </q-btn>

              <!--              <q-btn :disable="props.row.myRole!=='owner'" icon="settings" flat dense padding="none" color="primary"-->
              <!--                     :to="{path: `/my/group_obsolete/edit/${props.row.id}`}">-->
              <!--                <q-tooltip>设置</q-tooltip>-->
              <!--              </q-btn>-->

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
import { computed, defineComponent, PropType, ref } from 'vue'
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
    }
  },
  setup (/* props */) {
    // const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

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
        name: 'role',
        label: '我的角色',
        field: 'role',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'member',
        label: '组员',
        field: 'member',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'server',
        label: '云主机',
        field: 'server',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'quota',
        label: '可用配额',
        field: 'quota',
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

    return {
      locale,
      columns,
      paginationTable
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupTable {
}
</style>
