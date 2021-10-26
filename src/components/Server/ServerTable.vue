<template>
  <div class="ServerTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="servers"
      :columns="columns"
      row-key="name"
      :no-data-label="$t('暂无可用云主机，请创建后使用')"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props"
              @mouseenter="onMouseEnterRow(props.row.name)"
              @mouseleave="onMouseLeaveRow"
        >

          <q-td key="ip" :props="props">
            <q-btn
              class="q-ma-none" :label="props.row.ipv4" color="primary" padding="none" flat dense unelevated no-caps
              :to="{path: isGroup ? `/my/group/server/detail/${props.row.id}` : `/my/personal/server/detail/${props.row.id}`}">
              <q-tooltip>
                {{ $t('云主机详情') }}
              </q-tooltip>
              <!--创建时间距离当下小于1小时则打上new标记-->
              <q-badge style="top:-10px;"
                       v-if="(new Date() - new Date(props.row.creation_time)) < 1000 * 60 * 60 * 1 "
                       color="light-green" floating transparent rounded align="middle">
                new
              </q-badge>
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
          </q-td>

          <q-td key="group" :props="props">
            <q-btn
              class="q-ma-none" :label="$store.state.account.tables.groupTable.byId[props.row.vo_id]?.name"
              color="primary"
              padding="none" flat dense unelevated
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $store.state.account.tables.groupTable.byId[props.row.vo_id]?.name }} {{ $t('项目组详情') }}
              </q-tooltip>
            </q-btn>
          </q-td>

          <q-td key="serviceNode" :props="props">
            <div>
              {{
                locale === 'zh' ? $store.state.fed.tables.serviceTable.byId[props.row.service]?.name : $store.state.fed.tables.serviceTable.byId[props.row.service]?.name_en
              }}
            </div>
            <div>
              {{
                locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name :
                  $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name_en
              }}
            </div>
            <div>
              <div>
                <q-icon
                  v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"
                  name="img:svg/EVCloud-Logo-Horizontal.svg"
                  style="width: 100px;height: 20px"/>
                <q-tooltip>{{$t('该节点的服务类型为EVCloud')}}</q-tooltip>
              </div>

              <div>
                <q-icon
                  v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                  name="img:svg/OpenStack-Logo-Horizontal.svg"
                  style="width: 100px;height: 20px"/>
                <q-tooltip>{{$t('该节点的服务类型为OpenStack')}}</q-tooltip>
              </div>
            </div>
          </q-td>

<!--          <q-td key="serviceType" :props="props">-->

<!--            <q-icon v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"-->
<!--                    name="img:svg/EVCloud-Logo-Vertical.svg"-->
<!--                    style="width: 80px;height: 40px"/>-->

<!--            <q-icon v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"-->
<!--                    name="img:svg/OpenStack-Logo-Vertical.svg"-->
<!--                    style="width: 80px;height: 40px"/>-->

<!--          </q-td>-->

          <q-td key="image" :props="props">

            <div>
              <q-icon v-if="getOsIconName(props.row.image)" :name="getOsIconName(props.row.image)" flat size="md" color="primary"/>
            </div>

            {{ props.row.image }}
            <q-tooltip>
              {{ props.row.image }}
<!--              {{ props.row.image_desc}}-->
            </q-tooltip>
          </q-td>

          <q-td key="configuration" :props="props">
            <div> {{ props.row.vcpus }} {{ locale === 'zh' ? '核' : props.row.vcpus > 1 ? 'cores' : 'core' }}</div>
            <div>{{ props.row.ram / 1024 }}GB</div>
          </q-td>

          <q-td key="expiration" :props="props">
            <div v-if="!props.row.expiration_time">
              {{ $t('长期') }}
            </div>
            <div v-else>
              <!--              日期时间格式根据locale值变化-->
              <div v-if="locale==='zh'">
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(' ')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(' ')[1] }}</div>
              </div>

              <div v-else>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(',')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString(locale).split(',')[1] }}</div>
              </div>

<!--              <q-icon v-if="(new Date(props.row.expiration_time).getTime() - new Date().getTime()) < 0"-->
<!--                      name="help_outline" color="red" size="xs">-->
<!--                <q-tooltip>{{ $t('云主机已到期') }}</q-tooltip>-->
<!--              </q-icon>-->
            </div>
          </q-td>

          <q-td key="creator" :props="props">
            {{ props.row.user.username }}
          </q-td>

          <q-td key="note" :props="props">
            <div class="row">
              <div class="col q-ma-none q-pa-none">
                {{ props.row.remarks }}
                <q-tooltip>
                  {{ props.row.remarks }}
                </q-tooltip>
              </div>

              <q-btn
                :disable="props.row.lock === 'lock-operation'"
                v-if="hoverRow === props.row.name && (!isGroup || (isGroup && $store.state.account.tables.groupTable.byId[props.row?.vo_id]?.myRole !== 'member')) "
                class="col-shrink q-px-none q-ma-none" flat dense icon="edit" size="xs" color="primary"
                @click="$store.dispatch('server/editServerNoteDialog',{serverId:props.row.id, isGroup})">
                <q-tooltip>
                  {{ $t('编辑备注') }}
                </q-tooltip>
              </q-btn>

              <q-btn v-else
                     class="col-shrink q-px-none q-ma-none invisible" flat dense icon="edit" size="xs"/>

            </div>
          </q-td>
          <q-td key="vnc" :props="props" class="non-selectable q-pa-none">
            <q-btn v-if="props.row.status === 1" unelevated flat padding="none" size="lg" color="primary"
                   icon="computer"
                   @click="$store.dispatch('server/gotoVNC',props.row.id)">
              <q-tooltip>{{ $t('进入远程控制') }}</q-tooltip>
            </q-btn>
            <q-btn v-else unelevated flat padding="none" size="lg" color="grey-5" icon="computer">
              <q-tooltip>
                {{ $t('请开机以使用远程控制') }}
              </q-tooltip>
            </q-btn>
          </q-td>

          <q-td key="status" :props="props" class="non-selectable">
            <ServerStatus :server="props.row" :is-group="isGroup"/>
          </q-td>

          <q-td key="operation" :props="props" class="non-selectable">
            <ServerOperationBtnGroup :server="props.row" :is-group="isGroup"/>
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
import { ServerInterface } from 'src/store/server/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

import useCopyToClipboard from 'src/hooks/useCopyToClipboard'
import useGetOsIconName from 'src/hooks/useGetOsIconName'

import ServerStatus from 'components/Server/ServerStatus.vue'
import ServerOperationBtnGroup from 'components/Server/ServerOperationBtnGroup.vue'

export default defineComponent({
  name: 'ServerTable',
  components: {
    ServerStatus,
    ServerOperationBtnGroup
  },
  props: {
    servers: {
      type: Array as PropType<ServerInterface[]>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    },
    isHideGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 云主机列表分栏定义, 判断使用组配置还是个人配置
    const columnsZH = props.isGroup && !props.isHideGroup // 是group且不hide时使用这个配置
      ? [{
          name: 'ip',
          label: locale.value === 'zh' ? 'IP地址' : 'IP Address',
          field: 'ip',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 150px;padding: 15px 0px'
        },
        {
          name: 'group',
          label: '所属组',
          field: 'group',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 130px;padding: 15px 0px'
        },
        {
          name: 'serviceNode',
          label: '服务节点',
          field: 'serviceNode',
          align: 'center',
          classes: 'ellipsis',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        },
        // {
        //   name: 'serviceType',
        //   label: '服务种类',
        //   field: 'serviceType',
        //   align: 'center',
        //   classes: 'ellipsis',
        //   style: 'padding: 15px 0px',
        //   headerStyle: 'padding: 0 2px'
        // },
        {
          name: 'image',
          label: '操作系统',
          field: 'image',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 100px;padding: 15px 0px'
        },
        {
          name: 'configuration',
          label: '配置',
          field: 'configuration',
          align: 'center',
          classes: 'ellipsis',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        },
        {
          name: 'expiration',
          label: '到期时间',
          field: 'expiration',
          align: 'center',
          classes: 'ellipsis',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        },
        // {
        //   name: 'creator',
        //   label: '创建人',
        //   field: 'creator',
        //   align: 'center',
        //   classes: 'ellipsis',
        //   style: 'padding: 15px 0px',
        //   headerStyle: 'padding: 0 2px'
        // },
        {
          name: 'note',
          label: '备注',
          field: 'note',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 100px;padding: 15px 0px'
        },
        {
          name: 'vnc',
          label: '远程控制',
          field: 'vnc',
          align: 'center',
          classes: 'ellipsis',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status',
          align: 'center',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        },
        {
          name: 'operation',
          label: '操作',
          field: 'operation',
          align: 'center',
          classes: 'ellipsis',
          style: 'padding: 15px 0px',
          headerStyle: 'padding: 0 2px'
        }
        ] : [
          {
            name: 'ip',
            label: 'IP地址',
            field: 'ip',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 150px;padding: 15px 0px'
          },
          {
            name: 'serviceNode',
            label: '服务节点',
            field: 'serviceNode',
            align: 'center',
            classes: 'ellipsis',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 2px'
          },
          // {
          //   name: 'serviceType',
          //   label: '服务种类',
          //   field: 'serviceType',
          //   align: 'center',
          //   classes: 'ellipsis',
          //   style: 'padding: 15px 0px',
          //   headerStyle: 'padding: 0 2px'
          // },
          {
            name: 'image',
            label: '操作系统',
            field: 'image',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 100px;padding: 15px 0px'
          },
          {
            name: 'configuration',
            label: '配置',
            field: 'configuration',
            align: 'center',
            classes: 'ellipsis',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 2px'
          },
          {
            name: 'expiration',
            label: '到期时间',
            field: 'expiration',
            align: 'center',
            classes: 'ellipsis',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 2px'
          },
          // {
          //   name: 'creator',
          //   label: '创建人',
          //   field: 'creator',
          //   align: 'center',
          //   classes: 'ellipsis',
          //   style: 'padding: 15px 0px',
          //   headerStyle: 'padding: 0 2px'
          // },
          {
            name: 'note',
            label: '备注',
            field: 'note',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 100px;padding: 15px 0px'
          },
          {
            name: 'vnc',
            label: '远程控制',
            field: 'vnc',
            align: 'center',
            classes: 'ellipsis',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 0 0 1px'
          },
          {
            name: 'status',
            label: '状态',
            field: 'status',
            align: 'center',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 0 0 1px'
          },
          {
            name: 'operation',
            label: '操作',
            field: 'operation',
            align: 'center',
            classes: 'ellipsis',
            style: 'padding: 15px 0px',
            headerStyle: 'padding: 0 0 0 1px'
          }
        ]
    const columnsEN = props.isGroup && !props.isHideGroup // 是group且不hide时使用这个配置
      ? [{
          name: 'ip',
          label: 'IP Address',
          field: 'ip',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 150px;padding: 15px 0px'
        },
        {
          name: 'group',
          label: 'Group',
          field: 'group',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 130px;padding: 15px 0px'
        },
        {
          name: 'serviceNode',
          label: 'Service Node',
          field: 'serviceNode',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px'
        },
        // {
        //   name: 'serviceType',
        //   label: 'Service Type',
        //   field: 'serviceType',
        //   align: 'center',
        //   classes: 'ellipsis',
        //   headerStyle: 'padding: 0 0 0 1px',
        //   style: 'padding: 15px 0px'
        // },
        {
          name: 'image',
          label: 'OS',
          field: 'image',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 100px;padding: 15px 0px'
        },
        {
          name: 'configuration',
          label: 'Configuration',
          field: 'configuration',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'padding: 15px 0px'
        },
        {
          name: 'expiration',
          label: 'Expiration',
          field: 'expiration',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'padding: 15px 0px'
        },
        // {
        //   name: 'creator',
        //   label: 'Creator',
        //   field: 'creator',
        //   align: 'center',
        //   classes: 'ellipsis',
        //   headerStyle: 'padding: 0 0 0 1px',
        //   style: 'padding: 15px 0px'
        // },
        {
          name: 'note',
          label: 'Note',
          field: 'note',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'max-width: 100px;padding: 15px 0px'
        },
        {
          name: 'vnc',
          label: 'Console',
          field: 'vnc',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'padding: 15px 0px'
        },
        {
          name: 'status',
          label: 'Status',
          field: 'status',
          align: 'center',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'padding: 15px 0px'
        },
        {
          name: 'operation',
          label: 'Operations',
          field: 'operation',
          align: 'center',
          classes: 'ellipsis',
          headerStyle: 'padding: 0 0 0 1px',
          style: 'padding: 15px 0px'
        }
        ] : [
          {
            name: 'ip',
            label: 'IP Address',
            field: 'ip',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 150px;padding: 15px 0px'
          },
          {
            name: 'serviceNode',
            label: 'Service Node',
            field: 'serviceNode',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          },
          // {
          //   name: 'serviceType',
          //   label: 'Service Type',
          //   field: 'serviceType',
          //   align: 'center',
          //   classes: 'ellipsis',
          //   headerStyle: 'padding: 0 0 0 1px',
          //   style: 'max-width: 120px;padding: 15px 0px'
          // },
          {
            name: 'image',
            label: 'OS',
            field: 'image',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 100px;padding: 15px 0px'
          },
          {
            name: 'configuration',
            label: 'Configuration',
            field: 'configuration',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'expiration',
            label: 'Expiration',
            field: 'expiration',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          },
          // {
          //   name: 'creator',
          //   label: 'Creator',
          //   field: 'creator',
          //   align: 'center',
          //   classes: 'ellipsis',
          //   headerStyle: 'padding: 0 0 0 1px',
          //   style: 'padding: 15px 0px'
          // },
          {
            name: 'note',
            label: 'Note',
            field: 'note',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'max-width: 100px;padding: 15px 0px'
          },
          {
            name: 'vnc',
            label: 'Console',
            field: 'vnc',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'status',
            label: 'Status',
            field: 'status',
            align: 'center',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          },
          {
            name: 'operation',
            label: 'Operations',
            field: 'operation',
            align: 'center',
            classes: 'ellipsis',
            headerStyle: 'padding: 0 0 0 1px',
            style: 'padding: 15px 0px'
          }
        ]

    const columns = computed(() => locale.value === 'zh' ? columnsZH : columnsEN)

    // 当前用户在group内的角色
    const myRole = computed(() => $store.state.account.tables.groupTable.byId[props.servers[0]?.vo_id || '']?.myRole)

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // 复制信息到剪切板
    const clickToCopy = useCopyToClipboard()

    // 获取os的icon名称
    const getOsIconName = useGetOsIconName()

    // table row hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }

    return {
      locale,
      columns,
      myRole,
      paginationTable,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow,
      getOsIconName
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerTable {
}
</style>
