<template>
  <div class="QuotaApplicationTable">

    <q-table
      flat
      card-class=""
      table-class=""
      table-header-class="bg-grey-1 text-grey"
      :rows="applications"
      :columns="columns"
      row-key="name"
      no-data-label="暂无配额申请记录"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="group" :props="props">
            {{ props.row.group }}
          </q-td>

          <q-td key="status" :props="props">
            <div v-if="props.row.status === 'wait'">待审批</div>
            <div v-if="props.row.status === 'pending'" class="text-primary">审批中</div>
            <div v-if="props.row.status === 'pass'" class="text-light-green">已通过</div>
            <div v-if="props.row.status === 'reject'" class="text-red">已拒绝</div>
            <div v-if="props.row.status === 'cancel'" class="text-grey">已取消</div>
          </q-td>

          <q-td key="creation_time" :props="props">
            {{ new Date(props.row.creation_time).toLocaleString() }}
          </q-td>

          <q-td key="service" :props="props">
            <div>{{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.vm.tables.globalServiceTable.byId[props.row.service]?.name }}</div>
          </q-td>

          <q-td key="duration_days" :props="props">
            {{ props.row.duration_days }}天
          </q-td>

          <q-td key="cpu" :props="props">
            {{ props.row.vcpu }}核
          </q-td>

          <q-td key="ram" :props="props">
            {{ props.row.ram / 1024 }}GB
          </q-td>
          <q-td key="private_ip" :props="props">
            {{ props.row.private_ip }}个
          </q-td>
          <q-td key="public_ip" :props="props">
            {{ props.row.public_ip }}个
          </q-td>
          <q-td key="disk" :props="props">
            {{ props.row.disk_size }}GB
          </q-td>
          <q-td key="purpose" :props="props">
            {{ props.row.purpose }}
          </q-td>
          <q-td key="applicant" :props="props">
            <div>{{ props.row.contact }}</div>
            <div>{{ props.row.company }}</div>
          </q-td>
          <q-td key="operation" :props="props">
            <div v-if="props.row.status === 'wait'">
              <q-btn label="修改申请" flat dense padding="none" color="primary" @click="showModify(props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'wait'">
              <q-btn label="取消申请" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/cancelAndUpdateUserQuotaApplicationTable',props.row.id)"/>
            </div>
            <div v-if="props.row.status !== 'wait'">
              <q-btn label="删除记录" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/deleteAndUpdateUserQuotaApplicationTable', props.row.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>

      <!--      <template v-slot:bottom>-->
      <!--todo 批量操作-->
      <!--      </template>-->

    </q-table>

    <q-separator/>

    <q-dialog v-model="isShowModify">
      <q-card class="application-card">
        <q-card-section class="row items-center justify-center q-pb-sm">
          <div class="text-primary">修改申请</div>
          <q-space/>
          <q-btn icon="close" flat dense size="sm" v-close-popup/>
        </q-card-section>

        <q-separator/>

        <q-card-section>

          <div class="row q-py-lg">
            <div class="col-3 text-grey-7">服务节点</div>
            <div class="col">
              {{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[currentApplication.service].data_center].name
              }}
              - {{ $store.state.vm.tables.globalServiceTable.byId[currentApplication.service].name }}
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">资源有效期</div>
            <div class="col">
              <q-slider
                v-model="newApplication.duration_days"
                :min="1"
                :max="365"
                :step="1"
                label
                :label-value="newApplication.duration_days + '天'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">CPU</div>
            <div class="col">
              <q-slider
                v-model="newApplication.vcpu"
                :min="1"
                :max="16"
                :step="1"
                label
                :label-value="newApplication.vcpu + '核'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">内存</div>
            <div class="col">
              <q-slider
                v-model="newApplication.ram"
                :min="1024"
                :max="32768"
                :step="1024"
                label
                :label-value="newApplication.ram/1024 + 'GB'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">私网IP</div>
            <div class="col">
              <q-slider
                v-model="newApplication.private_ip"
                :min="0"
                :max="10"
                :step="1"
                label
                :label-value="newApplication.private_ip + '个'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">公网IP</div>
            <div class="col">
              <q-slider
                v-model="newApplication.public_ip"
                :min="0"
                :max="10"
                :step="1"
                label
                :label-value="newApplication.public_ip + '个'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">云硬盘</div>
            <div class="col">
              <q-slider
                v-model="newApplication.disk_size"
                :min="0"
                :max="1024"
                :step="128"
                label
                :label-value="newApplication.disk_size + 'GB'"
                label-always
                color="primary"
              />
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">配额用途</div>
            <div class="col">
              <q-input v-model="newApplication.purpose" maxlength="30" dense counter/>
            </div>
          </div>

          <div class="row q-pb-md">
            <div class="col-3 text-grey-7">工作单位</div>
            <div class="col">
              <q-input v-model="newApplication.company" maxlength="20" dense counter/>
            </div>
          </div>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn v-close-popup unelevated color="primary" label="放弃"/>
          <q-btn v-close-popup outline color="primary" label="保存"
                 @click="$store.dispatch('applyQuota/patchAndUpdateUserQuotaApplicationTable', {apply_id, data: newApplication})"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, watch } from 'vue'
import { ApplicationQuotaInterface } from 'src/store/applyQuota/state'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplicationTable',
  components: {},
  props: {
    applications: {
      type: Array as PropType<ApplicationQuotaInterface[]>,
      required: true
    },
    isGroup: {
      type: Boolean,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // 应强制更新table,刷新quota状态 todo
    // void $store.dispatch('vm/updateUserQuotaTable')

    // 列表分栏定义
    const columnsZH = props.isGroup ? [
      {
        name: 'group',
        label: '所属组',
        field: 'group',
        align: 'center',
        style: 'padding: 15px 0px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        headerStyle: 'padding: 0 5px'
      }
    ] : [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'duration_days',
        label: '云主机时长',
        field: 'duration_days',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'cpu',
        label: 'CPU',
        field: 'cpu',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'ram',
        label: '内存',
        field: 'ram',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center',
        style: 'padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 200px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center',
        classes: 'ellipsis',
        style: 'max-width: 150px;padding: 15px 5px',
        headerStyle: 'padding: 0 5px'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center',
        headerStyle: 'padding: 0 5px'
      }
    ]
    const columnsEN = columnsZH // todo 翻译

    // i18n影响该配置对象取值
    const columns = computed(() => locale.value === 'zh' ? columnsZH : columnsEN)

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 200 // 此为能显示的最大行数，取一个较大值，实际显示行数靠自动计算
    })

    // dialog modify
    const isShowModify = ref(false)
    // 当前正在修改的application id， 要从tr里传参出来
    const apply_id = ref('0')

    const currentApplication = computed(() => $store.state.applyQuota.tables.userQuotaApplicationTable.byId[apply_id.value])
    const showModify = (id: string) => {
      apply_id.value = id
      isShowModify.value = true
    }
    // radio
    const newApplication = reactive({
      service_id: '',
      duration_days: 0,
      vcpu: 0,
      ram: 0,
      private_ip: 0,
      public_ip: 0,
      disk_size: 0,
      company: '',
      contact: '',
      purpose: ''
    })
    // 当currentApplication从api取到新值时，更新newApplication
    watch(currentApplication, (currentApplication) => {
      Object.assign(newApplication, currentApplication)
      // 以下属性不匹配，单独处理
      newApplication.service_id = currentApplication.service
    })

    return {
      props,
      $store,
      locale,
      columns,
      paginationTable,
      isShowModify,
      showModify,
      apply_id,
      currentApplication,
      newApplication
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaApplicationTable {
}
</style>
