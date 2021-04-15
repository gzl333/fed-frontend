<template>
  <div class="QuotaList">
    <q-table
      flat
      card-class=""
      table-class="text-nord0"
      table-header-class="server-table-header bg-grey-2"
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="所选择节点中无可供使用的云主机"
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
                  <!--                  <q-select outlined stack-label label="筛选" v-model="filterSelection"-->
                  <!--                            :options="filterOptions"/>-->
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

          <q-td key="service" :props="props">
            {{ $store.state.vm.tables.userServiceTable.byId[props.row.service]?.name }}
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="cpu" :props="props">
            {{ props.row.vcpu_total }}核
          </q-td>
          <q-td key="ram" :props="props">
            {{ props.row.ram_total }}
          </q-td>
          <q-td key="private_ip" :props="props">
            {{ props.row.private_ip_total }}
          </q-td>
          <q-td key="public_ip" :props="props">
            <q-circular-progress
              show-value
              font-size="12px"
              :value=" props.row.public_ip_total===0 ? 0 : (1 - props.row.public_ip_used/ props.row.public_ip_total) * 100 "
              size="80px"
              :thickness="0.22"
              color="green"
              track-color="grey-3"
              class="q-ma-sm"
            >
              <div v-if="props.row.public_ip_total===props.row.public_ip_used" class="text-red">
                用尽
              </div>
              <div v-else>
                可用{{ props.row.public_ip_total - props.row.public_ip_used }}个
              </div>
            </q-circular-progress>
            <div>
              共{{ props.row.public_ip_total }}个
            </div>
          </q-td>
          <q-td key="disk" :props="props">
            {{ props.row.disk_size_total }}
          </q-td>
          <q-td key="expiration_time" :props="props">
            {{ props.row.expiration_time }}
          </q-td>
          <q-td key="status" :props="props">
            {{ props.row.deleted }}
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
      </template>

    </q-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'QuotaList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // quota列表分栏定义
    const columns = [
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
        name: 'expiration_time',
        label: '配额过期时间',
        field: 'expiration_time',
        align: 'center'
      },
      {
        name: 'status',
        label: '配额状态',
        field: 'status',
        align: 'center'
      }
    ]
    // 获取quota列表数据
    const rows = computed(() => Object.values($store.state.vm.tables.userQuotaTable.byId))

    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }
    return {
      columns,
      rows,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaList {
}
</style>
