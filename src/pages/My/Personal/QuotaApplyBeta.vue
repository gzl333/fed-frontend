<template>
  <div class="QuotaApplyBeta">
    <div class="column q-py-md">

      <div class="col q-pb-md title-area">
        <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
               @click="$router.back"/>
        {{ $t('网络中心内测-申请个人云主机配额') }}
      </div>

      <div class="col">

        <div v-if="!dataCenters">
          <q-inner-loading>
            <q-spinner size="50px" color="primary"/>
          </q-inner-loading>
        </div>

        <div v-else>

          <div class="section">
            <div class="text-h7 text-primary section-title">
              {{ $t('服务节点') }}
            </div>

            <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row item-row">
              <div class="col-shrink item-title text-bold">
                {{ locale === 'zh' ? dataCenter.name : dataCenter.name_en }}
              </div>

              <div class="col">
                <q-radio
                  :disable="service.id !=='1'"
                  v-for="service in dataCenter.services.map(id => $store.state.fed.tables.serviceTable.byId[id])"
                  dense v-model="radioService" :val="service.id"
                  :label=" locale === 'zh' ? service.name : service.name_en" :key="service.id"
                  class="q-pb-sm q-mr-lg"/>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="text-h7 text-primary section-title">
              配额参数
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                云主机时长
              </div>
              <div class="col-6 q-mr-md">
                100天
              </div>

            </div>

            <div class="row  items-center q-py-md">
              <div class="col-1">
                CPU
              </div>
              <div class="col-6">
                8核
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                内存
              </div>
              <div class="col-6">
                16GB
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                私网IP
              </div>
              <div class="col-6">
                无
              </div>
            </div>

            <div class="row items-center q-py-md">
              <div class="col-1">
                公网IP
              </div>
              <div class="col-6">
                1个
              </div>
            </div>

          </div>

          <div class="section">
            <div class="text-h7 text-primary section-title">
              备注
            </div>

            <div class="row item-row items-center">
              <div class="col-1 q-pb-md">部门</div>
              <q-input ref="input1" class="col-6 input-remarks" v-model="inputDepartment" maxlength="25" outlined dense
                       counter/>
            </div>

            <div class="row item-row items-center">
              <div class="col-1 q-pb-md">配额用途</div>
              <q-input ref="input2" class="col-6 input-remarks" v-model="inputPurpose" maxlength="25" outlined dense
                       counter/>
            </div>

          </div>

          <div class="summarize-section">
            <div class="text-h7 text-primary section-title">
              所选参数
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                服务节点
              </div>
              <div class="col item-radios">
                {{
                  $store.state.fed.tables.dataCenterTable.byId[$store.state.fed.tables.serviceTable.byId[radioService]?.data_center]?.name
                }} - {{ $store.state.fed.tables.serviceTable.byId[radioService]?.name }}
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                云主机时长
              </div>
              <div class="col item-radios">
                100天
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                CPU
              </div>
              <div class="col item-radios">
                8核
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                内存
              </div>
              <div class="col item-radios">
                16GB
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                私网IP
              </div>
              <div class="col item-radios">
                无
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                公网IP
              </div>
              <div class="col item-radios">
                1个
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                部门
              </div>
              <div class="col item-radios">
                <div v-if="inputDepartment !== ''"> {{ inputDepartment }}</div>
                <div v-else class="text-red">请填写部门</div>
              </div>
            </div>

            <div class="row item-row">
              <div class="col-shrink item-title-narrow text-grey">
                配额用途
              </div>
              <div class="col item-radios">
                <div v-if="inputPurpose !== ''"> {{ inputPurpose }}</div>
                <div v-else class="text-red">请填写配额用途</div>
              </div>
            </div>

          </div>

          <q-btn color="primary q-mb-xl" @click="applyQuota" label="提交配额申请" unelevated :loading="isCreating"/>

        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'QuotaApplyBeta',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // dom元素
    const input1 = ref<HTMLElement>()
    const input2 = ref<HTMLElement>()

    // radio选项数据
    const dataCenters = computed(() => Object.values($store.state.fed.tables.dataCenterTable.byId))

    const radioService = '1'

    // input状态
    const inputDepartment = ref('')
    const inputPurpose = ref('')
    // 按钮状态
    const isCreating = ref(false)

    const applyQuota = async () => {
      if (!inputDepartment.value) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请填写部门',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        input1.value?.focus()
      } else if (!inputPurpose.value) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请填写备注',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
        input2.value?.focus()
      } else {
        isCreating.value = true
        const selection = {
          service_id: '1',
          private_ip: 0,
          public_ip: 1,
          vcpu: 8,
          ram: 16384,
          disk_size: 0,
          duration_days: 100,
          purpose: '中心内测-' + inputDepartment.value + '-' + inputPurpose.value,
          company: $store.state.account.items.decoded?.orgName,
          contact: $store.state.account.items.decoded?.email
        }
        // 提交quota申请
        await $store.dispatch('server/submitApplyQuota', selection)
        // console.log(selection)
        // 改变按钮状态，不管响应结果如何，得到响应之后就恢复按钮状态
        isCreating.value = false
      }
    }
    return {
      locale,
      input1,
      input2,
      dataCenters,
      radioService,
      inputPurpose,
      inputDepartment,
      isCreating,
      applyQuota
    }
  }
}
)
</script>

<style lang="scss" scoped>
.QuotaApplyBeta {
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

.summarize-section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1.5px solid $primary;
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
