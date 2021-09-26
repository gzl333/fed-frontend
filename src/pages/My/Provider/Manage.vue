<template>
  <div class="Manage">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label label="搜索">
              <template v-slot:append>
                <!--                      <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer"/>-->
                <q-icon name="search"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-select outlined dense stack-label label="筛选" v-model="filterSelection"
                      :options="filterOptions"/>
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
      no-data-label="无结果"
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
            <div>{{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name }}</div>
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="configuration" :props="props">
            {{ props.row.vcpu }}核 / {{ props.row.ram / 1024 }}GB / {{ props.row.private_ip }}个 / {{ props.row.public_ip }}个 / {{ props.row.disk_size }}GB
          </q-td>

          <q-td key="vo" :props="props">
            {{ props.row.classification === 'vo' ? $t('项目组') : $t('个人') }}
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
              <q-btn label="开始审批" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/auditQuotaApplicationDialog',props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'pending'">
              <q-btn label="继续审批" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/auditQuotaApplicationDialog',props.row.id)"/>
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
      <!--      todo 批量操作-->
      <!--      </template>-->
    </q-table>

    <q-separator/>

    <!--    <q-dialog v-model="isShowAudit">-->
    <!--      <q-card class="application-card">-->
    <!--        <q-card-section class="row items-center justify-center q-pb-sm">-->
    <!--          <div class="text-primary">配额审批</div>-->
    <!--          <q-space/>-->
    <!--          <q-btn icon="close" flat dense size="sm" v-close-popup/>-->
    <!--        </q-card-section>-->

    <!--        <q-separator/>-->

    <!--        <q-card-section>-->
    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">申请时间</div>-->
    <!--            <div class="col">{{ new Date(currentApplication.creation_time).toLocaleString() }}</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">服务节点</div>-->
    <!--            <div class="col">-->
    <!--              {{-->
    <!--                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[currentApplication.service].data_center].name-->
    <!--              }}-->
    <!--              - {{ $store.state.vm.tables.globalServiceTable.byId[currentApplication.service].name }}-->
    <!--            </div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">云主机时长</div>-->
    <!--            <div class="col">{{ currentApplication.duration_days }}天</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">CPU</div>-->
    <!--            <div class="col">{{ currentApplication.vcpu }}核</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">内存</div>-->
    <!--            <div class="col">{{ currentApplication.ram / 1024 }}GB</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">私网IP</div>-->
    <!--            <div class="col">{{ currentApplication.private_ip }}个</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">公网IP</div>-->
    <!--            <div class="col">{{ currentApplication.public_ip }}个</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">云硬盘</div>-->
    <!--            <div class="col">{{ currentApplication.disk_size }}GB</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">配额类型</div>-->
    <!--            <div class="col">{{ currentApplication.classification === 'vo' ? $t('项目组') : $t('个人') }}</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">用途</div>-->
    <!--            <div class="col">{{ currentApplication.purpose }}</div>-->
    <!--          </div>-->

    <!--          <div class="row q-py-sm">-->
    <!--            <div class="col-3 text-grey-7">申请人</div>-->
    <!--            <div class="col">-->
    <!--              <div>{{ currentApplication.contact }}</div>-->
    <!--              <div>{{ currentApplication.company }}</div>-->
    <!--            </div>-->
    <!--          </div>-->

    <!--        </q-card-section>-->

    <!--        <q-separator/>-->

    <!--        <q-card-actions align="right">-->
    <!--          <q-btn v-close-popup flat color="primary" label="通过"-->
    <!--                 @click="$store.dispatch('applyQuota/approveAndUpdateAdminQuotaApplicationTable',currentApplication.id)"/>-->
    <!--          <q-btn v-close-popup flat color="red" label="拒绝"-->
    <!--                 @click="$store.dispatch('applyQuota/rejectAndUpdateAdminQuotaApplicationTable',currentApplication.id)"/>-->
    <!--        </q-card-actions>-->
    <!--      </q-card>-->
    <!--    </q-dialog>-->

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
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

    // adminQuotaApplicationTable数据更新来自后台，进入页面后应强制更新table
    void $store.dispatch('applyQuota/updateAdminQuotaApplicationTable')

    // list filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })

    const filterOptions = [
      {
        label: '全部状态',
        value: '0'
      },
      {
        label: '待审批',
        value: 'wait'
      },
      {
        label: '审批中',
        value: 'pending'
      },
      {
        label: '已通过',
        value: 'pass'
      },
      {
        label: '已拒绝',
        value: 'reject'
      },
      {
        label: '已取消',
        value: 'cancel'
      }
    ]

    // 获取列表数据
    const rows = computed(() => $store.getters['applyQuota/getAdminApplicationsByFilter'](filterSelection.value.value))

    // 列表分栏定义
    const columns = [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'configuration',
        label: 'CPU/内存/私网IP/公网IP/云硬盘',
        field: 'configuration',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'vo',
        label: '配额类型',
        field: 'vo',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 9999 // 此为能显示的最大行数
    })

    // 正在操作的applicationId
    const currentId = ref('')
    // 正在操作的application对象
    const currentApplication = computed(() => $store.state.applyQuota.tables.adminQuotaApplicationTable.byId[currentId.value])
    // 审批dialog model
    const isShowAudit = ref(false)
    // 开始审批
    const audit = (id: string) => {
      currentId.value = id
      isShowAudit.value = true
    }
    // 挂起并审批
    const suspendAndAudit = async (id: string) => {
      // api挂起id, 并保存新的响应中的application信息
      void await $store.dispatch('applyQuota/suspendAndUpdateAdminQuotaApplicationTable', id)
      // 开始审批
      audit(id)
    }
    return {
      $store,
      locale,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
      currentApplication,
      isShowAudit,
      audit,
      suspendAndAudit
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
