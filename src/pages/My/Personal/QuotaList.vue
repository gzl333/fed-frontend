<template>
  <div class="QuotaList">

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
      no-data-label="暂无可用配额"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

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

          <q-td key="cpu" :props="props">
            <div v-if="props.row.vcpu_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.vcpu_total && (1 - props.row.vcpu_used/ props.row.vcpu_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.vcpu_used/ props.row.vcpu_total)>=.4 ? 'light-green' : (1 - props.row.vcpu_used/ props.row.vcpu_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.vcpu_total===props.row.vcpu_used" class="text-grey">
                {{ props.row.vcpu_total }}核用尽
              </div>
              <div v-else>{{ props.row.vcpu_total - props.row.vcpu_used }}/{{ props.row.vcpu_total }}核</div>
            </q-circular-progress>
          </q-td>
          <q-td key="ram" :props="props">
            <div v-if="props.row.ram_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.ram_total && (1 - props.row.ram_used/ props.row.ram_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.ram_used/ props.row.ram_total)>=.4 ? 'light-green' : (1 - props.row.ram_used/ props.row.ram_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.ram_total===props.row.ram_used" class="text-grey">
                {{ props.row.ram_total / 1024 }}GB用尽
              </div>
              <div v-else>
                {{ (props.row.ram_total - props.row.ram_used) / 1024 }}/{{ props.row.ram_total / 1024 }}GB
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="private_ip" :props="props">
            <div v-if="props.row.private_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.private_ip_total && (1 - props.row.private_ip_used/ props.row.private_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.private_ip_used/ props.row.private_ip_total)>=.4 ? 'light-green' : (1 - props.row.private_ip_used/ props.row.private_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.private_ip_total===props.row.private_ip_used" class="text-red">
                {{ props.row.private_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.private_ip_total - props.row.private_ip_used }}/{{
                  props.row.private_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="public_ip" :props="props">
            <div v-if="props.row.public_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.public_ip_total && (1 - props.row.public_ip_used/ props.row.public_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.public_ip_used/ props.row.public_ip_total)>=.4 ? 'light-green' : (1 - props.row.public_ip_used/ props.row.public_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.public_ip_total===props.row.public_ip_used" class="text-grey">
                {{ props.row.public_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.public_ip_total - props.row.public_ip_used }}/{{
                  props.row.public_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="disk" :props="props">
            <div v-if="props.row.disk_size_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.disk_size_total && (1 - props.row.disk_size_used/ props.row.disk_size_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.disk_size_used/ props.row.disk_size_total)>=.4 ? 'light-green' : (1 - props.row.disk_size_used/ props.row.disk_size_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.disk_size_total===props.row.disk_size_used" class="text-grey">
                {{ props.row.disk_size_total }}GB用尽
              </div>
              <div v-else>{{ props.row.disk_size_total - props.row.disk_size_used }}/{{
                  props.row.disk_size_total
                }}GB
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="expiration_time" :props="props">
            <div v-if="!props.row.expiration_time">长期有效</div>
            <div v-else>
              <div>{{ new Date(props.row.expiration_time).toLocaleString() }}</div>
              <div v-if="props.row.expired" class="text-red">已过期
              </div>
            </div>
          </q-td>

          <q-td key="operation" :props="props">
            <q-btn icon="add_circle" flat dense padding="none" color="primary"
                   :disable="props.row.expired || props.row.exhausted"
                   :to="{path: `/my/personal/vmcreate`, query:{quota:props.row.id}}">
              <q-tooltip>使用该配额创建云主机</q-tooltip>
            </q-btn>

            <q-btn icon="info" flat dense padding="none" color="primary"
                   :to="{path: `/my/personal/quota_detail/${props.row.id}`}">
              <q-tooltip>详情</q-tooltip>
            </q-btn>

            <q-btn icon="delete" flat dense padding="none" color="primary"
                   @click="$store.dispatch('vm/deleteAndUpdateUserQuotaTable', props.row.id)">
              <q-tooltip>删除</q-tooltip>
            </q-btn>
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
  name: 'QuotaList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // 进入本页面强制更新vm/userQuotaTable,数据更新来自后台，进入页面后应强制更新table,刷新quota状态
    void $store.dispatch('vm/updateUserQuotaTable')

    // application filter
    const filterSelection = ref({
      label: '全部配额',
      value: '0'
    })
    $store.commit('vm/storeQuotaListFilter', '0')
    watch(filterSelection, () => {
      $store.commit('vm/storeQuotaListFilter', filterSelection.value.value)
    })
    const filterOptions = [
      {
        label: '全部配额',
        value: '0'
      },
      {
        label: '长期',
        value: null
      },
      {
        label: '未过期',
        value: 'valid'
      },
      {
        label: '已过期',
        value: 'invalid'
      }
      // 若添加以下两项则可能需在getter里修改逻辑
      // , {
      //   label: '未用尽',
      //   value: 'pass'
      // },
      // {
      //   label: '已用尽',
      //   value: 'reject'
      // }
    ]

    // quota列表分栏定义
    const columns = [
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
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'expiration_time',
        label: '配额失效时间',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 5px'
        // sortable: true,
        // sort: (a: Date, b: Date) => {
        //   console.log(a, b)
        //   return new Date(a).getTime() - new Date(b).getTime()
        // }
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]
    // 获取quota列表数据
    const rows = computed(() => $store.getters['vm/getUserQuotasByFilter'])

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    return {
      paginationTable,
      columns,
      rows,
      filterSelection,
      filterOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaList {
}
</style>
