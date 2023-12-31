<template>
  <div class="Manage">
    <div class="row q-col-gutter-md q-pb-md">
      <div class="row col-6 items-center q-col-gutter-xs">
        <div class="col-2 text-subtitle1">搜索条件:</div>
        <q-select outlined dense clearable v-model="model" :options="options" label="请选择" class="col-5"
                  @update:model-value="change"/>
        <q-input outlined dense v-model="text" label="请输入" :disable="disable" class="col-5"/>
      </div>
      <div class="col-5 row items-center">
        <q-select map-options emit-value outlined dense stack-label label="请选择服务" :options="filterOptions"
                  v-model="searchQuery.service_id" class="col-7" color="primary"/>
        <q-btn outline color="primary" text-color="black" label="搜索" class="col-3 q-ml-md" @click="search"/>
      </div>
    </div>
    <q-table
      flat
      table-header-class="bg-grey-1 text-grey"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :loading="!$store.state.provider.tables.adminServerTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无云主机"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="ipv4" :props="props">
            {{ props.row.ipv4 }}
            <!--            <q-btn-->
            <!--              class="q-ma-none" :label="props.row.ipv4" color="primary" padding="none" flat dense unelevated-->
            <!--              :to="{path: '/my/group_obsolete/server/detail/' + props.row.id}">-->
            <!--              <q-tooltip>-->
            <!--                {{ $t('进入云主机详情') }}-->
            <!--              </q-tooltip>-->
            <!--            </q-btn>-->
          </q-td>
          <q-td key="service" :props="props">
            <div>{{ $store.state.fed.tables.serviceTable.byId[props.row.service]?.name }}</div>
          </q-td>
          <q-td key="user" :props="props">
            {{ props.row.user.username }}
          </q-td>
          <q-td key="remark" :props="props">
            {{ props.row.remarks }}
          </q-td>
          <q-td key="image" :props="props">
            {{ props.row.image }}
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
          <q-td key="center_quota" :props="props">
            {{ props.row.center_quota === 1 ? '私有配额' : '共享配额' }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator/>
    <div class="row q-pa-sm text-grey justify-between items-center">
      <div class="row items-center">
        <span class="q-pr-md">共{{ paginationTable.count }}台云主机</span>
        <q-select color="grey" v-model="paginationTable.rowsPerPage" :options="[5,10,15,20,25,30]" dense options-dense
                  borderless @update:model-value="changePageSize">
        </q-select>
        <span>/页</span>
      </div>
        <q-pagination
          v-model="paginationTable.page"
          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
          :max-pages="9"
          direction-links
          outline
          :ripple="false"
          @update:model-value="changePagination"
        />
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
    const rows = computed(() => $store.getters['provider/getAdminServers'])
    const filterOptions = computed(() => $store.getters['fed/getServices'])
    // 列表分栏定义
    const columns = [
      {
        name: 'ipv4',
        label: 'IP地址',
        field: 'ipv4',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'user',
        label: '用户',
        field: 'user',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'remark',
        label: '备注',
        field: 'remark',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'image',
        label: '操作系统',
        field: 'image',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
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
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '创建时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'expiration_time',
        label: '到期时间',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'center_quota',
        label: '配额类型',
        field: 'center_quota',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      }
    ]
    const searchQuery: any = ref({
      page: 1,
      page_size: 15,
      service_id: {
        label: '全部服务',
        value: ''
      },
      'as-admin': true
    })
    const paginationTable = ref({
      page: 1,
      count: 0,
      rowsPerPage: 15
    })
    const disable = ref(true)
    const options = ref(['用户ID', '用户账号', 'VOID'])
    const model: any = ref(null)
    const text = ref('')
    const change = () => {
      delete searchQuery.value.username
      delete searchQuery.value['user-id']
      delete searchQuery.value['vo-id']
      if (model.value !== null) {
        disable.value = false
      } else {
        text.value = ''
        disable.value = true
      }
    }
    const getData = (query: any) => {
      if (Object.prototype.toString.call(searchQuery.value.service_id) === '[object Object]') {
        searchQuery.value.service_id = ''
      }
      const response = $store.dispatch('provider/loadAdminServerTable', query)
      return response
    }
    const search = () => {
      searchQuery.value.page = 1
      paginationTable.value.count = 0
      paginationTable.value.page = 1
      if (model.value === null) {
        void getData(searchQuery.value).then((res) => {
          paginationTable.value.count = res.data.count
        }).catch(() => {
          paginationTable.value.count = 0
        })
      } else {
        if (model.value === '用户ID') {
          searchQuery.value['user-id'] = text.value
        } else if (model.value === '用户账号') {
          searchQuery.value.username = text.value
        } else {
          searchQuery.value['vo-id'] = text.value
        }
        void getData(searchQuery.value).then((res) => {
          paginationTable.value.count = res.data.count
        }).catch(() => {
          paginationTable.value.count = 0
        })
      }
    }
    const changePagination = (val: number) => {
      searchQuery.value.page = val
      void getData(searchQuery.value)
    }
    const changePageSize = () => {
      searchQuery.value.page_size = paginationTable.value.rowsPerPage
      searchQuery.value.page = 1
      paginationTable.value.page = 1
      void getData(searchQuery.value)
    }
    onMounted(() => {
      void getData(searchQuery.value).then((res) => {
        paginationTable.value.count = res.data.count
      })
    })
    return {
      $store,
      paginationTable,
      columns,
      rows,
      searchQuery,
      filterOptions,
      model,
      disable,
      text,
      options,
      changePagination,
      search,
      changePageSize,
      change
    }
  }
})
</script>

<style lang="scss" scoped>
.Manage {
}
</style>
