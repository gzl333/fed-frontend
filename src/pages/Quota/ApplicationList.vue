<template>
  <div class="ApplicationList">
    <q-table
      flat
      card-class=""
      table-class="text-nord0"
      table-header-class="bg-grey-2"
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="无结果"
      hide-pagination
      :pagination="paginationTable"
    >

      <template v-slot:top>
        <!--slot外有一层row，需要用col接一下，再新建row-->
        <div class="col">

          <div class="row items-center justify-between q-pa-none">
            <div class="col-3">
              <div class="row justify-start">
                <div class="col">
                  <q-input disable outlined v-model="text" stack-label label="搜索">
                    <template v-slot:append>
                      <!--                      <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer"/>-->
                      <q-icon name="search"/>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <div class="col-2">
              <div class="row justify-end">
                <div class="col">
                  <q-select outlined stack-label label="筛选" v-model="filterSelection"
                            :options="filterOptions"/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td key="status" :props="props">
            <div v-if="props.row.status === 'wait'">待审批</div>
            <div v-if="props.row.status === 'pending'" class="text-primary">审批中</div>
            <div v-if="props.row.status === 'pass'" class="text-green">已通过</div>
            <div v-if="props.row.status === 'reject'" class="text-red">已拒绝</div>
            <div v-if="props.row.status === 'cancel'" class="text-grey">已取消</div>
          </q-td>

          <q-td key="creation_time" :props="props">
            {{ props.row.creation_time }}
          </q-td>

          <q-td key="service" :props="props">
            <div>{{
                $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.userServiceTable.byId[props.row.service]?.data_center]?.name
              }}
            </div>
            <div>{{ $store.state.vm.tables.userServiceTable.byId[props.row.service]?.name }}</div>
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
              <!-- todo-->
              <q-btn label="修改申请" flat dense padding="none" color="primary" @click="showModify(props.row.id)"/>
            </div>
            <div v-if="props.row.status === 'wait'">
              <q-btn label="取消申请" flat dense padding="none" color="primary"
                     @click="$store.dispatch('applyQuota/cancelAndUpdateUserQuotaApplicationTable', props.row.id)"
              />
            </div>
            <div v-if="props.row.status !== 'wait'">
              <q-btn label="删除记录" flat dense padding="none" color="grey-7"
                     @click="$store.dispatch('applyQuota/deleteAndUpdateUserQuotaApplicationTable', props.row.id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
      </template>

    </q-table>

    <q-dialog v-model="isShowModify">
      <q-card class="application-card">
        <q-card-section class="row items-center justify-center q-pb-sm">
          <div class="text-primary">修改申请</div>
          <q-space/>
          <q-btn icon="close" flat dense v-close-popup/>
        </q-card-section>

        <q-separator/>

        <q-card-section>

          <div class="row q-py-md">
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
              <q-input v-model="newApplication.company" maxlength="30" dense counter/>
            </div>
          </div>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="保存修改"
                 @click="$store.dispatch('applyQuota/patchAndUpdateUserQuotaApplicationTable', {apply_id, data: newApplication})"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'ApplicationList',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // todo 进入本页面强制更新userQuotaApplicationTable

    // application filter
    const filterSelection = ref({
      label: '全部状态',
      value: '0'
    })
    $store.commit('applyQuota/storeApplicationListFilter', '0')
    watch(filterSelection, () => {
      $store.commit('applyQuota/storeApplicationListFilter', filterSelection.value.value)
    })
    const filterOptions = [
      {
        label: '全部状态',
        value: '0'
      },
      {
        label: '待审批',
        value: 'wait'
      },
      {
        label: '审批中',
        value: 'pending'
      },
      {
        label: '已通过',
        value: 'pass'
      },
      {
        label: '已拒绝',
        value: 'reject'
      },
      {
        label: '已取消',
        value: 'cancel'
      }
    ]
    // 获取quota列表数据
    const rows = computed(() => $store.getters['applyQuota/getUserApplicationsByFilter'])

    // quota列表分栏定义
    const columns = [
      {
        name: 'status',
        label: '申请状态',
        field: 'status',
        align: 'center'
      },
      {
        name: 'creation_time',
        label: '申请时间',
        field: 'creation_time',
        align: 'center'
      },
      {
        name: 'service',
        label: '服务节点',
        field: 'service',
        align: 'center'
      },
      {
        name: 'duration_days',
        label: '资源有效期',
        field: 'duration_days',
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
        name: 'private_ip',
        label: '私网IP',
        field: 'private_ip',
        align: 'center'
      },
      {
        name: 'public_ip',
        label: '公网IP',
        field: 'public_ip',
        align: 'center'
      },
      {
        name: 'disk',
        label: '云硬盘',
        field: 'disk',
        align: 'center'
      },
      {
        name: 'purpose',
        label: '用途',
        field: 'purpose',
        align: 'center'
      },
      {
        name: 'applicant',
        label: '申请人',
        field: 'applicant',
        align: 'center'
      },
      {
        name: 'operation',
        label: '操作',
        field: 'operation',
        align: 'center'
      }
    ]

    // q-pagination 所需配置对象
    const paginationTable = ref({
      // sortBy: 'desc',
      // descending: false,
      page: 1,
      rowsPerPage: 9999 // 此为能显示的最大行数，取一个较大值
    })

    // dialog modify
    const isShowModify = ref(false)
    // 当前正在修改的application id
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
      $store,
      paginationTable,
      columns,
      rows,
      filterOptions,
      filterSelection,
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
.ApplicationList {
}

.application-card {
  width: 900px;
}
</style>
