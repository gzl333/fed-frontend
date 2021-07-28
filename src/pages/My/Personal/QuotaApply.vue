<template>
  <div class="Apply">
    <div class="column items-center justify-center q-py-md">
      <div v-if="!dataCenters">
        <q-inner-loading>
          <q-spinner size="50px" color="primary"/>
        </q-inner-loading>
      </div>

      <div v-else>
        <div class="col q-pb-md title-area">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="goBack"/>
          {{ $t('申请个人云主机配额') }}
        </div>

        <div class="col">

          <div class="column">
            <div class="col section">
              <div class="text-h7 text-primary section-title">
                {{ $t('服务节点') }}
              </div>

              <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row item-row">
                <div class="col-shrink item-title text-bold">
                  {{ locale === 'zh' ? dataCenter.name : dataCenter.name_en }}
                </div>

                <div class="col">
                  <q-radio
                    v-for="service in dataCenter.globalServices.map((serviceId) => $store.state.vm.tables.globalServiceTable.byId[serviceId])"
                    dense v-model="radioService" :val="service.id"
                    :label=" locale === 'zh' ? service.name : service.name_en" :key="service.id"
                    class="q-pb-sm q-mr-lg"/>
                </div>
              </div>
            </div>
          </div>

          <div class="col section">
            <div class="text-h7 text-primary section-title">
              配额参数
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                云主机时长
              </div>
              <div class="col-6 q-mr-md">
                <q-slider
                  v-model="sliderDuration"
                  :min="1"
                  :max="365"
                  :step="1"
                  label
                  :label-value="sliderDuration + '天'"
                  label-always
                  color="primary"
                />
              </div>
              <!--              <div class="col-1">-->
              <!--                <q-input-->
              <!--                  v-model.number="sliderDuration"-->
              <!--                  dense-->
              <!--                  square-->
              <!--                  type="number"-->
              <!--                  filled-->
              <!--                >-->
              <!--                  <template v-slot:append>-->
              <!--                    <div class="text-h5">天</div>-->
              <!--                  </template>-->
              <!--                </q-input>-->
              <!--              </div>-->
            </div>

            <div class="row  items-center q-py-md">
              <div class="col-1">
                CPU
              </div>
              <div class="col-6">
                <q-slider
                  v-model="sliderCpu"
                  :min="1"
                  :max="16"
                  :step="1"
                  label
                  :label-value="sliderCpu + '核'"
                  label-always
                  color="primary"
                />
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                内存
              </div>
              <div class="col-6">
                <q-slider
                  v-model="sliderRam"
                  :min="1024"
                  :max="32768"
                  :step="1024"
                  label
                  :label-value="`${sliderRam/1024}GB`"
                  label-always
                  color="primary"
                />
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                私网IP
              </div>
              <div class="col-6">
                <q-slider
                  v-model="sliderPrivate"
                  :min="0"
                  :max="10"
                  :step="1"
                  label
                  :label-value="sliderPrivate + '个'"
                  label-always
                  color="primary"
                />
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                公网IP
              </div>
              <div class="col-6">
                <q-slider
                  v-model="sliderPublic"
                  :min="0"
                  :max="10"
                  :step="1"
                  label
                  :label-value="sliderPublic + '个'"
                  label-always
                  color="primary"
                />
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                云硬盘
              </div>
              <div class="col-6">
                <q-slider
                  v-model="sliderDisk"
                  :min="0"
                  :max="1024"
                  :step="128"
                  label
                  :label-value="sliderDisk + 'GB'"
                  label-always
                  color="primary"
                />
              </div>
            </div>
          </div>

          <div class="col section">
            <div class="text-h7 text-primary section-title">
              备注
            </div>

            <div class="row item-row items-center">
              <div class="col-1">配额用途</div>
              <div class="col-6">
                <q-input class="input-remarks" v-model="inputPurpose" maxlength="50" dense counter/>
              </div>
            </div>

            <div class="row item-row items-center">
              <div class="col-1">工作单位</div>
              <div class="col-6">
                <q-input class="input-remarks" v-model="inputUnit" maxlength="50" dense counter/>
              </div>
            </div>

          </div>

            <div class="col section">
              <div class="text-h7 text-primary section-title">
                所选参数
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  服务节点
                </div>
                <div class="col item-radios">
                  {{
                    $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[radioService]?.data_center]?.name
                  }} - {{ $store.state.vm.tables.globalServiceTable.byId[radioService]?.name }}
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  云主机时长
                </div>
                <div class="col item-radios">
                  {{ sliderDuration }}天
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  CPU
                </div>
                <div class="col item-radios">
                  {{ sliderCpu }}核
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  内存
                </div>
                <div class="col item-radios">
                  {{ sliderRam / 1024 }}GB
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  私网IP
                </div>
                <div class="col item-radios">
                  {{ sliderPrivate }}个
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  公网IP
                </div>
                <div class="col item-radios">
                  {{ sliderPublic }}个
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  云硬盘
                </div>
                <div class="col item-radios">
                  {{ sliderDisk }}GB
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  配额用途
                </div>
                <div class="col item-radios">
                  {{ inputPurpose }}
                </div>
              </div>

              <div class="row item-row">
                <div class="col-shrink item-title-narrow text-grey">
                  工作单位
                </div>
                <div class="col item-radios">
                  {{ inputUnit }}
                </div>
              </div>

            </div>

          <q-btn color="primary" @click="applyQuota" label="提交配额申请" unelevated :loading="isCreating"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Apply',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })
    const $route = useRoute()

    // radio选项数据
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    // radio状态
    const radioService = computed({
      get: () => $store.state.applyQuota.pages.apply.serviceId,
      set: (value) => $store.commit('applyQuota/storeApplyPageServiceId', value)
    })

    // 获取url所传参数.
    /* 传参说明：
    * 1. 都不传: 全部默认选择第一项
    * 2. 传service: 默认选择指定service
    * */
    const serviceDesignated = $route.query.service as string // string or undefined

    // radioService的默认选择
    const chooseRadioService = () => {
      if ($store.state.vm.tables.globalServiceTable.isLoaded) {
        // 如果有指定service,则默认选取指定值，没有则选择第一项
        radioService.value = serviceDesignated || $store.state.vm.tables.globalServiceTable.allIds[0]
      }
    }
    // // setup时调用一次
    chooseRadioService()
    // // watch根据table的变化情况，再调用
    watch($store.state.vm.tables.globalServiceTable, chooseRadioService)

    // slider状态
    const sliderDuration = ref(1)
    const sliderCpu = ref(1)
    const sliderRam = ref(1024)
    const sliderPrivate = ref(0)
    const sliderPublic = ref(0)
    const sliderDisk = ref(0)
    // input状态
    const inputPurpose = ref('')
    const inputUnit = ref('')

    // 按钮状态
    const isCreating = ref(false)

    const applyQuota = async () => {
      // 如果没有选择ip地址，则弹出通知
      if (!sliderPublic.value && !sliderPrivate.value) {
        $q.notify({
          color: 'red',
          message: '请至少选择1个IP地址数量',
          position: 'center',
          closeBtn: false,
          timeout: 3000
        })
      } else {
        isCreating.value = true
        const selection = {
          service_id: radioService.value,
          private_ip: sliderPrivate.value,
          public_ip: sliderPublic.value,
          vcpu: sliderCpu.value,
          ram: sliderRam.value,
          disk_size: sliderDisk.value,
          duration_days: sliderDuration.value,
          company: inputUnit.value,
          purpose: inputPurpose.value,
          contact: $store.state.account.cstEmail
        }
        // 提交quota申请
        const respQuotaApplication = await $store.dispatch('applyQuota/submitQuotaApplication', selection)

        // 根据响应，更新userQuotaApplicationTable
        void await $store.dispatch('applyQuota/updateUserQuotaApplicationTableSingleApplication', respQuotaApplication.data)

        isCreating.value = false
        void $router.push('/my/personal/quota/application')
      }
    }

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }
    return {
      locale,
      dataCenters,
      radioService,
      sliderDuration,
      sliderCpu,
      sliderRam,
      sliderPrivate,
      sliderPublic,
      sliderDisk,
      inputPurpose,
      inputUnit,
      isCreating,
      applyQuota,
      goBack
    }
  }
})
</script>

<style lang="scss" scoped>
.Apply {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.stepper {
  width: $general-width-no-padding;
}

.section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1px solid $grey-4;
  border-radius: 5px;
}

.section-title {
  padding-bottom: 15px;
}

.item-row {
  padding: 5px 0;
}

.item-title {
  text-align: left;
  padding-right: 50px;
  min-width: 250px;
}

.item-title-narrow {
  text-align: left;
  padding-right: 50px;
  min-width: 130px;
}

.radio {
  margin-bottom: 20px;
  padding: 0 10px;
}
</style>
