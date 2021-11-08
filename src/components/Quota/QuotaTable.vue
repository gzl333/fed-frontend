<template>
  <div class="QuotaTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="quotas"
      :columns="columns"
      row-key="name"
      :loading="isGroup ? !$store.state.server.tables.groupQuotaTable.isLoaded : !$store.state.server.tables.personalQuotaTable.isLoaded"
      color="primary"
      loading-label="网络请求中，请稍候..."
      no-data-label="暂无配额"
      hide-pagination
      :pagination="{rowsPerPage: 0}"
      :filter="search"
      :filter-method="searchMethod"
      no-results-label="无搜索结果"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td v-if="isGroup && !isHideGroup" key="group" :props="props">
            <q-btn
              class="q-ma-none"
              color="primary"
              padding="xs" flat dense unelevated
              :label="$store.state.account.tables.groupTable.byId[props.row.vo_id].name"
              :to="{path: `/my/group/detail/${props.row.vo_id}`}">
              <q-tooltip>
                {{ $t('项目组详情') }}
              </q-tooltip>
            </q-btn>
          </q-td>

          <q-td key="service" :props="props">
            <div>
              {{
                $i18n.locale === 'zh' ? $store.state.fed.tables.serviceTable.byId[props.row.service]?.name : $store.state.fed.tables.serviceTable.byId[props.row.service]?.name_en
              }}
            </div>
            <div>
              {{
                $i18n.locale === 'zh' ? $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name :
                  $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[props.row.service]?.data_center]?.name_en
              }}
            </div>

            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('ev')"
                name="img:svg/EVCloud-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                <q-tooltip>{{$t('该节点的服务类型为EVCloud')}}</q-tooltip>-->
            </div>

            <div>
              <q-icon
                v-if="$store.state.fed.tables.serviceTable.byId[props.row.service]?.service_type.toLowerCase().includes('open')"
                name="img:svg/OpenStack-Logo-Horizontal.svg"
                style="width: 100px;height: 20px"/>
              <!--                <q-tooltip>{{$t('该节点的服务类型为OpenStack')}}</q-tooltip>-->
            </div>

            <!--            <q-tooltip class="bg-grey-4" :offset="[0, -35]">-->
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

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="cpu" :props="props">
            <div v-if="props.row.vcpu_total === 0">无</div>
            <!--            todo 抽象为单独组件-->
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.vcpu_total && (1 - props.row.vcpu_used/ props.row.vcpu_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.vcpu_used/ props.row.vcpu_total)>=.4 ? 'light-green' : (1 - props.row.vcpu_used/ props.row.vcpu_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.vcpu_total===props.row.vcpu_used" class="text-grey">
                {{ props.row.vcpu_total }}核用尽
              </div>
              <div v-else>{{ props.row.vcpu_total - props.row.vcpu_used }}/{{ props.row.vcpu_total }}核</div>
            </q-circular-progress>
          </q-td>
          <q-td key="ram" :props="props">
            <div v-if="props.row.ram_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value="props.row.ram_total && (1 - props.row.ram_used/ props.row.ram_total) * 100"
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.ram_used/ props.row.ram_total)>=.4 ? 'light-green' : (1 - props.row.ram_used/ props.row.ram_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.ram_total===props.row.ram_used" class="text-grey">
                {{ props.row.ram_total / 1024 }}GB用尽
              </div>
              <div v-else>
                {{ (props.row.ram_total - props.row.ram_used) / 1024 }}/{{ props.row.ram_total / 1024 }}GB
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="private_ip" :props="props">
            <div v-if="props.row.private_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.private_ip_total && (1 - props.row.private_ip_used/ props.row.private_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.private_ip_used/ props.row.private_ip_total)>=.4 ? 'light-green' : (1 - props.row.private_ip_used/ props.row.private_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.private_ip_total===props.row.private_ip_used" class="text-grey">
                {{ props.row.private_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.private_ip_total - props.row.private_ip_used }}/{{
                  props.row.private_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>
          <q-td key="public_ip" :props="props">
            <div v-if="props.row.public_ip_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.public_ip_total && (1 - props.row.public_ip_used/ props.row.public_ip_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.public_ip_used/ props.row.public_ip_total)>=.4 ? 'light-green' : (1 - props.row.public_ip_used/ props.row.public_ip_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.public_ip_total===props.row.public_ip_used" class="text-grey">
                {{ props.row.public_ip_total }}个用尽
              </div>
              <div v-else>{{ props.row.public_ip_total - props.row.public_ip_used }}/{{
                  props.row.public_ip_total
                }}个
              </div>
            </q-circular-progress>
          </q-td>

          <q-td key="disk" :props="props">
            <div v-if="props.row.disk_size_total === 0">无</div>
            <q-circular-progress v-else
                                 show-value
                                 font-size="12px"
                                 :value=" props.row.disk_size_total && (1 - props.row.disk_size_used/ props.row.disk_size_total) * 100 "
                                 size="80px"
                                 :thickness="0.22"
                                 :color="(1 - props.row.disk_size_used/ props.row.disk_size_total)>=.4 ? 'light-green' : (1 - props.row.disk_size_used/ props.row.disk_size_total)>=.2 ? 'orange' : 'red' "
                                 track-color="grey-3"
                                 class="q-ma-sm"
            >
              <div v-if="props.row.disk_size_total===props.row.disk_size_used" class="text-grey">
                {{ props.row.disk_size_total }}GB用尽
              </div>
              <div v-else>{{ props.row.disk_size_total - props.row.disk_size_used }}/{{
                  props.row.disk_size_total
                }}GB
              </div>
            </q-circular-progress>
          </q-td>

          <q-td key="expiration_time" :props="props">
            <div v-if="!props.row.expiration_time">长期有效</div>
            <div v-else :class="props.row.expired?'text-grey':'text-black'">
              <div v-if="$i18n.locale==='zh'">
                <div>{{ new Date(props.row.expiration_time).toLocaleString($i18n.locale).split(' ')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString($i18n.locale).split(' ')[1] }}</div>
              </div>
              <div v-else>
                <div>{{ new Date(props.row.expiration_time).toLocaleString($i18n.locale).split(',')[0] }}</div>
                <div>{{ new Date(props.row.expiration_time).toLocaleString($i18n.locale).split(',')[1] }}</div>
              </div>
            </div>
            <div v-if="props.row.expired" class="text-grey">
              已过期
            </div>
          </q-td>

          <q-td key="server" :props="props">
            <q-btn color="primary" flat padding="none" dense
                   :to="{path: isGroup ? `/my/group/quota/detail/${props.row.id}` : `/my/personal/quota/detail/${props.row.id}`}">
              {{ props.row.servers.length }}台
            </q-btn>
          </q-td>

          <q-td key="status" :props="props">
            <div v-if="!props.row.expired && !props.row.exhausted"
                 class="column justify-center items-center text-light-green">
              <q-icon name="check_circle_outline" size="sm"/>
              <div>可用</div>
            </div>
            <div v-else class="column justify-center items-center text-red">
              <q-icon name="highlight_off" size="sm"/>
              <div>不可用</div>
            </div>
          </q-td>

          <q-td key="operation" :props="props">
            <div class="column justify-center items-start q-gutter-xs">

              <q-btn icon="add_circle" flat dense padding="none" color="primary"
                     :disable="props.row.expired || props.row.exhausted"
                     :to="{path: isGroup ? `/my/group/server/deploy` : `/my/personal/server/deploy`, query:{quota:props.row.id}}">
                {{ $t('新建云主机') }}
                <q-tooltip>使用该配额新建云主机</q-tooltip>
              </q-btn>

              <q-btn icon="info" flat dense padding="none" color="primary"
                     :to="{path: isGroup ? `/my/group/quota/detail/${props.row.id}` : `/my/personal/quota/detail/${props.row.id}`}">
                {{ $t('配额详情') }}
                <q-tooltip>查看配额详情</q-tooltip>
              </q-btn>

              <q-btn icon="delete" flat dense padding="none" color="primary"
                     @click="$store.dispatch('server/triggerDeleteQuotaDialog', {quotaId: props.row.id, isGroup, isJump: false})">
                {{ $t('删除配额') }}
                <q-tooltip>删除该配额</q-tooltip>
              </q-btn>

            </div>
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
import { QuotaInterface } from 'src/store/server/state'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaTable',
  components: {},
  props: {
    quotas: {
      type: Array as PropType<QuotaInterface[]>,
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
    // const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // quota列表分栏定义
    const columns = computed(() => [
      ...((props.isGroup && !props.isHideGroup) ? [{ // 是group且不hide时加入这个配置
        name: 'group',
        label: locale.value === 'zh' ? '所属组' : 'Group',
        field: 'group',
        align: 'center',
        style: 'padding: 15px 0px; max-width: 110px;white-space: normal;',
        headerStyle: 'padding: 0 1px'
      }] : []),
      {
        name: 'service',
        label: locale.value === 'zh' ? '所属服务节点' : 'Service Node',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'duration_days',
        label: locale.value === 'zh' ? '云主机时长' : 'Available Time',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'cpu',
        label: locale.value === 'zh' ? 'CPU' : 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'ram',
        label: locale.value === 'zh' ? '内存' : 'Memory',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'private_ip',
        label: locale.value === 'zh' ? '私网IP' : 'Private IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'public_ip',
        label: locale.value === 'zh' ? '公网IP' : 'Public IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'disk',
        label: locale.value === 'zh' ? '云硬盘' : 'Disk',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'expiration_time',
        label: locale.value === 'zh' ? '配额过期时间' : 'Expiration Time',
        field: 'expiration_time',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'server',
        label: locale.value === 'zh' ? '已建云主机' : 'Created Server',
        field: 'server',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'status',
        label: locale.value === 'zh' ? '配额状态' : 'Status',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      },
      {
        name: 'operation',
        label: locale.value === 'zh' ? '操作' : 'Operations',
        field: 'operation',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 1px'
      }
    ])

    // table row hover
    const hoverRow = ref('')
    const onMouseEnterRow = (rowName: string) => {
      hoverRow.value = rowName
    }
    const onMouseLeaveRow = () => {
      hoverRow.value = ''
    }

    // 搜索方法，可扩展成更模糊的
    const searchMethod = (rows: QuotaInterface[], terms: string): QuotaInterface[] => rows.filter(quota => quota.id.toLowerCase().includes(terms) || quota.duration_days.toString().includes(terms) || quota.private_ip_total.toString().includes(terms) || quota.public_ip_total.toString().includes(terms) || quota.vcpu_total.toString().includes(terms) || (quota.ram_total / 1024).toString().includes(terms) || quota.disk_size_total.toString().includes(terms))

    return {
      columns,
      hoverRow,
      onMouseEnterRow,
      onMouseLeaveRow,
      searchMethod
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaTable {
}
</style>
