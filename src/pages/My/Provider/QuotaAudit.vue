<template>
  <div class="Manage">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选服务节点')" v-model="serviceSelection"
                      :options="serviceOptions" emit-value map-options option-value="value"
                      :option-label="locale==='zh'? 'label':'labelEn'"
                      @update:model-value="onFilterChange"/>
          </div>
        </div>
      </div>

      <div class="col-5" v-if="pagination.count">
        <div class="row justify-center items-center q-gutter-sm">
          <q-pagination v-model="pagination.page"
                        :max="Math.ceil(pagination.count / pagination.rowsPerPage )"
                        :max-pages="8"
                        direction-links
                        boundary-links
                        boundary-numbers
                        flat
                        :ripple="false"
          />
          <div class="text-grey">
            <q-select v-model="pagination.rowsPerPage" :options="[5,10,15,20,25,30]" dense/>
            项/页
          </div>
          <div class="text-grey">共计{{ pagination.count }}项</div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label :label="$t('筛选申请状态')" v-model="statusSelection"
                      :options="statusOptions" emit-value map-options option-value="value"
                      :option-label="locale==='zh'? 'label':'labelEn'"
                      @update:model-value="onFilterChange"/>
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
      :pagination="paginationTable"
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
                  {{ new Date(props.row?.approve_time).toLocaleString(locale) }}
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
                  {{ new Date(props.row?.approve_time).toLocaleString(locale) }}
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
                  {{ new Date(props.row?.approve_time).toLocaleString(locale) }}
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
            <q-tooltip :offset="[0, -15]">
              {{ props.row.purpose }}
            </q-tooltip>
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
      <!--   todo 批量操作-->
      <!--      </template>-->
    </q-table>

    <q-separator/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
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
        label: '全部状态',
        labelEn: 'All Status'
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

    // 列表分栏定义
    const columns = [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'configuration',
        label: 'CPU/内存/私网IP/公网IP/云硬盘',
        field: 'configuration',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'vo',
        label: '配额类型',
        field: 'vo',
        align: 'center',
        style: 'padding: 15px 0px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 250px;padding: 15px 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 0px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 0px'
      }
    ]

    // Table所需配置对象，不用table的分页，此配置对象只为设置表格显示最大值。
    const paginationTable = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 99999 // 此为能显示的最大行数
    })

    // 同时这个对象也被pagination组件使用。
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      count: 0
    })

    // 更新表格，并更细count值
    const updateProviderQuotaApplicationTable = async () => {
      pagination.value.count = await $store.dispatch('provider/loadAdminQuotaApplicationTable', {
        page: pagination.value.page,
        pageSize: pagination.value.rowsPerPage,
        serviceId: serviceSelection.value,
        status: statusSelection.value
      })
    }

    // 当筛选参数变化时
    const onFilterChange = () => {
      // 分页信息复位
      pagination.value.page = 1
      // 更新table
      void updateProviderQuotaApplicationTable()
    }

    // 当pagination参数变化时
    watch(pagination.value, updateProviderQuotaApplicationTable)

    // onMounted时加载初始table第一页
    onMounted(updateProviderQuotaApplicationTable)

    return {
      locale,
      paginationTable,
      columns,
      rows,
      serviceOptions,
      serviceSelection,
      statusOptions,
      statusSelection,
      onFilterChange,
      pagination
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
