<template>
  <div class="QuotaApplicationTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="applications"
      :columns="columns"
      row-key="name"
      no-data-label="暂无配额申请记录"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="status" :props="props">
            <div v-if="props.row.status === 'wait'">待审批</div>
            <div v-if="props.row.status === 'pending'" class="text-primary">审批中</div>
            <div v-if="props.row.status === 'pass'" class="text-light-green">已通过</div>
            <div v-if="props.row.status === 'reject'" class="text-red">已拒绝</div>
            <div v-if="props.row.status === 'cancel'" class="text-grey">已取消</div>
          </q-td>

          <q-td key="creation_time" :props="props">
            {{ new Date(props.row.creation_time).toLocaleString() }}
          </q-td>

          <q-td key="service" :props="props">
            <div>{{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name }}</div>
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="cpu" :props="props">
            {{ props.row.vcpu }}核
          </q-td>

          <q-td key="ram" :props="props">
            {{ props.row.ram / 1024 }}GB
          </q-td>
          <q-td key="private_ip" :props="props">
            {{ props.row.private_ip }}个
          </q-td>
          <q-td key="public_ip" :props="props">
            {{ props.row.public_ip }}个
          </q-td>
          <q-td key="disk" :props="props">
            {{ props.row.disk_size }}GB
          </q-td>
          <q-td key="purpose" :props="props">
            {{ props.row.purpose }}
          </q-td>
          <q-td key="applicant" :props="props">
            <div>{{ props.row.contact }}</div>
            <div>{{ props.row.company }}</div>
          </q-td>
          <q-td key="operation" :props="props">
            <div v-if="props.row.status === 'wait'">
              <q-btn label="修改申请" flat dense padding="none" color="primary" @click="showModify(props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'wait'">
              <q-btn label="取消申请" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/cancelAndUpdateUserQuotaApplicationTable',props.row.id)"/>
            </div>
            <div v-if="props.row.status !== 'wait'">
              <q-btn label="删除记录" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/deleteAndUpdateUserQuotaApplicationTable', props.row.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--todo 批量操作-->
      <!--      </template>-->

    </q-table>

    <q-separator/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { ApplicationQuotaInterface } from 'src/store/applyQuota/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplicationTable',
  components: {},
  props: {
    applications: {
      type: Array as PropType<ApplicationQuotaInterface[]>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 应强制更新table,刷新quota状态 todo
    // void $store.dispatch('vm/updateUserQuotaTable')

    // 列表分栏定义
    const columnsZH = props.isGroup ? [
      {
        name: 'group',
        label: '所属组',
        field: 'group',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        headerStyle: 'padding: 0 5px'
      }
    ] : [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
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
.QuotaApplicationTable {
}
</style>
