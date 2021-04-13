<template>
  <div class="Vm">
    <div class="row no-wrap">
      <!--      <div v-if="isTreeOpen" class="col-1.5 items-center q-py-sm q-px-sm q-my-lg tree-area">-->
      <!--        <div class="tree-title text-grey-7 text-center ">-->
      <!--          机构与数据中心-->
      <!--          <q-tooltip>-->
      <!--            正在使用的机构与数据中心-->
      <!--          </q-tooltip>-->
      <!--        </div>-->
      <!--        &lt;!&ndash;        <q-scroll-area class="min-tree-size">&ndash;&gt;-->
      <!--        <q-tree-->
      <!--          class="col-12 col-sm-6"-->
      <!--          default-expand-all-->
      <!--          :nodes="dataPointTree"-->
      <!--          node-key="key"-->
      <!--          selected-color="primary"-->
      <!--          v-model:selected="selectedTree"-->
      <!--        />-->
      <!--        &lt;!&ndash;                <pre>{{ rows }}</pre>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </q-scroll-area>&ndash;&gt;-->
      <!--      </div>-->

      <!--      <div class="col-shrink btn-area">-->
      <!--        <q-btn v-if="isTreeOpen" class="btn-close" unelevated color="primary"-->
      <!--               icon="arrow_back_ios_new" size="xs" padding="30px 0px" @click="toggleTree">-->
      <!--          <q-tooltip>折叠机构树</q-tooltip>-->
      <!--        </q-btn>-->
      <!--        <q-btn v-if="!isTreeOpen" class="btn-open" unelevated color="primary"-->
      <!--               icon="arrow_forward_ios" size="xs" padding="30px 0px" @click="toggleTree">-->
      <!--          <q-tooltip>展开机构树</q-tooltip>-->
      <!--        </q-btn>-->
      <!--      </div>-->

      <div class="col ">

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
            <div class="col row items-center justify-between q-pa-none">

              <q-input disable outlined bottom-slots v-model="text" label="模糊搜索" dense>
                <template v-slot:append>
                  <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer"/>
                  <q-icon name="search"/>
                </template>
              </q-input>

              <!--              <div class="col-shrink">-->
              <!--                <q-btn icon="add" color="primary" size="md" unelevated label="新建" :to="{ path: '/my/usage/vmcreate' }">-->
              <!--                  <q-tooltip>-->
              <!--                    新建云主机-->
              <!--                  </q-tooltip>-->
              <!--                </q-btn>-->
              <!--              </div>-->

              <div class="col text-center">
                <!--                <span class="text-grey-7 text-h7">-->
                <!--                  正在展示：-->
                <!--                </span>-->
                <!--                <span class="text-primary text-h7">-->
                <!--                  {{ tableTitle }}-->
                <!--                </span>-->
                <!--                <div class="col"> 选择节点：</div>-->
                <!--                <pre>{{ $store.state.usage }}</pre>-->
              </div>

              <div class="co">
                <div class="row">
                  <!--                  <div class="col-3"> 选择节点：</div>-->
                  <div class="coll-auto">
                    <q-select outlined dense v-model="serviceSelection" :options="serviceOptions"/>
                  </div>
                </div>
                <span class="text-grey-7 text-h7">

                </span>
                <span>

                </span>
              </div>

            </div>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props"
                  @mouseenter="onMouseEnterRow(props.row.name)"
                  @mouseleave="onMouseLeaveRow"
            >
              <q-td key="ip" :props="props" class="table-td-ip">
                <div class="row">
                  <div class="col">
                    <q-btn :label="props.row.ipv4" :to="{path: `/my/usage/vmdetail/${props.row.id}`}"
                           color="primary" flat dense unelevated>
                      <q-tooltip>
                        进入详情页面
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <q-btn v-show="hoverRow === props.row.name"
                         class="col-shrink q-px-xs text-nord9" flat icon="content_copy" size="xs"
                         @click="clickToCopy(props.row.ipv4)">
                    <q-tooltip>
                      复制
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-show="hoverRow !== props.row.name"
                         class="col-shrink q-px-xs invisible" flat icon="content_copy" size="xs"
                  >
                  </q-btn>
                </div>
              </q-td>
              <q-td key="dataCenterName" :props="props">
                {{ $store.state.usage.tables.userServiceTable.byId[props.row.service]?.name }}
              </q-td>
              <q-td key="serviceType" :props="props">
                {{ $store.state.usage.tables.userServiceTable.byId[props.row.service]?.service_type }}
              </q-td>
              <q-td key="image" :props="props">
                {{ props.row.image }}
              </q-td>
              <q-td key="cpu" :props="props">
                {{ props.row.vcpus }}核
              </q-td>
              <q-td key="ram" :props="props">
                {{ props.row.ram }}MB
              </q-td>
              <q-td key="expiration" :props="props">
                {{ props.row.expiration_time.substr(0, 10) }}
              </q-td>
              <q-td key="note" :props="props" class="table-td-note">
                <div class="row">
                  <div class="col">
                    {{ props.row.remarks }}
                  </div>
                  <q-btn v-show="hoverRow === props.row.name"
                         class="col-shrink q-px-xs text-nord9" flat icon="edit" size="xs"
                         @click="popEdit(props.row.id)">
                    <q-tooltip>
                      编辑备注
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-show="hoverRow !== props.row.name"
                         class="col-shrink q-px-xs invisible" flat icon="edit" size="xs"
                  >
                  </q-btn>
                </div>
              </q-td>
              <q-td key="vnc" :props="props" class="non-selectable">
                <q-btn v-if="props.row.status=='运行中'" unelevated flat padding="none" size="lg" color="nord14"
                       icon="computer"
                       @click="gotoVNC(props.row.id)">
                </q-btn>
                <q-btn v-else unelevated flat padding="none" size="lg" color="grey-5" icon="computer">
                  <q-tooltip>
                    请开机以使用远程控制
                  </q-tooltip>
                </q-btn>
              </q-td>
              <q-td key="status" :props="props" class="non-selectable">

                <q-chip v-if="!props.row.status" label="操作中" color="nord4">
                  <q-inner-loading showing class="inner-loading">
                    <q-spinner size="30px" color="nord9"/>
                  </q-inner-loading>
                </q-chip>

                <q-chip v-if="props.row.status === '无法获取状态'" outline color="nord11" text-color="white"
                        label="无法获取状态" class="text-bold"/>
                <q-chip v-if="props.row.status === '运行中'" outline color="nord14" text-color="white"
                        label="运行中" class="text-bold"/>
                <q-chip v-if="props.row.status === '已屏蔽'" outline color="nord3" text-color="white"
                        label="已屏蔽" class="text-bold"/>
                <q-chip v-if="props.row.status === '已暂停'" outline color="nord3" text-color="white"
                        label="已暂停" class="text-bold"/>
                <q-chip v-if="props.row.status === '正在关机'" outline color="nord9" text-color="white"
                        label="正在关机" class="text-bold"/>
                <q-chip v-if="props.row.status === '已关机'" outline color="nord3" text-color="white"
                        label="已关机" class="text-bold"/>
                <q-chip v-if="props.row.status === '已崩溃'" outline color="nord11" text-color="white"
                        label="已崩溃" class="text-bold"/>
                <q-chip v-if="props.row.status === '被电源管理器挂起'" outline color="nord3" text-color="white"
                        label="被电源管理器挂起" class="text-bold"/>
                <q-chip v-if="props.row.status === '与宿主机通讯失败'" outline color="nord11" text-color="white"
                        label="与宿主机通讯失败" class="text-bold"/>
                <q-chip v-if="props.row.status === '已丢失'" outline color="nord11" text-color="white"
                        label="已丢失" class="text-bold"/>
                <q-chip v-if="props.row.status === '正在创建'" outline color="nord9" text-color="white"
                        label="正在创建" class="text-bold"/>
                <q-chip v-if="props.row.status === '创建失败'" outline color="nord11" text-color="white"
                        label="创建失败" class="text-bold"/>
              </q-td>
              <q-td key="operation" :props="props" class="non-selectable">
                <q-btn-group unelevated>

                  <q-btn
                    v-if="props.row.status!=='运行中' && props.row.status!=='已关机'"
                    color="nord4" loading label="......">
                    <q-tooltip>
                      远程执行中，请稍候
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.status=='已关机'" color="nord4" icon="play_arrow" text-color="primary"
                         @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'start'})">
                    <q-tooltip>
                      开机
                    </q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.status=='运行中'" color="nord4" icon="power_settings_new" text-color="primary"
                         @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'shutdown'})">
                    <q-tooltip>
                      关机
                    </q-tooltip>
                  </q-btn>

                  <q-btn-dropdown color="primary" label="操作">
                    <q-list separator dense class="dropdown-items">
                      <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-nord14"
                              @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'start'})">
                        <q-item-section>
                          <q-item-label>开机</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                              @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'reboot'})">
                        <q-item-section>
                          <q-item-label>重启</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                              @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'shutdown'})">
                        <q-item-section>
                          <q-item-label>关机</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-nord13"
                              @click="vmOperation({endPoint: props.row.endpoint_url, id: props.row.id, action: 'poweroff'})">
                        <q-item-section>
                          <q-item-label>强制断电</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-nord11"
                              @click="isShowDelConfirm = true; vmToDel.id=props.row.id; vmToDel.ip=props.row.ipv4; vmToDel.endPoint=props.row.endpoint_url; vmToDel.action='delete'">
                        <q-item-section>
                          <q-item-label>删除</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup class="bg-nord11"
                              @click="isShowDelConfirm = true; vmToDel.id=props.row.id; vmToDel.ip=props.row.ipv4; vmToDel.endPoint=props.row.endpoint_url; vmToDel.action='delete_force'">
                        <q-item-section>
                          <q-item-label>强制删除</q-item-label>
                        </q-item-section>
                      </q-item>

                    </q-list>
                  </q-btn-dropdown>
                </q-btn-group>
              </q-td>
            </q-tr>
          </template>

          <template v-slot:bottom>
            <!--            blank bottom just to show the bottom border of table-->
            <!--            <q-pagination-->
            <!--              unelevated-->
            <!--              v-if="paginationMax!==1"-->
            <!--              v-model="paginationSelected"-->
            <!--              color="primary"-->
            <!--              :max="paginationMax"-->
            <!--              :max-pages="7"-->
            <!--              size="md"-->
            <!--              :direction-links="true"-->
            <!--              @click="clickPagination"-->
            <!--            />-->
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
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'
import { useQuasar, copyToClipboard } from 'quasar'

export default defineComponent({
  name: 'Vm',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $q = useQuasar()

    // 云主机状态按钮
    const isStatusLoading = ref(true)

    // service_id下拉列表
    const serviceOptions = computed(() => $store.getters['usage/getServiceOptions'])
    const serviceSelection = ref({
      label: '全部服务节点',
      value: '0'
    })
    $store.commit('usage/storeUserServerTableFilter', '0')
    watch(serviceSelection, () => {
      $store.commit('usage/storeUserServerTableFilter', serviceSelection.value.value)
    })

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
        label: '系统镜像',
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
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center'
      },
      {
        name: 'expiration',
        label: '到期时间',
        field: 'expiration',
        align: 'center'
      },
      // { name: 'source', label: '资源来源', field: 'source', sortable: true,align: 'center' },
      {
        name: 'note',
        label: '备注',
        field: 'note',
        align: 'center'
      },
      {
        name: 'vnc',
        label: '远程控制',
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
    const rows = computed(() => $store.getters['usage/getServersByServiceId'])

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // 云主机操作
    const vmOperation = (payload: { endPoint: string; id: string; action: string; ip?: string }) => {
      void $store.dispatch('usage/vmOperation', payload)
      // console.log('in vmops', payload)
      if (payload.action === 'delete' || payload.action === 'delete_force') {
        $q.notify({
          spinner: true,
          timeout: 4000,
          color: 'primary',
          message: `正在删除IP地址为：${payload.ip || ''} 的云主机，请稍候`,
          closeBtn: false
        })
      }
    }
    // VNC 不保存在vuex里，vnc图标根据云主机状态变化，开机时可以点击vnc按钮，点击后再获取vnc地址并打开新窗口跳转
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
    // 编辑备注
    const popEdit = (id: string) => {
      $q.dialog({
        title: `编辑${$store.state.usage.tables.userServerTable.byId[id].ipv4}的备注信息`,
        message: '长度限制为15个字',
        prompt: {
          model: `${$store.state.usage.tables.userServerTable.byId[id].remarks}`,
          counter: true,
          maxlength: 15,
          type: 'text' // optional
        },
        color: 'primary',
        cancel: true
      }).onOk((data: string) => {
        const payload: { id: string; remark: string; } = {
          id,
          remark: data.trim()
        }
        void $store.dispatch('usage/patchRemarks', payload).then(() =>
          $store.commit('usage/storeUserServerTableSingleRemarks', {
            serverId: id,
            remarks: data.trim()
          })
        )
      })
    }
    // 复制信息到剪切板
    const clickToCopy = async (text: string) => {
      void await copyToClipboard(text).then(() => {
        $q.notify({
          color: 'primary',
          message: `${text} 已经复制到剪切板`,
          // position: 'bottom-right',
          closeBtn: false,
          timeout: 1500
        })
      })
    }
    // table row hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }
    return {
      $store,
      columns,
      rows,
      vmOperation,
      isStatusLoading,
      gotoVNC,
      isShowDelConfirm,
      vmToDel,
      paginationTable,
      popEdit,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow,
      serviceSelection,
      serviceOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}

.server-table-header {
  background-color: #999;
}

.table-td-ip {
  min-width: 160px;
}

.table-td-note {
  min-width: 220px;
}

.inner-loading {
  background-color: transparent;
}

.dropdown-items {
  text-align: center;
}

</style>
