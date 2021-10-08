<template>
  <div class="Provided">

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
            <q-select disable outlined stack-label label="筛选" v-model="filterSelection"
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

          <q-td key="resource" :props="props">
            <div class="row">
              <div class="col column">
                <div class="col-auto">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="100"
                    size="80px"
                    :thickness="0.22"
                    color="light-green"
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div>100GB</div>
                  </q-circular-progress>
                </div>
                <div class="col-auto">
                  vcpu
                </div>
              </div>

              <div class="col column">
                <div class="col-auto">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="100"
                    size="80px"
                    :thickness="0.22"
                    color="light-green"
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div>100GB</div>
                  </q-circular-progress>
                </div>
                <div class="col-auto">
                  内存
                </div>
              </div>

              <div class="col column">
                <div class="col-auto">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="100"
                    size="80px"
                    :thickness="0.22"
                    color="light-green"
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div>100个</div>
                  </q-circular-progress>
                </div>
                <div class="col-auto">
                   私网IP
                </div>
              </div>

              <div class="col column">
                <div class="col-auto">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="100"
                    size="80px"
                    :thickness="0.22"
                    color="light-green"
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div>100个</div>
                  </q-circular-progress>
                </div>
                <div class="col-auto">
                  公网IP
                </div>
              </div>

              <div class="col column">
                <div class="col-auto">
                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="100"
                    size="80px"
                    :thickness="0.22"
                    color="light-green"
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div>100GB</div>
                  </q-circular-progress>
                </div>
                <div class="col-auto">
                  云硬盘
                </div>
              </div>

            </div>

          </q-td>

          <q-td key="operation" :props="props">
            <q-btn flat unelevated padding="none" label="配置资源" color="primary" :to="{path: '/my/provider/configuration'}"/>
          </q-td>

        </q-tr>
      </template>

      <template v-slot:bottom>
      </template>

    </q-table>

  </div>
</template>

<script lang="ts">
import { /* computed, */defineComponent, ref/*, watch */ } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'Provided',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // // adminQuotaApplicationTable数据更新来自后台，进入页面后应强制更新table
    // void $store.dispatch('applyQuota_obsolete/updateAdminQuotaApplicationTable')

    // list filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })
    // $store.commit('applyQuota_obsolete/storeManageFilter', '0')
    // watch(filterSelection, () => {
    //   $store.commit('applyQuota_obsolete/storeManageFilter', filterSelection.value.value)
    // })
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
        status: '1'
      },
      {
        name: '测试服务2',
        time: '2021-06-07',
        status: '2'
      },
      {
        name: '测试服务3',
        time: '2021-06-08',
        status: '3'
      },
      {
        name: '测试服务4',
        time: '2021-06-09',
        status: '4'
      },
      {
        name: '测试服务5',
        time: '2021-06-10',
        status: '5'
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
        name: 'resource',
        label: '已供资源',
        field: 'resource',
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

    return {
      $store,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection
    }
  }
})
</script>

<style lang="scss" scoped>
.Provided {
}

</style>
