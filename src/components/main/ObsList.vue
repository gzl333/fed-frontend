<template>
  <div class="ObsList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">对象存储</div>
          </div>
          <div class="col-auto">
            <q-btn flat label="全部存储桶"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col-4">
            <q-circular-progress
              show-value
              font-size="12px"
              :value="index"
              size="175px"
              :thickness="0.15"
              color="teal"
              track-color="grey-3"
              class="q-ml-xl q-mt-md q-mb-xl"
            >
              {{ index }}%
            </q-circular-progress>
            <div class="q-ml-xl">总容量：200GB<br />存储空间已使用60%</div>
          </div>
          <div class="col-8">
            <q-table
              class="my-sticky-header-table"
              :rows="obsData"
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
                  <q-td key="obsName" :props="props">
                    {{ props.row.obsName }}
                  </q-td>
                  <q-td key="ftpStatus" :props="props">
                    {{ props.row.ftpStatus }}
                  </q-td>
                  <q-td key="access" :props="props">
                    <q-badge v-if="props.row.access === 'public'" color="green">
                      公有
                    </q-badge>
                    <q-badge
                      v-else-if="props.row.access === 'private'"
                      color="blue"
                    >
                      私有
                    </q-badge>
                  </q-td>
                  <q-td key="resourceStatistics" :props="props">
                    <div class="q-gutter-sm">
                      <q-btn
                        outline
                        style="color: goldenrod"
                        label="资源统计"
                      />
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div></div
      ></q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
const columns = [
  {
    name: 'index',
    label: '#',
    align: 'center',
    field: 'index'
  },
  {
    name: 'obsName',
    label: '存储桶',
    align: 'center',
    field: 'obsName'
  },
  {
    name: 'ftpStatus',
    align: 'center',
    label: 'FTP状态',
    field: 'ftpStatus'
  },
  {
    name: 'access',
    align: 'center',
    label: '访问权限',
    field: 'access'
  },
  {
    name: 'resourceStatistics',
    align: 'center',
    label: '资源统计',
    field: 'resourceStatistics'
  }
]
const obsData = [
  {
    index: 1,
    obsName: 'b1',
    ftpStatus: '开启',
    access: 'public',
    resourceStatistics: 'ok'
  },
  {
    index: 2,
    obsName: 'b2',
    ftpStatus: '开启',
    access: 'private',
    resourceStatistics: 'ok'
  },
  {
    index: 3,
    obsName: 'b3',
    ftpStatus: '开启',
    access: 'private',
    resourceStatistics: 'ok'
  },
  {
    index: 4,
    obsName: 'b4',
    ftpStatus: '开启',
    access: 'private',
    resourceStatistics: 'ok'
  },
  {
    index: 5,
    obsName: 'b5',
    ftpStatus: '开启',
    access: 'public',
    resourceStatistics: 'ok'
  },
  {
    index: 6,
    obsName: 'b6',
    ftpStatus: '开启',
    access: 'public',
    resourceStatistics: 'ok'
  },
  {
    index: 7,
    obsName: 'b7',
    ftpStatus: '开启',
    access: 'private',
    resourceStatistics: 'ok'
  }
]
export default defineComponent({
  name: 'ObsList',
  components: {
  },
  props: {
  },
  setup () {
    const index = 60
    return {
      filter: ref(''),
      text: ref(''),
      columns,
      obsData,
      pagination: ref({
        rowsPerPage: 0
      }),
      index
    }
  }
})
</script>

<style lang="scss" scoped>
.ObsList {
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
