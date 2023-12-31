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
      :loading="isGroup ? !$store.state.server.tables.groupServerTable.isLoaded : !$store.state.server.tables.personalServerTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无云主机"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
      :filter="search"
      :filter-method="searchMethod"
      no-results-label="无搜索结果"
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

          <q-td v-if="isGroup && !isHideGroup" key="group" :props="props">
            <q-btn
              class="q-ma-none"
              color="primary"
              padding="none" flat dense unelevated
              :label="$store.state.account.tables.groupTable.byId[props.row.vo_id]?.name"
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $t('项目组详情') }}
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
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"
                name="img:svg/EVCloud-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                            <q-tooltip>{{$t('该节点的服务类型为EVCloud')}}</q-tooltip>-->
            </div>

            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                name="img:svg/OpenStack-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                            <q-tooltip>{{$t('该节点的服务类型为OpenStack')}}</q-tooltip>-->
            </div>

            <!--            <q-tooltip class="bg-grey-4" :offset="[0, -15]">-->
            <!--              <span class="text-black">-->
            <!--                {{ $t('该节点的服务类型为') }}-->
            <!--              </span>-->
            <!--              <q-icon-->
            <!--                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"-->
            <!--                name="img:svg/EVCloud-Logo-Horizontal.svg"-->
            <!--                style="width: 100px;height: 20px"/>-->
            <!--              <q-icon-->
            <!--                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"-->
            <!--                name="img:svg/OpenStack-Logo-Horizontal.svg"-->
            <!--                style="width: 100px;height: 20px"/>-->
            <!--            </q-tooltip>-->
          </q-td>

          <q-td key="image" :props="props">

            <div>
              <q-icon v-if="getOsIconName(props.row.image)" :name="getOsIconName(props.row.image)" flat size="md"
                      color="primary"/>
            </div>

            {{ props.row.image }}
            <q-tooltip :offset="[0, -15]">
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

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn fab icon="keyboard_arrow_up" color="primary"/>
    </q-page-scroller>

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
    },
    search: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 分栏定义
    const columns = computed(() => [
      {
        name: 'ip',
        label: locale.value === 'zh' ? 'IP地址' : 'IP Address',
        field: 'ip',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 0 0 1px',
        style: 'width: 100px;padding: 15px 0px'
      },
      ...((props.isGroup && !props.isHideGroup) ? [{ // 是group且不hide时加入这个配置
        name: 'group',
        label: locale.value === 'zh' ? '所属组' : 'Group',
        field: 'group',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 0 0 1px',
        style: 'padding: 15px 0px;max-width: 120px;white-space: normal;'
      }] : []),
      {
        name: 'serviceNode',
        label: locale.value === 'zh' ? '服务节点' : 'Service Node',
        field: 'serviceNode',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 2px'
      },
      {
        name: 'image',
        label: locale.value === 'zh' ? '操作系统' : 'OS',
        field: 'image',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 0 0 1px',
        style: 'max-width: 100px;padding: 15px 0px'
      },
      {
        name: 'configuration',
        label: locale.value === 'zh' ? '配置' : 'Configuration',
        field: 'configuration',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 2px'
      },
      {
        name: 'expiration',
        label: locale.value === 'zh' ? '到期时间' : 'Expiration Time',
        field: 'expiration',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 2px'
      },
      {
        name: 'note',
        label: locale.value === 'zh' ? '备注' : 'Note',
        field: 'note',
        align: 'center',
        classes: 'ellipsis',
        headerStyle: 'padding: 0 0 0 1px',
        style: 'max-width: 100px;padding: 15px 0px;white-space: normal;'
      },
      {
        name: 'vnc',
        label: locale.value === 'zh' ? '远程控制' : 'Console',
        field: 'vnc',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 2px'
      },
      {
        name: 'status',
        label: locale.value === 'zh' ? '状态' : 'Status',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 0px; width: 100px', // 固定宽度防止更新状态时抖动
        headerStyle: 'padding: 0 2px'
      },
      {
        name: 'operation',
        label: locale.value === 'zh' ? '操作' : 'Operations',
        field: 'operation',
        align: 'center',
        classes: 'ellipsis',
        style: 'padding: 15px 0px;width: 150px;',
        headerStyle: 'padding: 0 2px'
      }])

    // 当前用户在group内的角色
    const myRole = computed(() => $store.state.account.tables.groupTable.byId[props.servers[0]?.vo_id || '']?.myRole)

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

    // 搜索方法，可扩展成更模糊的
    const searchMethod = (rows: ServerInterface[], terms: string): ServerInterface[] => rows.filter(server => server.id.toLowerCase().includes(terms) || server.ipv4.toLowerCase().includes(terms) || server.image.toLowerCase().includes(terms) || server.remarks.toLowerCase().includes(terms))

    return {
      locale,
      columns,
      myRole,
      clickToCopy,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow,
      getOsIconName,
      searchMethod
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerTable {
}
</style>
