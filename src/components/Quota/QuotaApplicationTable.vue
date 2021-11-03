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
      :loading="isGroup ? !$store.state.server.tables.groupQuotaApplicationTable.isLoaded : !$store.state.server.tables.personalQuotaApplicationTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无配额申请记录"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
      :filter="search"
      :filter-method="searchMethod"
      no-results-label="无搜索结果"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="status" :props="props" class="non-selectable">

            <quota-status-chip :is-group="isGroup" :application="props.row"/>

            <!--创建时间距离当下小于1小时则打上new标记-->
            <q-badge v-if="(new Date() - new Date(props.row.creation_time)) < 1000 * 60 * 60 * 1 "
                     class="q-mt-lg q-mr-sm" label="new" color="light-green" floating transparent rounded
                     align="middle">
            </q-badge>

          </q-td>

          <q-td v-if="isGroup && !isHideGroup" key="group" :props="props">
            <q-btn
              class="q-ma-none" :label="$store.state.account.tables.groupTable.byId[props.row.vo_id]?.name"
              color="primary"
              padding="xs" flat dense unelevated
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $t('项目组详情') }}
              </q-tooltip>
            </q-btn>
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

          <q-td key="service" :props="props">
            <div>
              {{
                $i18n.locale === 'zh' ? $store.state.fed.tables.serviceTable.byId[props.row.service]?.name : $store.state.fed.tables.serviceTable.byId[props.row.service]?.name_en
              }}
            </div>
            <div>
              {{
                $i18n.locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name :
                  $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name_en
              }}
            </div>

            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"
                name="img:svg/EVCloud-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                <q-tooltip>{{$t('该节点的服务类型为EVCloud')}}</q-tooltip>-->
            </div>

            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                name="img:svg/OpenStack-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                <q-tooltip>{{$t('该节点的服务类型为OpenStack')}}</q-tooltip>-->
            </div>

<!--            <q-tooltip class="bg-grey-4" :offset="[0, -15]">-->
<!--              <span class="text-black">-->
<!--                {{ $t('该节点的服务类型为') }}-->
<!--              </span>-->
<!--              <q-icon-->
<!--                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"-->
<!--                name="img:svg/EVCloud-Logo-Horizontal.svg"-->
<!--                style="width: 100px;height: 20px"/>-->
<!--              <q-icon-->
<!--                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"-->
<!--                name="img:svg/OpenStack-Logo-Horizontal.svg"-->
<!--                style="width: 100px;height: 20px"/>-->
<!--            </q-tooltip>-->
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
import { computed, defineComponent, PropType } from 'vue'
import { QuotaApplicationInterface } from 'src/store/server/state'
import QuotaStatusChip from 'components/Quota/QuotaStatusChip.vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplicationTable',
  components: {
    QuotaStatusChip
  },
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
    },
    search: {
      type: String,
      required: false
    }
  },
  setup (props) {
    // const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 列表分栏定义
    const columns = computed(() => [
      {
        name: 'status',
        label: locale.value === 'zh' ? '申请状态' : 'Status',
        field: 'status',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 15px 0px;width: 95px;' // 固定宽度，防止窄chip抖动
      },
      ...((props.isGroup && !props.isHideGroup) ? [{ // 是group且不hide时加入这个配置
        name: 'group',
        label: locale.value === 'zh' ? '所属组' : 'Group',
        field: 'group',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 15px 0px; max-width: 110px;white-space: normal;'
      }] : []),
      {
        name: 'creation_time',
        label: locale.value === 'zh' ? '申请时间' : 'Submission Time',
        field: 'creation_time',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 15px 0px'
      },
      {
        name: 'service',
        label: locale.value === 'zh' ? '服务节点' : 'Service Node',
        field: 'service',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 20px 0px' // 更大的上下padding，避免更新状态时按钮改变，导致抖动
      },
      {
        name: 'duration_days',
        label: locale.value === 'zh' ? '云主机时长' : 'Available Time',
        field: 'duration_days',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 15px 0px'
      },
      {
        name: 'configuration',
        label: locale.value === 'zh' ? 'CPU / 内存 / 私网IP / 公网IP / 云硬盘 ' : 'CPU / MEM / Private IP / Public IP / Disk',
        field: 'configuration',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'padding: 15px 0px'
      },
      {
        name: 'purpose',
        label: locale.value === 'zh' ? '用途' : 'Purpose',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'max-width: 100px;padding: 15px 0px;white-space: normal;'
      },
      {
        name: 'applicant',
        label: locale.value === 'zh' ? '申请人' : 'Applicant',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px',
        style: 'max-width: 200px;padding: 15px 0px'
      },
      {
        name: 'operation',
        label: locale.value === 'zh' ? '操作' : 'Operations',
        field: 'operation',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 2px'
      }
    ])

    // 搜索方法，可扩展成更模糊的
    const searchMethod = (rows: QuotaApplicationInterface[], terms: string): QuotaApplicationInterface[] => rows.filter(application => application.id.toLowerCase().includes(terms) || application.duration_days.toString().includes(terms) || application.vcpu.toString().includes(terms) || (application.ram / 1024).toString().includes(terms) || application.private_ip.toString().includes(terms) || application.public_ip.toString().includes(terms) || application.disk_size.toString().includes(terms) || application.purpose.toLowerCase().includes(terms) || application.contact.toLowerCase().includes(terms) || application.company.toLowerCase().includes(terms))

    return {
      columns,
      searchMethod
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaApplicationTable {
}
</style>
