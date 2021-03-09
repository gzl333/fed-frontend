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
          :title="`云主机所在节点：${tableTitle}`"
          :rows="rows"
          :columns="columns"
          row-key="name"
          no-data-label="所选择节点中无可供使用的云主机"
          hide-pagination
          :pagination="paginationTable"
        >
          <template v-slot:top>
            <div class="col row items-center justify-between q-pa-none">

              <div class="col-shrink text-nord9 text-h7">
                <q-btn icon="add" color="nord14" size="lg">
                  <q-tooltip>
                    添加云主机
                  </q-tooltip>
                </q-btn>
              </div>

              <div class="col text-nord10 text-h6 table-title">
                正在展示：{{ tableTitle }}
              </div>

              <div class="col-shrink bg-nord5">
                <q-pagination
                  v-if="paginationMax!==1"
                  v-model="paginationSelected"
                  color="nord9"
                  :max="paginationMax"
                  size="md"
                  @click="clickPagination"
                />
              </div>

            </div>
          </template>

          <template v-slot:body-cell-vnc="props">
            <q-td :props="props" class="non-selectable">
              <q-btn v-if="props.row.status=='运行中'" unelevated color="nord14" icon="computer"
                     @click="gotoVNC(props.row.id)">
              </q-btn>
              <q-btn v-else unelevated color="nord3" icon="computer">
                <q-tooltip>
                  请将云主机开机以使用VNC
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="non-selectable">
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

                <q-btn v-if="props.row.status==''" color="nord4" loading label="......">
                  <q-tooltip>
                    远程执行中，请稍候
                  </q-tooltip>
                </q-btn>
                <q-btn v-if="props.row.status=='已关机'" color="nord4" icon="play_arrow" text-color="nord10"
                       @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'start'})">
                  <q-tooltip>
                    开机
                  </q-tooltip>
                </q-btn>
                <q-btn v-if="props.row.status=='运行中'" color="nord4" icon="stop" text-color="nord10"
                       @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'shutdown'})">
                  <q-tooltip>
                    关机
                  </q-tooltip>
                </q-btn>

                <q-btn-dropdown color="nord10" label="操作">
                  <q-list separator dense class="dropdown-items">
                    <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-nord14"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'start'})">
                      <q-item-section>
                        <q-item-label>开机</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'reboot'})">
                      <q-item-section>
                        <q-item-label>重启</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'shutdown'})">
                      <q-item-section>
                        <q-item-label>关机</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                            @click="vmOperation({endPoint: props.row.endPoint, id: props.row.id, action: 'poweroff'})">
                      <q-item-section>
                        <q-item-label>强制断电</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-nord11"
                            @click="isShowDelConfirm = true; vmToDel.id=props.row.id; vmToDel.ip=props.row.ip; vmToDel.endPoint=props.row.endPoint; vmToDel.action='delete'">
                      <q-item-section>
                        <q-item-label>删除</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup class="bg-nord11"
                            @click="isShowDelConfirm = true; vmToDel.id=props.row.id; vmToDel.ip=props.row.ip; vmToDel.endPoint=props.row.endPoint; vmToDel.action='delete_force'">
                      <q-item-section>
                        <q-item-label>强制删除</q-item-label>
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-btn-dropdown>
              </q-btn-group>
            </q-td>
          </template>

        </q-table>

      </div>

      <q-dialog v-model="isShowDelConfirm">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="nord11" text-color="white"/>
            <span v-if="vmToDel.action==='delete'" class="q-ml-sm">正在删除云主机: {{ vmToDel.ip }}</span>
            <span v-if="vmToDel.action==='delete_force'" class="q-ml-sm">正在强制删除云主机: {{ vmToDel.ip }}</span>
            <div class="q-ml-sm">被删除的云主机将无法自行恢复，如需恢复请联系云联邦管理员</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="删除" color="nord11" v-close-popup @click="vmOperation(vmToDel)"/>
            <q-btn flat label="取消" color="nord10" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

  </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'Vm',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // 分页部分基础信息
    const computedPageSize = 13 // todo 通过屏幕尺寸动态计算最佳rows， 并同步至store的pageSize watch(....)
    $store.commit('usage/storePagination', {
      page: 1,
      pageSize: computedPageSize,
      serviceId: '0'
    })
    // 云主机状态按钮
    const isStatusLoading = ref(true)
    // 获取机构树，获取云主机列表
    onMounted(() => {
      void $store.dispatch('usage/updateDataPointTree')
      void $store.dispatch('usage/updateServerList')
    })

    // 得到机构树信息
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

    // 机构树上所选择节点的id
    const selectedTree = ref('0')
    // 云主机列表title
    const tableTitle = ref('全部节点')
    // 监控机构树节点选择
    watch(selectedTree, () => {
      console.log(selectedTree.value)
      if (selectedTree.value === '0' || selectedTree.value === null) {
        console.log('in null', selectedTree.value)
        // 分页store中serviceId的来源
        $store.commit('usage/storePagination', {
          serviceId: '0',
          page: '1'
        })
        // 更新serverList
        void $store.dispatch('usage/updateServerList')
        // // 更新count后要updatePagination
        // updatePagination()
        // 存储dataPointTree
        $store.commit('usage/storeDataPointOnShow', {
          key: '0',
          label: '全部节点'
        })
        tableTitle.value = $store.state.usage.dataPointOnShow.label
      } else {
        // 分页store中serviceId的来源
        $store.commit('usage/storePagination', {
          serviceId: selectedTree.value,
          page: '1'
        })
        // 更新serverList
        void $store.dispatch('usage/updateServerList') //, { service_id: selectedTree.value }
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
    // 机构树折叠
    const isTreeOpen = ref(true)
    const toggleTree = () => {
      isTreeOpen.value = !isTreeOpen.value
    }
    // 云主机列表分栏定义
    const columns = [
      {
        name: 'ip',
        label: 'IP地址',
        field: 'ip',
        align: 'center'
      },
      {
        name: 'dataCenterName',
        label: '数据中心',
        field: 'dataCenterName',
        align: 'center'
      },
      {
        name: 'serviceType',
        label: '服务种类',
        field: 'serviceType',
        align: 'center'
      },
      {
        name: 'image',
        label: '镜像',
        field: 'image',
        align: 'center'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center'
      },
      {
        name: 'mem',
        label: '内存',
        field: 'ram',
        align: 'center'
      },
      // { name: 'daysRemain', label: '到期预警', field: 'daysRemain' ,align: 'center'},
      // { name: 'source', label: '资源来源', field: 'source', sortable: true,align: 'center' },
      {
        name: 'note',
        label: '备注',
        field: 'note',
        align: 'center'
      },
      {
        name: 'vnc',
        label: 'VNC',
        field: 'vnc',
        align: 'center'
      },
      {
        name: 'status',
        label: '状态',
        field: 'status',
        align: 'center'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center'
      }
    ]
    // 获取云主机列表数据
    const rows = computed(() => $store.state.usage.serverList)

    // 供table获取分页信息，单向从store -> pagination -> UI
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })
    const paginationSelected = ref(1)
    const paginationMax = computed(() => {
      if ($store.state.usage.pagination.count && $store.state.usage.pagination.pageSize) {
        return Math.ceil($store.state.usage.pagination.count / $store.state.usage.pagination.pageSize)
      } else {
        return 1
      }
    })
    const clickPagination = () => {
      $store.commit('usage/storePagination', { page: paginationSelected.value })
      void $store.dispatch('usage/updateServerList')
    }

    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('usage/vmOperation', payload)
      // console.log('in vmops', payload)
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        Notify.create({
          spinner: true,
          timeout: 4000,
          color: 'nord9',
          message: `正在删除IP地址为：${payload.ip || ''} 的云主机，请稍候`
        })
      }
    }
    // VNC
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('usage/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    // 删除提示
    const isShowDelConfirm = ref(false)
    const vmToDel = ref({
      id: '',
      ip: '',
      endPoint: '',
      action: ''
    })

    return {
      isTreeOpen,
      toggleTree,
      selectedTree,
      dataPointTree,
      columns,
      rows,
      vmOperation,
      isStatusLoading,
      tableTitle,
      gotoVNC,
      isShowDelConfirm,
      vmToDel,
      paginationTable,
      paginationSelected,
      clickPagination,
      paginationMax
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

.table-title {
  text-align: center;
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
