<template>
  <div class="Manage">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选服务节点')" v-model="serviceSelection"
                      :options="serviceOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale==='zh'? 'label':'labelEn'"
                      @update:model-value="resetAndReloadTable">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="serviceSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
          </div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选申请状态')" v-model="statusSelection"
                      :options="statusOptions" emit-value map-options option-value="value"
                      :option-label="$i18n.locale==='zh'? 'label':'labelEn'"
                      @update:model-value="resetAndReloadTable">
              <!--当前选项的内容插槽-->
              <template v-slot:selected-item="scope">
                <span :class="statusSelection===scope.opt.value ? 'text-primary' : 'text-black'">
                {{ $i18n.locale === 'zh' ? scope.opt.label : scope.opt.labelEn }}
                </span>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :loading="!$store.state.provider.tables.adminQuotaApplicationTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无配额申请"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
    >
      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="status" :props="props" class="non-selectable">

            <q-chip v-if="!props.row.status"
                    style="width: 90px;" class="text-bold " outline :ripple="false" color="grey-5">
              <div class="row items-center justify-center full-width">
                {{ $t('无状态') }}
              </div>
            </q-chip>

            <q-chip v-if="props.row.status === 'wait'"
                    style="width: 90px;" class="text-bold" outline :ripple="false" color="black">
              <div class="row items-center justify-center full-width">
                {{ $t('待审批') }}
              </div>
            </q-chip>

            <q-chip v-if="props.row.status === 'pending'"
                    style="width: 90px;" class="text-bold" outline :ripple="false" color="primary">
              <div class="row items-center justify-center full-width">
                {{ $t('审批中') }}
              </div>
              <q-icon name="info_outline" size="xs"/>
              <q-tooltip class="bg-grey-4 text-black" :offset="[0, 0]">
                <div>{{ $t('挂起人: ') }}</div>
                <div class="text-bold">{{ props.row?.approve_user?.name }}</div>
                <div>{{ $t('挂起时间: ') }}</div>
                <div class="text-bold">
                  {{ new Date(props.row?.approve_time).toLocaleString($i18n.locale) }}
                </div>
              </q-tooltip>
            </q-chip>

            <q-chip v-if="props.row.status === 'pass'"
                    style="width: 90px;" class="text-bold" outline :ripple="false" color="light-green">
              <div class="row items-center justify-center full-width">
                {{ $t('已通过') }}
              </div>
              <q-icon name="info_outline" size="xs"/>
              <q-tooltip class="bg-grey-4 text-black" :offset="[0, 0]">
                <div>{{ $t('审批人: ') }}</div>
                <div class="text-bold">{{ props.row?.approve_user?.name }}</div>
                <div>{{ $t('审批时间: ') }}</div>
                <div class="text-bold">
                  {{ new Date(props.row?.approve_time).toLocaleString($i18n.locale) }}
                </div>
              </q-tooltip>
            </q-chip>

            <div v-if="props.row.status === 'reject'">
              <q-chip style="width: 90px;" class="text-bold" outline :ripple="false" color="red">
                <div class="row items-center justify-center full-width">
                  {{ $t('已拒绝') }}
                </div>
                <q-icon name="info_outline" size="xs"/>
              </q-chip>
              <q-tooltip class="bg-grey-4 text-black" :offset="[0, 0]">
                <div>{{ $t('审批人: ') }}</div>
                <div class="text-bold">{{ props.row?.approve_user?.name }}</div>
                <div>{{ $t('审批时间: ') }}</div>
                <div class="text-bold">
                  {{ new Date(props.row?.approve_time).toLocaleString($i18n.locale) }}
                </div>
                <div>{{ $t('拒绝原因: ') }}</div>
                <div class="text-bold" style="max-width: 150px;">{{ props.row.result_desc }}</div>
              </q-tooltip>
            </div>

            <q-chip v-if="props.row.status === 'cancel'"
                    style="width: 90px;" class="text-bold" outline :ripple="false" color="grey">
              <div class="row items-center justify-center full-width">
                {{ $t('已取消') }}
              </div>
            </q-chip>

            <!--wait状态则打上new标记-->
            <q-badge v-if="props.row.status === 'wait'"
                     class="q-mt-lg q-mr-sm" color="light-green" floating transparent rounded align="middle">
              new
            </q-badge>

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
              <!--              <q-tooltip>{{ $t('该节点的服务类型为EVCloud') }}</q-tooltip>-->
            </div>
            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                name="img:svg/OpenStack-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--              <q-tooltip>{{ $t('该节点的服务类型为OpenStack') }}</q-tooltip>-->
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

          <q-td key="vo" :props="props">
            <div v-if="props.row.classification === 'vo'">
              <q-icon name="group" color="grey" size="md"/>
              <div>{{ $t('项目组') }}</div>
            </div>
            <div v-else>
              <q-icon name="person" color="grey" size="md"/>
              <div>{{ $t('个人') }}</div>
            </div>
          </q-td>

          <q-td key="purpose" :props="props">
            {{ props.row.purpose }}
            <!--            <q-tooltip :offset="[0, -15]">-->
            <!--              {{ props.row.purpose }}-->
            <!--            </q-tooltip>-->
          </q-td>
          <q-td key="applicant" :props="props">
            <div>{{ props.row.contact }}</div>
            <div>{{ props.row.company }}</div>
          </q-td>
          <q-td key="operation" :props="props">
            <div v-if="props.row.status === 'wait'">
              <q-btn label="开始审批" flat dense padding="none" color="primary"
                     @click="$store.dispatch('provider/auditQuotaApplicationDialog',props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'pending'">
              <q-btn label="继续审批" flat dense padding="none" color="primary"
                     @click="$store.dispatch('provider/auditQuotaApplicationDialog',props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'pass' || props.row.status === 'reject'">
              已审批
            </div>
            <div v-if="props.row.status === 'cancel'" class="text-grey">
              已取消
            </div>
          </q-td>
        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--   todo 批量操作 -->
      <!--      </template>-->
    </q-table>

    <q-separator/>

    <div v-if="pagination.count" class="row justify-between items-center q-gutter-sm">

      <div class="row items-center justify-between text-grey">
        共计 <span class="text-black">{{ pagination.count }}</span> 项筛选结果，

        <q-select color="grey" v-model="pagination.rowsPerPage" :options="[5,10,15,20,25,30]" dense options-dense
                  borderless
                  @update:model-value="resetAndReloadTable">
          <!--          &lt;!&ndash;当前选项的内容插槽&ndash;&gt;-->
          <!--          <template v-slot:selected-item>-->
          <!--                <span class="text-grey">-->
          <!--                {{ pagination.rowsPerPage }}-->
          <!--                </span>-->
          <!--          </template>-->
        </q-select>
        项/页
      </div>

      <q-pagination v-model="pagination.page"
                    :max="Math.ceil(pagination.count / pagination.rowsPerPage )"
                    :max-pages="9"
                    direction-links
                    outline
                    :ripple="false"
                    @update:model-value="reloadTable"
      />

    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Manage',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // service filter
    const serviceSelection = ref('')
    const serviceOptions = computed(() => $store.getters['provider/getServiceOptions'])

    // status filter
    const statusSelection = ref('')
    const statusOptions = [
      {
        value: '',
        label: '全部申请',
        labelEn: 'All Applications'
      },
      {
        value: 'wait',
        label: '待审批',
        labelEn: 'Submitted'
      },
      {
        value: 'pending',
        label: '审批中',
        labelEn: 'Auditing'
      },
      {
        value: 'pass',
        label: '已通过',
        labelEn: 'Approved'
      },
      {
        value: 'reject',
        label: '已拒绝',
        labelEn: 'Rejected'
      },
      {
        value: 'cancel',
        label: '已取消',
        labelEn: 'Canceled'
      }
    ]

    // 获取列表数据,虽然是从后端分页读取，但仍要用getter传参数筛选。因为table更新过程中突然改变参数，会导致新旧数据存入同一个表中。不加筛选的话，就会新旧数据同时显示了。
    const rows = computed(() => $store.getters['provider/getAdminApplicationsByServiceIdByStatus'](serviceSelection.value, statusSelection.value))

    // 分栏定义
    const columns = computed(() => [
      {
        name: 'status',
        label: locale.value === 'zh' ? '申请状态' : 'Status',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'creation_time',
        label: locale.value === 'zh' ? '申请时间' : 'Submission Time',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'service',
        label: locale.value === 'zh' ? '服务节点' : 'Service Node',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'duration_days',
        label: locale.value === 'zh' ? '云主机时长' : 'Available Time',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'configuration',
        label: locale.value === 'zh' ? 'CPU / 内存 / 私网IP / 公网IP / 云硬盘 ' : 'CPU / MEM / Private IP / Public IP / Disk',
        field: 'configuration',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'vo',
        label: locale.value === 'zh' ? '配额类型' : 'Quota Type',
        field: 'vo',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'purpose',
        label: locale.value === 'zh' ? '用途' : 'Purpose',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 250px;padding: 15px 5px;white-space: normal;' // https://forum.quasar-framework.org/topic/844/word-wrap-using-in-datatables/5
      },
      {
        name: 'applicant',
        label: locale.value === 'zh' ? '申请人' : 'Applicant',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 0px'
      },
      {
        name: 'operation',
        label: locale.value === 'zh' ? '操作' : 'Operations',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 0px'
      }
    ])

    // 被pagination组件使用。
    const pagination = ref({
      page: 1, // 当前页码
      rowsPerPage: 10, // 每页条数
      count: 0 // 总共条数
    })

    // 更新表格，并更细count值
    const reloadTable = async () => {
      // 更新table并保存count值
      pagination.value.count = await $store.dispatch('provider/loadAdminQuotaApplicationTable', {
        page: pagination.value.page,
        pageSize: pagination.value.rowsPerPage,
        serviceId: serviceSelection.value,
        status: statusSelection.value
      })
    }

    // 当两个筛选参数变化时,当rowsPerPage变化时
    const resetAndReloadTable = () => {
      // 分页信息复位
      pagination.value.page = 1
      // 更新table
      void reloadTable()
    }

    // onMounted时加载初始table第一页
    onMounted(reloadTable)

    return {
      columns,
      rows,
      serviceOptions,
      serviceSelection,
      statusOptions,
      statusSelection,
      pagination,
      resetAndReloadTable,
      reloadTable
    }
  }
})
</script>

<style lang="scss" scoped>
.Manage {
}

.application-card {
  width: 450px;
}

</style>
