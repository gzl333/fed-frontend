<template>
  <div class="ServerTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="props.vms"
      :columns="columns"
      row-key="name"
      no-data-label="暂无可用云主机，请创建后使用"
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
                  :to="{path: `/my/personal/vmdetail/${props.row.id}`}">
                  <q-tooltip>
                    {{ $t('进入详情页面') }}
                  </q-tooltip>
                </q-btn>

                <q-btn v-if="hoverRow === props.row.name"
                       class="col-shrink q-px-xs q-ma-none" flat dense icon="content_copy" size="xs" color="primary"
                       @click="clickToCopy(props.row.ipv4)">
                  <q-tooltip>
                    {{ $t('复制到剪切板') }}
                  </q-tooltip>
                </q-btn>
                <q-btn v-else
                       class="col-shrink q-px-xs q-ma-none invisible" flat dense icon="content_copy" size="xs">
                </q-btn>

              </div>
            </div>
          </q-td>
          <q-td key="dataCenterName" :props="props">
            {{
              locale === 'zh' ? $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name : $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name_en
            }}
          </q-td>
          <q-td key="serviceType" :props="props">
            {{ $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.service_type }}
          </q-td>
          <q-td key="image" :props="props">
            {{ props.row.image }}
          </q-td>
          <q-td key="cpu" :props="props">
            {{ props.row.vcpus }} {{ locale === 'zh' ? '核' : props.row.vcpus > 1 ? 'cores' : 'core' }}
          </q-td>
          <q-td key="ram" :props="props">
            {{ props.row.ram / 1024 }}GB
          </q-td>
          <q-td key="expiration" :props="props">
            <div v-if="!props.row.expiration_time">
              {{ $t('长期') }}
            </div>
            <div v-else>
              <!--              日期时间格式根据locale值变化-->
              <div>{{ new Date(props.row.expiration_time).toLocaleString(locale) }}</div>
              <div v-if="(new Date(props.row.expiration_time).getTime() - new Date().getTime()) < 0" class="text-red">
                {{ $t('已到期') }}
              </div>
            </div>
          </q-td>
          <q-td key="note" :props="props">
            <div class="row">

              <q-btn v-if="hoverRow === props.row.name"
                     class="col-shrink q-px-xs q-ma-none" flat dense icon="edit" size="xs" color="primary"
                     @click="$store.dispatch('vm/popEditVmNote',props.row.id)">
                <q-tooltip>
                  {{ $t('编辑备注') }}
                </q-tooltip>
              </q-btn>

              <q-btn v-else
                     class="col-shrink q-px-xs q-ma-none invisible" flat dense icon="edit" size="xs"/>

              <div class="col q-ma-none">
                {{ props.row.remarks }}
              </div>

            </div>
          </q-td>
          <q-td key="vnc" :props="props" class="non-selectable">
            <q-btn v-if="props.row.status === 1" unelevated flat padding="none" size="lg" color="primary"
                   icon="computer"
                   @click="$store.dispatch('vm/gotoVNC',props.row.id)">
              <q-tooltip>{{ $t('进入远程控制') }}</q-tooltip>
            </q-btn>
            <q-btn v-else unelevated flat padding="none" size="lg" color="grey-5" icon="computer">
              <q-tooltip>
                {{ $t('请开机以使用远程控制') }}
              </q-tooltip>
            </q-btn>
          </q-td>

          <q-td key="status" :props="props" class="non-selectable">
            <ServerStatus :server="props.row"/>
          </q-td>

          <q-td key="operation" :props="props" class="non-selectable">
            <ServerOperationBtnGroup :server="props.row"/>
          </q-td>

        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--      todo 批量操作-->
      <!--      </template>-->
    </q-table>
    <q-separator/>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import { VmInterface } from 'src/store/vm/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import useCopyToClipboard from 'src/hooks/useCopyToClipboard'

import ServerStatus from 'components/ServerTable/ServerStatus.vue'
import ServerOperationBtnGroup from 'components/ServerTable/ServerOperationBtnGroup.vue'

export default defineComponent({
  name: 'ServerTable',
  components: {
    ServerStatus,
    ServerOperationBtnGroup
  },
  props: {
    vms: {
      type: Array as PropType<VmInterface[]>,
      required: true
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 云主机列表分栏定义
    const columnsZH = [
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
        style: 'max-width: 150px;padding: 15px 5px'
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
    const columnsEN = [
      {
        name: 'ip',
        label: 'IP Address',
        field: 'ip',
        align: 'center',
        style: 'max-width: 150px;padding: 15px 5px'
      },
      {
        name: 'dataCenterName',
        label: 'Service Node',
        field: 'dataCenterName',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'serviceType',
        label: 'Service Type',
        field: 'serviceType',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'image',
        label: 'OS',
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
        label: 'Memory',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'expiration',
        label: 'Expiration Time',
        field: 'expiration',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 5px'
      },
      // { name: 'source', label: '资源来源', field: 'source', sortable: true,align: 'center' },
      {
        name: 'note',
        label: 'Notes',
        field: 'note',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px'
      },
      {
        name: 'vnc',
        label: 'Console',
        field: 'vnc',
        align: 'center',
        style: 'padding: 15px 5px'
      },
      {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'center',
        style: 'width: 120px;padding: 15px 5px'
      },
      {
        name: 'operation',
        label: 'Operations',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 5px'
      }
    ]
    // i18n影响该配置对象取值
    const columns = computed(() => locale.value === 'zh' ? columnsZH : columnsEN)

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

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
      locale,
      columns,
      paginationTable,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerTable {
}
</style>
