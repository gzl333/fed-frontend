<template>
  <div class="ApplicationList">

    <div class="row items-center justify-between q-py-md">

      <div class="col-3">
        <div class="row justify-start">
          <div class="col">
            <q-input disable dense outlined v-model="text" stack-label :label="$t('搜索')">
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
            <q-select outlined dense stack-label label="筛选" v-model="filterSelection"
                      :options="filterOptions"/>
          </div>
        </div>
      </div>

    </div>

    <quota-application-table :applications="applications"/>

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
import { computed, defineComponent, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import QuotaApplicationTable from 'components/QuotaTable/QuotaApplicationTable.vue'

export default defineComponent({
  name: 'ApplicationList',
  components: {
    QuotaApplicationTable
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    // 进入本页面强制更新userQuotaApplicationTable
    void $store.dispatch('applyQuota/updateUserQuotaApplicationTable')

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
    const applications = computed(() => $store.getters['applyQuota/getUserApplicationsByFilter'](filterSelection.value.value))

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
      $store,
      applications,
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
