<template>
  <div class="GroupList">

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
            {{ props.row.name }}
          </q-td>

          <q-td key="creation_time" :props="props">
            {{ props.row.creation_time }}
          </q-td>

          <q-td key="role" :props="props">
            {{ props.row.owner.id }}
          </q-td>

          <q-td key="quota" :props="props">
            {{ props.row.owner.id }}
          </q-td>

          <q-td key="server" :props="props">
            {{ props.row.owner.id }}
          </q-td>

          <q-td key="member" :props="props">
            {{ props.row.owner.id }}
          </q-td>

          <q-td key="desc" :props="props">
            {{ props.row.owner.id }}
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

export default defineComponent({
  name: 'GroupList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // group分栏定义
    const columnsZH = [
      {
        name: 'name',
        label: '组名称',
        field: 'name',
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
        label: '组配额',
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
    const groups = [
      {
        id: '1f513572-fe56-11eb-9949-c8009fe2eb03',
        name: 'Group开发测试',
        company: 'cnic云联邦实验室',
        description: 'dev',
        creation_time: '2021-08-16T05:52:21.102483Z',
        owner: {
          id: '6',
          username: 'zlguo@cnic.cn'
        },
        status: 'active'
      }
    ]
    return {
      $store,
      locale,
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
