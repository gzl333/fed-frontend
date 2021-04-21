<template>
  <div class="Apply">
    <div class="column items-center justify-center">
      <div v-if="!dataCenters">
        <q-inner-loading>
          <q-spinner size="50px" color="primary"/>
        </q-inner-loading>
      </div>

      <div v-else>
        <div class="col title-area">
          <q-btn icon="arrow_back_ios_new" color="primary" flat unelevated dense
                 @click="goBack"/>
          申请新配额
        </div>

        <div class="col">

          <q-stepper
            class="stepper overflow-hidden"
            v-model="step"
            header-nav
            ref="stepper"
            color="primary"
            animated
            flat
          >

            <q-step
              class="overflow-hidden"
              :name="1"
              title="服务节点"
              icon="settings"
              :done="done1"
            >

              <div class="column">
                <div class="col section">
                  <div class="text-h7 text-primary section-title">
                    服务节点
                  </div>

                  <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row item-row">
                    <div class="col-shrink item-title text-bold">
                      {{ dataCenter.name }}
                    </div>

                    <div class="col">
                      <q-radio
                        v-for="service in dataCenter.globalServices.map((serviceId) => $store.state.vm.tables.globalServiceTable.byId[serviceId])"
                        dense v-model="radioService" :val="service.id" :label="service.name" :key="service.id"
                        class="radio"/>
                    </div>
                  </div>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn @click="() => { done1 = true; step = 2 }" unelevated color="primary" label="继续"/>
              </q-stepper-navigation>

            </q-step>

            <q-step
              class="overflow-hidden"
              :name="2"
              title="配额参数"
              icon="create_new_folder"
              :done="done2"
            >
              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  配额参数
                </div>

                <div class="row q-py-md">
                  <div class="col-1">
                    资源有效期
                  </div>
                  <div class="col-8">
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
                </div>

                <div class="row q-py-md">
                  <div class="col-1">
                    CPU
                  </div>
                  <div class="col-8">
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

                <div class="row q-py-md">
                  <div class="col-1">
                    内存
                  </div>
                  <div class="col-8">
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

                <div class="row q-py-md">
                  <div class="col-1">
                    私网IP
                  </div>
                  <div class="col-8">
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

                <div class="row q-py-md">
                  <div class="col-1">
                    公网IP
                  </div>
                  <div class="col-8">
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

                <div class="row q-py-md">
                  <div class="col-1">
                    云硬盘
                  </div>
                  <div class="col-8">
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
              <q-stepper-navigation>
                <q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="继续" unelevated/>
                <q-btn flat @click="step = 1" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>

            <q-step
              class="overflow-hidden"
              :name="3"
              title="确认提交"
              icon="add_comment"
              :done="done3"
            >

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  所选配额
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    服务中心
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[radioService]?.data_center]?.name
                    }} - {{ $store.state.vm.tables.globalServiceTable.byId[radioService].name }}
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    资源有效期
                  </div>
                  <div class="col item-radios">
                    {{ sliderDuration }}天
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    CPU
                  </div>
                  <div class="col item-radios">
                    {{ sliderCpu }}核
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    内存
                  </div>
                  <div class="col item-radios">
                    {{ sliderRam / 1024 }}GB
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    私网IP
                  </div>
                  <div class="col item-radios">
                    {{ sliderPrivate }}个
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    公网IP
                  </div>
                  <div class="col item-radios">
                    {{ sliderPublic }}个
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    云硬盘
                  </div>
                  <div class="col item-radios">
                    {{ sliderDisk }}GB
                  </div>
                </div>

              </div>

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  备注
                </div>

                <div class="row item-row">
                  <div class="col-1">配额用途</div>
                  <div class="col-8">
                    <q-input class="input-remarks" v-model="inputPurpose" maxlength="30" dense counter/>
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-1">工作单位</div>
                  <div class="col-8">
                    <q-input class="input-remarks" v-model="inputUnit" maxlength="20" dense counter/>
                  </div>
                </div>

              </div>

              <q-stepper-navigation>
                <q-btn color="primary" @click="applyQuota" label="提交配额申请" unelevated :loading="isCreating"/>
                <q-btn flat @click="step = 2" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Apply',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()

    // radio选项数据
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    // radio状态
    const radioService = ref(computed(() => $store.state.vm.tables.globalServiceTable.allIds[0]))
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

    // stepper
    const step = ref(1)
    const done1 = ref(false)
    const done2 = ref(false)
    const done3 = ref(false)
    const reset = () => {
      done1.value = false
      done2.value = false
      done3.value = false
      step.value = 1
    }

    // 按钮状态
    const isCreating = ref(false)

    const applyQuota = async () => {
      // 如果没有选择ip地址，则弹出通知
      if (!sliderPublic.value && !sliderPrivate.value) {
        $q.notify({
          color: 'red',
          message: '请至少选择1个IP地址',
          position: 'center',
          closeBtn: false,
          timeout: 3000
        })
      } else {
        isCreating.value = true
        done3.value = true
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
        void $router.push('/my/quota/application')
      }
    }

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }
    return {
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
      step,
      done1,
      done2,
      done3,
      reset,
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
  width: 1339px;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.stepper {
  width: 1319px;
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
