<template>
  <div class="Manage">
    <div class="row justify-end q-mb-md">
      <div class="col-3">
        <q-select map-options emit-value outlined dense stack-label label="筛选" :options="filterOptions" v-model="filterSelection" @update:model-value="change"/>
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
          <q-td key="ipv4" :props="props">
            {{props.row.ipv4}}
<!--            <q-btn-->
<!--              class="q-ma-none" :label="props.row.ipv4" color="primary" padding="none" flat dense unelevated-->
<!--              :to="{path: '/my/group/server/detail/' + props.row.id}">-->
<!--              <q-tooltip>-->
<!--                {{ $t('进入云主机详情') }}-->
<!--              </q-tooltip>-->
<!--            </q-btn>-->
          </q-td>
          <q-td key="service" :props="props">
            <div>{{ $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name }}</div>
          </q-td>
          <q-td key="user" :props="props">
            {{ props.row.user.username }}
          </q-td>
          <q-td key="remark" :props="props">
            {{ props.row.remarks }}
          </q-td>
          <q-td key="configuration" :props="props">
            {{ `${props.row.vcpus}核/${props.row.ram / 1024}GB` }}
          </q-td>
          <q-td key="public_ip" :props="props">
            {{ props.row.public_ip === true ? '公网' : '私网' }}
          </q-td>
          <q-td key="creation_time" :props="props">
            {{ new Date(props.row.creation_time).toLocaleString() }}
          </q-td>
          <q-td key="expiration_time" :props="props">
            {{ new Date(props.row.expiration_time).toLocaleString() }}
          </q-td>

<!--          <q-td key="user_quota" :props="props">-->
<!--            {{ !$store.state.vm.tables.providerServerTable.byId[props.row.user_quota]?.display ? '暂时为空' : $store.state.vm.tables.providerServerTable.byId[props.row.user_quota]?.display}}-->
<!--          </q-td>-->

          <q-td key="center_quota" :props="props">
            {{ props.row.center_quota === 1 ? '私有配额' : '共享配额' }}
          </q-td>

        </q-tr>
      </template>
    </q-table>
    <div class="q-pa-md row justify-end">
      <div class="text-subtitle1 text-weight-bold q-mr-lg">
            <span>
            15条/页 共{{paginationTable.count}}条数据
          </span>
      </div>
      <div>
        <q-pagination
          v-model="paginationTable.page"
          :max="Math.ceil(paginationTable.count/15)"
          :max-pages="5"
          ellipsess
          direction-links
          @update:model-value="changePagination"
        >
        </q-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'Manage',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // 获取列表数据
    const rows = computed(() => $store.getters['vm/getUserByCreateTime'])

    // 列表分栏定义
    const columns = [
      {
        name: 'ipv4',
        label: 'IP地址',
        field: 'ipv4',
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
        name: 'user',
        label: '用户',
        field: 'user',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'remark',
        label: '备注',
        field: 'remark',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'configuration',
        label: 'CPU/内存',
        field: 'configuration',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'public_ip',
        label: '网络类型',
        field: 'public_ip',
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
        name: 'expiration_time',
        label: '到期时间',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      // {
      //   name: 'user_quota',
      //   label: '配额情况',
      //   field: 'user_quota',
      //   align: 'center',
      //   style: 'padding: 15px 5px'
      // },
      {
        name: 'center_quota',
        label: '配额类型',
        field: 'center_quota',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]
    const filterSelection = ref({
      label: '全部服务',
      value: ''
    })
    // q-pagination 所需配置对象
    const paginationTable = ref({
      page: 1,
      count: 0,
      rowsPerPage: 9999 // 此为能显示的最大行数
    })
    const payload = {
      page: 1,
      page_size: 15,
      'as-admin': true
    }
    const change = () => {
      Object.assign(payload, { service_id: filterSelection.value })
      paginationTable.value.count = 0
      paginationTable.value.page = 1
      payload.page = 1
      void $store.dispatch('vm/loadUserServerTable', payload).then((res) => {
        paginationTable.value.count = res.data.count
      }).catch(() => {
        paginationTable.value.count = 0
      })
    }
    const changePagination = (val: number) => {
      payload.page = val
      void $store.dispatch('vm/loadUserServerTable', payload)
    }
    const filterOptions = computed(() => $store.getters['vm/getGlobalService'])
    onMounted(() => {
      void $store.dispatch('vm/loadUserServerTable', payload).then((res) => {
        paginationTable.value.count = res.data.count
      })
    })
    return {
      $store,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
      changePagination,
      change
    }
  }
})
</script>

<style lang="scss" scoped>
.Manage {
}
</style>
