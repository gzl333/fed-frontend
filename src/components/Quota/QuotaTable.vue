<template>
  <div class="QuotaTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="props.quotas"
      :columns="columns"
      row-key="name"
      no-data-label="暂无可用配额，请申请后使用"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="group" :props="props">
            <q-btn
              class="q-ma-none" :label="$store.state.group.tables.groupTable.byId[props.row.vo_id].name" color="primary"
              padding="xs" flat dense unelevated
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $t('查看项目组详情') }}
              </q-tooltip>
            </q-btn>
          </q-td>

          <q-td key="service" :props="props">
            <div>{{
                $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.fed.tables.serviceTable.byId[props.row.service]?.name }}</div>
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="cpu" :props="props">
            <div v-if="props.row.vcpu_total === 0">无</div>
            <!--            todo 抽象为单独组件-->
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.vcpu_total && (1 - props.row.vcpu_used/ props.row.vcpu_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.vcpu_used/ props.row.vcpu_total)>=.4 ? 'light-green' : (1 - props.row.vcpu_used/ props.row.vcpu_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.vcpu_total===props.row.vcpu_used" class="text-grey">
                {{ props.row.vcpu_total }}核用尽
              </div>
              <div v-else>{{ props.row.vcpu_total - props.row.vcpu_used }}/{{ props.row.vcpu_total }}核</div>
            </q-circular-progress>
          </q-td>
          <q-td key="ram" :props="props">
            <div v-if="props.row.ram_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.ram_total && (1 - props.row.ram_used/ props.row.ram_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.ram_used/ props.row.ram_total)>=.4 ? 'light-green' : (1 - props.row.ram_used/ props.row.ram_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.ram_total===props.row.ram_used" class="text-grey">
                {{ props.row.ram_total / 1024 }}GB用尽
              </div>
              <div v-else>
                {{ (props.row.ram_total - props.row.ram_used) / 1024 }}/{{ props.row.ram_total / 1024 }}GB
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="private_ip" :props="props">
            <div v-if="props.row.private_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.private_ip_total && (1 - props.row.private_ip_used/ props.row.private_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.private_ip_used/ props.row.private_ip_total)>=.4 ? 'light-green' : (1 - props.row.private_ip_used/ props.row.private_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.private_ip_total===props.row.private_ip_used" class="text-grey">
                {{ props.row.private_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.private_ip_total - props.row.private_ip_used }}/{{
                  props.row.private_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="public_ip" :props="props">
            <div v-if="props.row.public_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.public_ip_total && (1 - props.row.public_ip_used/ props.row.public_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.public_ip_used/ props.row.public_ip_total)>=.4 ? 'light-green' : (1 - props.row.public_ip_used/ props.row.public_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.public_ip_total===props.row.public_ip_used" class="text-grey">
                {{ props.row.public_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.public_ip_total - props.row.public_ip_used }}/{{
                  props.row.public_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>

          <q-td key="disk" :props="props">
            <div v-if="props.row.disk_size_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.disk_size_total && (1 - props.row.disk_size_used/ props.row.disk_size_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.disk_size_used/ props.row.disk_size_total)>=.4 ? 'light-green' : (1 - props.row.disk_size_used/ props.row.disk_size_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.disk_size_total===props.row.disk_size_used" class="text-grey">
                {{ props.row.disk_size_total }}GB用尽
              </div>
              <div v-else>{{ props.row.disk_size_total - props.row.disk_size_used }}/{{
                  props.row.disk_size_total
                }}GB
              </div>
            </q-circular-progress>
          </q-td>

          <q-td key="expiration_time" :props="props">
            <div v-if="!props.row.expiration_time">长期有效</div>
            <div v-else :class="props.row.expired?'text-grey':'text-black'">
              <div v-if="locale==='zh'">
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(' ')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(' ')[1] }}</div>
              </div>
              <div v-else>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(',')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(',')[1] }}</div>
              </div>
            </div>
            <div v-if="props.row.expired" class="text-grey">
              已过期
            </div>
          </q-td>

          <q-td key="status" :props="props">
            <div v-if="!props.row.expired && !props.row.exhausted" class="text-light-green">
                <q-icon name="check_circle_outline" size="sm"/>可用
            </div>
            <div v-else class="text-red">
              <q-icon name="highlight_off" size="sm"/>不可用
            </div>
          </q-td>

          <q-td key="operation" :props="props">
            <div class="row justify-center items-center q-gutter-xs">
              <q-btn icon="add_circle" flat dense padding="none" color="primary"
                     :disable="props.row.expired || props.row.exhausted"
                     :to="{path: isGroup ? `/my/group/server/deploy` : `/my/personal/server/deploy`, query:{quota:props.row.id}}">
                <q-tooltip>使用该配额创建云主机</q-tooltip>
              </q-btn>

              <q-btn icon="info" flat dense padding="none" color="primary"
                     :to="{path: isGroup ? `/my/group/quota/detail/${props.row.id}` : `/my/personal/quota_detail/${props.row.id}`}">
                <q-tooltip>详情</q-tooltip>
              </q-btn>

              <q-btn icon="delete" flat dense padding="none" color="primary"
                     @click="$store.dispatch('vm/deleteQuotaDialog', {quotaId: props.row.id,isGroup})">
                <q-tooltip>删除</q-tooltip>
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
import { QuotaInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaTable',
  components: {},
  props: {
    quotas: {
      type: Array as PropType<QuotaInterface[]>,
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

    // todo 为何报错？ 应强制更新table刷新quota状态，该逻辑应在此，而非在调用层。任何使用quota-table时都应该更新quotaTable
    // if (props.isGroup) {
    //   void $store.dispatch('vm/loadGroupQuotaTable')
    // } else {
    //   void $store.dispatch('vm/updateUserQuotaTable')
    // }

    // quota列表分栏定义
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
        name: 'service',
        label: '所属服务节点',
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
        name: 'expiration_time',
        label: '配额过期时间',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'status',
        label: '配额状态',
        field: 'status',
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
        name: 'expiration_time',
        label: '配额过期时间',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'status',
        label: '配额状态',
        field: 'status',
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

    // table row hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }
    return {
      props,
      $store,
      locale,
      columns,
      paginationTable,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaTable {
}
</style>
