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
            <!--            <q-badge v-if="(new Date() - new Date(props.row.creation_time)) < 1000 * 60 * 60 * 1 "-->
            <!--                     style="top:10px" color="light-green" floating transparent rounded align="middle">-->
            <!--              new-->
            <!--            </q-badge>-->

            <q-badge v-if="props.row.status === 'wait'"
                     style="top:10px" color="light-green" floating transparent rounded align="middle">
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
            <!--            <div>{{-->
            <!--                $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name-->
            <!--              }}-->
            <!--            </div>-->
            <div>{{ $store.state.fed.tables.serviceTable.byId[props.row.service]?.name }}</div>
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
            {{ props.row.classification === 'vo' ? $t('项目组') : $t('个人') }}
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
  name: 'Manage',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // adminQuotaApplicationTable数据更新来自后台，进入页面后应强制更新table
    void $store.dispatch('provider/loadAdminQuotaApplicationTable')

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
    const rows = computed(() => $store.getters['provider/getAdminApplicationsByFilter'](filterSelection.value.value))

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
    const currentApplication = computed(() => $store.state.provider.tables.adminQuotaApplicationTable.byId[currentId.value])

    return {
      locale,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
      currentApplication
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
