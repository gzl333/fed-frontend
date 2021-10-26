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

            <q-badge v-if="props.row.status === 'wait'" color="black" outline>
              {{ $t('待审批') }}
            </q-badge>
            <q-badge v-if="props.row.status === 'pending'" color="primary" outline>
              {{ $t('审批中') }}
            </q-badge>
            <q-badge v-if="props.row.status === 'pass'" color="light-green" outline>
              {{ $t('已通过') }}
            </q-badge>
            <div v-if="props.row.status === 'reject'">
              <q-badge color="red" outline>
                {{ $t('已拒绝') }}
              </q-badge>
              <div>
                <q-icon name="help_outline" color="red" size="xs">
                  <q-tooltip>{{ $t('拒绝原因: ') }}{{ props.row.result_desc }}</q-tooltip>
                </q-icon>
              </div>
            </div>
            <q-badge v-if="props.row.status === 'cancel'" color="grey" outline>
              {{ $t('已取消') }}
            </q-badge>
            <!--创建时间距离当下小于1小时则打上new标记-->

            <q-badge v-if="(new Date() - new Date(props.row.creation_time)) < 1000 * 60 * 60 * 1 "
                     style="top:10px" label="new" color="light-green" floating transparent rounded align="middle">
            </q-badge>

          </q-td>

          <q-td key="group" :props="props">
            <q-btn
              class="q-ma-none" :label="$store.state.account.tables.groupTable.byId[props.row.vo_id]?.name"
              color="primary"
              padding="xs" flat dense unelevated
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $t('查看项目组详情') }}
              </q-tooltip>
            </q-btn>
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

          <q-td key="service" :props="props">
            <div>
              {{
                locale === 'zh' ? $store.state.fed.tables.serviceTable.byId[props.row.service]?.name : $store.state.fed.tables.serviceTable.byId[props.row.service]?.name_en
              }}
            </div>
            <div>
              {{
                locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name :
                  $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name_en
              }}
            </div>
            <div>
              <div>
                <q-icon
                  v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"
                  name="img:svg/EVCloud-Logo-Horizontal.svg"
                  style="width: 100px;height: 20px"/>
                <q-tooltip>{{$t('该节点的服务类型为EVCloud')}}</q-tooltip>
              </div>

              <div>
                <q-icon
                  v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                  name="img:svg/OpenStack-Logo-Horizontal.svg"
                  style="width: 100px;height: 20px"/>
                <q-tooltip>{{$t('该节点的服务类型为OpenStack')}}</q-tooltip>
              </div>
            </div>
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="configuration" :props="props">
            {{ props.row.vcpu }}核 / {{ props.row.ram / 1024 }}GB / {{ props.row.private_ip }}个 / {{
              props.row.public_ip
            }}个 / {{ props.row.disk_size }}GB
          </q-td>

          <q-td key="purpose" :props="props">
            {{ props.row.purpose }}
            <q-tooltip>
              {{ props.row.purpose }}
            </q-tooltip>
          </q-td>
          <q-td key="applicant" :props="props">
            <div>{{ props.row.contact }}</div>
            <div>{{ props.row.company }}</div>
          </q-td>
          <q-td key="operation" :props="props">
            <div v-if="$store.state.account.tables.groupTable.byId[props.row.vo_id]?.myRole === 'member'">
              无操作权限
            </div>
            <div v-else class="column justify-center items-center q-gutter-xs">

              <q-btn v-if="props.row.status === 'wait'" icon="edit" flat dense padding="none"
                     color="primary"
                     @click="$store.dispatch('server/editQuotaApplicationDialog',{apply_id: props.row.id, isGroup})">
                {{ $t('修改申请') }}
              </q-btn>

              <q-btn v-if="props.row.status === 'wait'" icon="close" flat dense padding="none"
                     color="primary"
                     @click="$store.dispatch('server/cancelQuotaApplicationDialog',{apply_id: props.row.id, isGroup})">
                {{ $t('取消申请') }}
              </q-btn>

              <q-btn icon="delete" flat dense padding="none" color="primary"
                     @click="$store.dispatch('server/deleteQuotaApplicationDialog', {apply_id: props.row.id, isGroup})">
                {{ $t('删除记录') }}
              </q-btn>

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
import { QuotaApplicationInterface } from 'src/store/server/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplicationTable',
  components: {},
  props: {
    applications: {
      type: Array as PropType<QuotaApplicationInterface[]>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    },
    isHideGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 应强制更新table,刷新quota状态 todo
    // void $store.dispatch('server/xxxx')

    // 列表分栏定义
    const columnsZH = props.isGroup && !props.isHideGroup // 是group且不hide时使用这个配置
      ? [
          {
            name: 'status',
            label: '申请状态',
            field: 'status',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'creation_time',
            label: '申请时间',
            field: 'creation_time',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'service',
            label: '服务节点',
            field: 'service',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'duration_days',
            label: '云主机时长',
            field: 'duration_days',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'configuration',
            label: 'CPU/内存/私网IP/公网IP/云硬盘',
            field: 'configuration',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'purpose',
            label: '用途',
            field: 'purpose',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'max-width: 150px;padding: 15px 0px'
          },
          {
            name: 'applicant',
            label: '申请人',
            field: 'applicant',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'max-width: 200px;padding: 15px 0px'
          },
          {
            name: 'operation',
            label: '操作',
            field: 'operation',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px'
          }
        ] : [
          {
            name: 'status',
            label: '申请状态',
            field: 'status',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'group',
            label: '所属组',
            field: 'group',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'max-width: 130px;padding: 15px 0px'
          },
          {
            name: 'creation_time',
            label: '申请时间',
            field: 'creation_time',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'service',
            label: '服务节点',
            field: 'service',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'duration_days',
            label: '云主机时长',
            field: 'duration_days',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'configuration',
            label: 'CPU/内存/私网IP/公网IP/云硬盘',
            field: 'configuration',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'purpose',
            label: '用途',
            field: 'purpose',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'max-width: 150px;padding: 15px 0px'
          },
          {
            name: 'applicant',
            label: '申请人',
            field: 'applicant',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px',
            style: 'max-width: 200px;padding: 15px 0px'
          },
          {
            name: 'operation',
            label: '操作',
            field: 'operation',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 2px'
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
