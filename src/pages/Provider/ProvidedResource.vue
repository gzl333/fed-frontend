<template>
  <div class="ProvidedResource">

    <div class="row items-center justify-between q-py-md">

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

          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="time" :props="props">
            {{ new Date(props.row.time).toLocaleString() }}
          </q-td>

          <q-td key="status" :props="props">
            <div class="column bg-grey-2">
              <div class="col">

                <div class="row">
                  <div class="col">初步审核</div>
                  <div class="col">服务测试</div>
                  <div class="col">接入成功</div>
                  <div class="col">配置服务</div>
                  <div class="col">审核配置</div>
                  <div class="col">上线运行</div>
                </div>

                <div class="row">
                  <q-linear-progress :value="progress" color="secondary" class="q-mt-sm" />
                </div>

              </div>
            </div>

          </q-td>

          <q-td key="operation" :props="props">
            取消申请
          </q-td>

        </q-tr>
      </template>

      <template v-slot:bottom>
      </template>

    </q-table>

  </div>
</template>

<script lang="ts">
import { /* computed, */defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ProvidedResource',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // // adminQuotaApplicationTable数据更新来自后台，进入页面后应强制更新table
    // void $store.dispatch('applyQuota/updateAdminQuotaApplicationTable')

    // list filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })
    $store.commit('applyQuota/storeManageFilter', '0')
    watch(filterSelection, () => {
      $store.commit('applyQuota/storeManageFilter', filterSelection.value.value)
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
    const rows = [
      {
        name: '测试服务1',
        time: '2021-06-06',
        status: 'test'
      },
      {
        name: '测试服务2',
        time: '2021-06-07',
        status: 'test'
      },
      {
        name: '测试服务3',
        time: '2021-06-08',
        status: 'test'
      },
      {
        name: '测试服务4',
        time: '2021-06-09',
        status: 'test'
      },
      {
        name: '测试服务5',
        time: '2021-06-10',
        status: 'test'
      }
    ]

    // 列表分栏定义
    const columns = [
      {
        name: 'name',
        label: '服务名称',
        field: 'name',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'time',
        label: '申请时间',
        field: 'time',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'status',
        label: '审批状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px; width: 800px;'
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

    const progress = ref(0.41)

    return {
      $store,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
      progress
    }
  }
})
</script>

<style lang="scss" scoped>
.ProvidedResource {
}

</style>
