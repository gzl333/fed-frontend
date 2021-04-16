<template>
  <div class="ApplicationList">
    <q-table
      flat
      card-class=""
      table-class="text-nord0"
      table-header-class="bg-grey-2"
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="无结果"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:top>
        <!--slot外有一层row，需要用col接一下，再新建row-->
        <div class="col">

          <div class="row items-center justify-between q-pa-none">
            <div class="col-3">
              <div class="row justify-start">
                <div class="col">
                  <q-input disable outlined v-model="text" stack-label label="搜索">
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
                  <q-select outlined stack-label label="筛选" v-model="filterSelection"
                            :options="filterOptions"/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props"
              @mouseenter="onMouseEnterRow(props.row.name)"
              @mouseleave="onMouseLeaveRow"
        >

          <q-td key="status" :props="props">
            <div v-if="props.row.status === 'wait'">待审批</div>
            <div v-if="props.row.status === 'pending'" class="text-primary">审批中</div>
            <div v-if="props.row.status === 'pass'" class="text-green">已通过</div>
            <div v-if="props.row.status === 'reject'" class="text-red">已拒绝</div>
            <div v-if="props.row.status === 'cancel'" class="text-grey">已取消</div>
          </q-td>

          <q-td key="creation_time" :props="props">
            {{ props.row.creation_time }}
          </q-td>

          <q-td key="service" :props="props">
            <div>{{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.userServiceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.vm.tables.userServiceTable.byId[props.row.service]?.name }}</div>
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
              <!-- todo-->
              <q-btn label="修改申请" flat dense padding="none" color="primary"/>
            </div>
            <div v-if="props.row.status === 'wait'">
              <q-btn label="取消申请" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/cancelAndStoreQuotaApplication', props.row.id)"
              />
            </div>
            <div v-if="props.row.status !== 'wait'">
              <q-btn label="删除记录" flat dense padding="none" color="grey-7"
                     @click="$store.dispatch('applyQuota/deleteAndUpdateQuotaApplication', props.row.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
      </template>

    </q-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ApplicationList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // application filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })
    $store.commit('applyQuota/storeApplicationListFilter', '0')
    watch(filterSelection, () => {
      $store.commit('applyQuota/storeApplicationListFilter', filterSelection.value.value)
      // console.log($store.state.applyQuota.pages.quotaList)
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
    // 获取quota列表数据
    const rows = computed(() => $store.getters['applyQuota/getUserApplicationsByFilter'])

    // quota列表分栏定义
    const columns = [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center'
      },
      {
        name: 'duration_days',
        label: '资源有效期',
        field: 'duration_days',
        align: 'center'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center'
      }
    ]

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }

    return {
      $store,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.ApplicationList {
}
</style>
