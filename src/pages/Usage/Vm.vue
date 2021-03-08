<template>
  <div class="Vm">
    <div class="row no-wrap min-routerview-height min-routerview-width">

      <div v-if="isTreeOpen" class="col-1.5 items-center bg-nord5 q-py-sm q-px-sm min-tree-width">
        <div class="tree-title q-px-xs">
          机构与数据中心
          <q-tooltip>
            正在使用的机构与数据中心
          </q-tooltip>
        </div>
        <!--        <q-scroll-area class="min-tree-size">-->
        <q-tree
          class="col-12 col-sm-6"
          default-expand-all
          :nodes="dataPointTree"
          node-key="key"
          selected-color="primary"
          v-model:selected="selectedTree"
        />
        <!--          <pre>{{dataPointTree}}</pre>-->
        <!--        </q-scroll-area>-->
      </div>

      <div class="col-shrink bg-nord6 btn-area">
        <q-btn v-if="isTreeOpen" class="btn-close" unelevated color="nord9"
               icon="arrow_back_ios_new" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>折叠机构树</q-tooltip>
        </q-btn>
        <q-btn v-if="!isTreeOpen" class="btn-open" unelevated color="nord9"
               icon="arrow_forward_ios" size="xs" padding="30px 0px" @click="toggleTree">
          <q-tooltip>展开机构树</q-tooltip>
        </q-btn>
      </div>

      <div class="col bg-nord6 q-py-sm q-pr-sm">
        <q-table
          class="q-px-lg"
          flat
          card-class="bg-nord6"
          table-class="text-nord0"
          table-header-class="server-table-header bg-nord5"
          :title="`云主机位置：${tableTitle}`"
          :rows="rows"
          :columns="columns"
          row-key="name"
          no-data-label="所选择节点中无可供使用的云主机"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-inner-loading v-if="!props.row.status" showing class="inner-loading">
                <q-spinner size="30px" color="nord9"/>
              </q-inner-loading>
              <q-chip v-if="props.row.status === '无法获取状态'" square color="nord11" text-color="white"
                      label="无法获取状态"/>
              <q-chip v-if="props.row.status === '运行中'" square color="nord14" text-color="white"
                      label="运行中"/>
              <q-chip v-if="props.row.status === '已屏蔽'" square color="nord3" text-color="white"
                      label="已屏蔽"/>
              <q-chip v-if="props.row.status === '已暂停'" square color="nord3" text-color="white"
                      label="已暂停"/>
              <q-chip v-if="props.row.status === '正在关机'" square color="nord9" text-color="white"
                      label="正在关机"/>
              <q-chip v-if="props.row.status === '已关机'" square color="nord3" text-color="white"
                      label="已关机"/>
              <q-chip v-if="props.row.status === '已崩溃'" square color="nord11" text-color="white"
                      label="已崩溃"/>
              <q-chip v-if="props.row.status === '被电源管理器挂起'" square color="nord3" text-color="white"
                      label="被电源管理器挂起"/>
              <q-chip v-if="props.row.status === '与宿主机通讯失败'" square color="nord11" text-color="white"
                      label="与宿主机通讯失败"/>
              <q-chip v-if="props.row.status === '已丢失'" square color="nord11" text-color="white"
                      label="已丢失"/>
              <q-chip v-if="props.row.status === '正在创建'" square color="nord9" text-color="white"
                      label="正在创建"/>
              <q-chip v-if="props.row.status === '创建失败'" square color="nord11" text-color="white"
                      label="创建失败"/>
            </q-td>
          </template>

          <template v-slot:body-cell-operation="props">
            <q-td :props="props" class="non-selectable">
              <q-btn-group unelevated>
                <q-btn color="nord7" label="VNC"/>
                <q-btn-dropdown color="nord10" label="操作">
                  <q-list separator dense class="dropdown-items">
                    <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-nord14"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'start'})">
                      <q-item-section>
                        <q-item-label>开机</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'shutdown'})">
                      <q-item-section>
                        <q-item-label>关机</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'reboot'})">
                      <q-item-section>
                        <q-item-label>软重启</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'poweroff'})">
                      <q-item-section>
                        <q-item-label>强制断电</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup class="bg-nord11"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'delete'})">
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup class="bg-nord11"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'delete_force'})">
                      <q-item-section>
                        <q-item-label>强制删除</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-btn-group>
              <!--              {{ props.row.cpu }}-->
            </q-td>
          </template>
        </q-table>
        <!--        <pre>{{rows}}</pre>-->
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'

export default defineComponent({
  name: 'Vm',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const isStatusLoading = ref(true)
    onMounted(() => {
      void $store.dispatch('usage/updateDataPointTree')
      void $store.dispatch('usage/updateServerList')
    })
    const dataPointTree = computed(() => {
      return $store.state.usage.dataPointTree
    })

    // const dataPointTree = [
    //   {
    //     key: '0',
    //     label: '全部节点',
    //     children: [
    //       {
    //         key: '中国科学院计算机网络信息中心',
    //         label: '中国科学院计算机网络信息中心',
    //         selectable: false,
    //         children: [
    //           {
    //             key: '1',
    //             label: 'HR_204机房'
    //           }
    //         ]
    //       },
    //       {
    //         key: '地球大数据科学工程专项',
    //         label: '地球大数据科学工程专项',
    //         selectable: false,
    //         children: [
    //           {
    //             key: '2',
    //             label: '怀柔机房一层'
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ]

    const selectedTree = ref('0')
    const tableTitle = ref('全部节点')
    watch(selectedTree, () => {
      console.log(selectedTree.value)
      if (selectedTree.value === '0' || selectedTree.value === null) {
        console.log('in null', selectedTree.value)
        void $store.dispatch('usage/updateServerList')
        $store.commit('usage/storeDataPointOnShow', {
          key: '0',
          label: '全部节点'
        })
        tableTitle.value = $store.state.usage.dataPointOnShow.label
      } else {
        void $store.dispatch('usage/updateServerList', { service_id: selectedTree.value })
        dataPointTree.value[0].children.forEach((dataCenterSelected) => {
          dataCenterSelected.children.forEach((dataPointSelected) => {
            // console.log(dataPoint.key, selectedTree.value)
            if (dataPointSelected.key === selectedTree.value) {
              $store.commit('usage/storeDataPointOnShow', {
                key: dataPointSelected.key,
                label: dataPointSelected.label
              })
              tableTitle.value = $store.state.usage.dataPointOnShow.label
            }
          })
        })
      }
      // console.log(tableTitle.value)
    })
    const isTreeOpen = ref(true)
    const toggleTree = () => {
      isTreeOpen.value = !isTreeOpen.value
    }
    const columns = [
      {
        name: 'ip',
        label: 'IP地址',
        field: 'ip',
        align: 'center',
        sortable: true
      },
      {
        name: 'dataCenter',
        label: '数据中心',
        field: 'dataCenter',
        align: 'center',
        sortable: true
      },
      {
        name: 'serviceType',
        label: '服务种类',
        field: 'serviceType',
        align: 'center',
        sortable: true
      },
      {
        name: 'image',
        label: '镜像',
        field: 'image',
        align: 'center',
        sortable: true
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        sortable: true
      },
      {
        name: 'mem',
        label: '内存',
        field: 'ram',
        align: 'center',
        sortable: true
      },
      // { name: 'daysRemain', label: '到期预警', field: 'daysRemain' ,align: 'center'},
      // { name: 'source', label: '资源来源', field: 'source', sortable: true,align: 'center' },
      {
        name: 'note',
        label: '备注',
        field: 'note',
        align: 'center',
        sortable: true
      },
      {
        name: 'status',
        label: '状态',
        field: 'status',
        align: 'center',
        sortable: true
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation'
      }
    ]
    const rows = computed(() => $store.state.usage.serverList)
    // const rows = [
    //   {
    //     name: 'Frozen Yogurt',
    //     calories: 159,
    //     fat: 6.0,
    //     carbs: 24,
    //     protein: 4.0,
    //     sodium: 87,
    //     calcium: '14%',
    //     iron: '1%'
    //   }]

    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string }) => {
      void $store.dispatch('usage/vmOperation', payload)
    }

    return {
      isTreeOpen,
      toggleTree,
      selectedTree,
      dataPointTree,
      columns,
      rows,
      vmOperation,
      isStatusLoading,
      tableTitle
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}

.min-routerview-height {
  min-height: calc(100vh - 114px);
}

.min-routerview-width {
  min-width: calc(100vw - 165px);
}

.min-tree-height {
  min-height: calc(100vh - 180px);
}

.min-tree-width {
  min-width: calc(100vw / 9);
}

.tree-title {
  border-radius: 3px;
  background-color: $nord9;
  text-align: center;
  color: white;
  line-height: 30px;
}

.btn-area {
  //border-right: 0.5px solid $nord9;
}

.btn-close {
  top: calc((100vh - 114px) / 2 - 50px);
  left: -22px;

}

.btn-open {
  top: calc((100vh - 114px) / 2 - 50px);
}

.server-table-header {
  background-color: #999;
}

.inner-loading {
  background-color: transparent;
}
.dropdown-items {
  text-align: center;
}
</style>
