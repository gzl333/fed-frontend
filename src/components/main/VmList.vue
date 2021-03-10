<template>
  <div class="VmList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">云主机</div>
          </div>
          <div class="col-auto">
            <q-input
              dark
              dense
              standout
              v-model="text"
              input-class="text-right"
              class="q-ml-sm"
            >
              <template v-slot:append>
                <q-icon v-if="text === ''" name="search" />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="text = ''"
                />
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <router-link :to="`/my/usage/vm`" class="flat text-white q-ml-md"
              >全部云主机</router-link
            >
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          class="my-sticky-header-table"
          :rows="serverData"
          :columns="columns"
          row-key="index"
          color="secondary"
          :filter="filter"
          virtual-scroll
          style="height: 430px"
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bolder text-h3"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="index" :props="props">
                {{ props.row.index }}
              </q-td>
              <q-td key="type" :props="props">
                <q-img
                  :src="props.row.type"
                  spinner-color="white"
                  style="height: 40px; max-width: 40px"
                ></q-img>
              </q-td>
              <q-td key="ip" :props="props">
                {{ props.row.ip }}
              </q-td>
              <q-td key="status" :props="props">
                <q-badge v-if="props.row.status" color="green"> 正常 </q-badge>
                <q-badge v-else color="red"> 异常 </q-badge>
              </q-td>
              <q-td key="center" :props="props">
                <q-badge color="orange">
                  {{ props.row.center }}
                </q-badge>
              </q-td>
              <q-td key="remark" :props="props">
                {{ props.row.remark }}
              </q-td>
              <q-td key="op" :props="props">
                <div class="q-gutter-sm">
                  <q-btn round color="deep-orange" label="VPN"></q-btn>
                  <q-btn round color="secondary" label="VNC"></q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
const columns = [
  {
    name: 'index',
    label: '#',
    align: 'center',
    field: 'index'
  },
  {
    name: 'type',
    label: '类型',
    align: 'center',
    field: 'type'
  },
  {
    name: 'ip',
    align: 'center',
    label: 'IP地址',
    field: 'ip'
  },
  {
    name: 'status',
    align: 'center',
    label: '运行状态',
    field: 'status'
  },
  {
    name: 'center',
    align: 'center',
    label: '数据中心',
    field: 'center'
  },
  {
    name: 'remark',
    align: 'center',
    label: '备注',
    field: 'remark'
  },
  {
    name: 'op',
    align: 'center',
    label: '操作'
  }
]
const serverData = [
  {
    index: 1,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: true,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 2,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: true,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 3,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: true,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 4,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: true,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 5,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: false,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 6,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: false,
    center: 'e_HR_204',
    remark: '用于前端开发'
  },
  {
    index: 7,
    type: 'main/ev5-01.png',
    ip: '11.11.1.1',
    status: true,
    center: 'e_HR_204',
    remark: '用于前端开发'
  }

]

export default defineComponent({
  name: 'VmList',
  components: {
  },
  props: {
  },
  setup () {
    const route = useRoute()
    return {
      filter: ref(''),
      text: ref(''),
      columns,
      serverData,
      pagination: ref({
        rowsPerPage: 0
      }),
      route
    }
  }
})
</script>

<style lang="scss" scoped>
.VmList {
}
.my-card {
  width: 100%;
}
.my-sticky-header-table {
  height: 310px;
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #fff;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:last-child th {
    top: 0px;
  }
  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }
}
</style>
