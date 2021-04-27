<template>
  <div class="VmTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="props.vms"
      :columns="columns"
      row-key="name"
      no-data-label=""
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props"
              @mouseenter="onMouseEnterRow(props.row.name)"
              @mouseleave="onMouseLeaveRow"
        >
          <q-td key="ip" :props="props">
            <div class="row">
              <div class="col">

                <q-btn
                  class="q-ma-none" :label="props.row.ipv4" color="primary" flat dense unelevated
                  :to="{path: `/my/usage/vmdetail/${props.row.id}`}">
                  <q-tooltip>
                    进入详情页面
                  </q-tooltip>
                </q-btn>

                <q-btn v-show="hoverRow === props.row.name"
                       class="col-shrink q-px-xs q-ma-none" flat dense icon="content_copy" size="xs" color="primary"
                       @click="clickToCopy(props.row.ipv4)">
                  <q-tooltip>
                    复制
                  </q-tooltip>
                </q-btn>
                <q-btn v-show="hoverRow !== props.row.name"
                       class="col-shrink q-px-xs q-ma-none invisible" flat dense icon="content_copy" size="xs"
                >
                </q-btn>

              </div>
            </div>
          </q-td>
          <q-td key="dataCenterName" :props="props">
            {{ $store.state.vm.tables.userServiceTable.byId[props.row.service]?.name }}
          </q-td>
          <q-td key="serviceType" :props="props">
            {{ $store.state.vm.tables.userServiceTable.byId[props.row.service]?.service_type }}
          </q-td>
          <q-td key="image" :props="props">
            {{ props.row.image }}
          </q-td>
          <q-td key="cpu" :props="props">
            {{ props.row.vcpus }}核
          </q-td>
          <q-td key="ram" :props="props">
            {{ props.row.ram / 1024 }}GB
          </q-td>
          <q-td key="expiration" :props="props">
            <div>{{ new Date(props.row.expiration_time).toLocaleString() }}</div>
            <div v-if="(new Date(props.row.expiration_time).getTime() - new Date().getTime()) < 0" class="text-red">
              已到期
            </div>
          </q-td>
          <q-td key="note" :props="props">
            <div class="row">
              <q-btn v-show="hoverRow === props.row.name"
                     class="col-shrink q-px-xs q-ma-none" flat dense icon="edit" size="xs" color="primary"
                     @click="popEditNote(props.row.id)">
                <q-tooltip>
                  编辑备注
                </q-tooltip>
              </q-btn>
              <q-btn v-show="hoverRow !== props.row.name"
                     class="col-shrink q-px-xs q-ma-none invisible" flat dense icon="edit" size="xs"
              />
              <div class="col q-ma-none">
                {{ props.row.remarks }}
              </div>

            </div>
          </q-td>
          <q-td key="vnc" :props="props" class="non-selectable">
            <q-btn v-if="props.row.status=='运行中'" unelevated flat padding="none" size="lg" color="light-green"
                   icon="computer"
                   @click="gotoVNC(props.row.id)">
              <q-tooltip>进入远程控制</q-tooltip>
            </q-btn>
            <q-btn v-else unelevated flat padding="none" size="lg" color="grey-5" icon="computer">
              <q-tooltip>
                请开机以使用远程控制
              </q-tooltip>
            </q-btn>
          </q-td>
          <q-td key="status" :props="props" class="non-selectable">

            <q-chip v-if="!props.row.status" label="操作中" color="nord4">
              <!--              <q-inner-loading showing style="background-color:transparent">-->
              <!--                <q-spinner size="30px" color="nord9"/>-->
              <!--              </q-inner-loading>-->
            </q-chip>

            <q-chip v-if="props.row.status === '无法获取状态'" outline color="nord11" text-color="white"
                    label="无法获取状态" class="text-bold"/>
            <q-chip v-if="props.row.status === '运行中'" outline color="light-green" text-color="white"
                    label="运行中" class="text-bold">
              <q-tooltip>刷新状态</q-tooltip>
            </q-chip>
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
                     @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'start'})">
                <q-tooltip>
                  开机
                </q-tooltip>
              </q-btn>
              <q-btn v-if="props.row.status=='运行中'" color="nord4" icon="power_settings_new" text-color="primary"
                     @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'shutdown'})">
                <q-tooltip>
                  关机
                </q-tooltip>
              </q-btn>

              <q-btn-dropdown color="primary" label="操作">
                <q-list separator dense style="text-align:center">
                  <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-light-green"
                          @click="$store.dispatch('vm/vmOperation',{ id: props.row.id, action: 'start'})">
                    <q-item-section>
                      <q-item-label>开机</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-amber"
                          @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'reboot'})">
                    <q-item-section>
                      <q-item-label>重启</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-amber"
                          @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'shutdown'})">
                    <q-item-section>
                      <q-item-label>关机</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item :disable="props.row.status==='已关机'" clickable v-close-popup class="bg-amber"
                          @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'poweroff'})">
                    <q-item-section>
                      <q-item-label>强制断电</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item :disable="props.row.status==='运行中'" clickable v-close-popup class="bg-red-9"
                          @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'delete'})">
                    <q-item-section>
                      <q-item-label>删除</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup class="bg-red-9"
                          @click="$store.dispatch('vm/vmOperation',{id: props.row.id, action: 'delete_force'})">
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
      </template>

    </q-table>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { VmInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { copyToClipboard, useQuasar } from 'quasar'

export default defineComponent({
  name: 'VmTable',
  components: {},
  props: {
    vms: {
      type: Array as PropType<VmInterface[]>,
      required: true
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const $q = useQuasar()

    // 云主机列表分栏定义
    const columns = [
      {
        name: 'ip',
        label: 'IP地址',
        field: 'ip',
        align: 'center',
        style: 'max-width: 150px;padding: 15px 5px'
      },
      {
        name: 'dataCenterName',
        label: '服务节点',
        field: 'dataCenterName',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'serviceType',
        label: '服务种类',
        field: 'serviceType',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'image',
        label: '系统镜像',
        field: 'image',
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
        name: 'expiration',
        label: '到期时间',
        field: 'expiration',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      // { name: 'source', label: '资源来源', field: 'source', sortable: true,align: 'center' },
      {
        name: 'note',
        label: '备注',
        field: 'note',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px'
      },
      {
        name: 'vnc',
        label: '远程控制',
        field: 'vnc',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'status',
        label: '状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px'

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
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // VNC 不保存在vuex里，vnc图标根据云主机状态变化，开机时可以点击vnc按钮，点击后再获取vnc地址并打开新窗口跳转
    const gotoVNC = async (payload: string) => {
      const response = await $store.dispatch('vm/fetchServerVNC', payload)
      const url = response.data.vnc.url
      window.open(url)
    }
    // 编辑备注
    const popEditNote = (id: string) => {
      $q.dialog({
        title: `编辑${$store.state.vm.tables.userServerTable.byId[id].ipv4}的备注信息`,
        // message: '长度限制为30个字',
        prompt: {
          model: `${$store.state.vm.tables.userServerTable.byId[id].remarks}`,
          counter: true,
          maxlength: 30,
          type: 'text' // optional
        },
        color: 'primary',
        cancel: true
      }).onOk((data: string) => {
        const payload: { id: string; remark: string; } = {
          id,
          remark: data.trim()
        }
        void $store.dispatch('vm/patchRemarks', payload).then(() =>
          $store.commit('vm/storeUserServerTableSingleRemarks', {
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
      props,
      $store,
      columns,
      gotoVNC,
      paginationTable,
      popEditNote: popEditNote,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.VmTable {
}
</style>
