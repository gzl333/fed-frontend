<template>
  <div class="GroupMemberTable">
    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="props.members"
      :columns="columns"
      row-key="name"
      no-data-label="暂无可用配额，请申请后使用"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="username" :props="props">
            {{ props.row.user.username }}
          </q-td>

          <q-td key="role" :props="props">
            <group-role-chip :role="props.row.role"/>
          </q-td>

          <q-td key="time" :props="props">
            {{ new Date(props.row.join_time).toLocaleString(locale) }}
          </q-td>

          <q-td key="inviter" :props="props">
            {{ props.row.inviter }}
          </q-td>

          <q-td key="operation" :props="props">
            <div class="row justify-center items-center q-gutter-xs">
              <q-btn v-if="props.row.role === 'member'" icon="mdi-account-multiple-check" flat dense padding="none" color="primary">
                <q-tooltip>设为管理员</q-tooltip>
              </q-btn>

              <q-btn v-else icon="mdi-account-multiple-remove" flat dense padding="none" color="primary">
                <q-tooltip>取消管理员</q-tooltip>
              </q-btn>

              <q-btn icon="mdi-close-thick" flat dense padding="none" color="primary">
                <q-tooltip>移出项目组</q-tooltip>
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
import { computed, defineComponent, PropType, ref } from 'vue'
import { SingleMemberInterface } from 'src/store/group/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import GroupRoleChip from 'components/Group/GroupRoleChip.vue'

export default defineComponent({
  name: 'GroupMemberTable',
  components: { GroupRoleChip },
  props: {
    members: {
      type: Array as PropType<SingleMemberInterface[]>,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    const columnsZH = props.isOwner ? [
      {
        name: 'username',
        label: '用户名',
        field: 'username',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'role',
        label: '角色',
        field: 'role',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'time',
        label: '加入时间',
        field: 'time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'inviter',
        label: '邀请人',
        field: 'inviter',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      }
    ] : [
      {
        name: 'username',
        label: '用户名',
        field: 'username',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'role',
        label: '角色',
        field: 'role',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'time',
        label: '加入时间',
        field: 'time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'inviter',
        label: '邀请人',
        field: 'inviter',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      }
    ]

    const columnsEN = columnsZH // todo 翻译

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
      props,
      $store,
      locale,
      columns,
      paginationTable
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupMemberTable {
}
</style>
