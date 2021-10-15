<template>
  <div class="QuotaApplyCard">

    <div v-if="!dataCenters">
      <q-inner-loading>
        <q-spinner size="50px" color="primary"/>
      </q-inner-loading>
    </div>

    <div v-else>

      <div v-if="isGroup" class="section">
        <div class="text-h7 text-primary section-title">
          {{ $t('项目组') }}
        </div>
        <div class="row items-center q-gutter-md q-pb-lg">
          <div class="col-auto ">
            {{ $t('使用该配额的项目组') }}
          </div>
          <q-select v-if="groups.length !== 0" class="col-4" outlined v-model="radioGroup" dense
                    :options="groups" map-options emit-value option-label="name" option-value="id"/>
          <div v-else>
            <div class="row items-center">
              暂无项目组，请
              <q-btn v-if="isGroup" flat padding="none" color="primary"
                     :to="'/my/group/create'">
                {{ $t('创建项目组') }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>

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

      <div class="section">
        <div class="text-h7 text-primary section-title">
          备注
        </div>

        <div class="row item-row items-center">
          <div class="col-1 q-pb-md">配额用途</div>
          <q-input ref="input" class="col-6 input-remarks" v-model="inputPurpose" maxlength="50" outlined dense
                   counter/>
        </div>

        <!--        <div class="row item-row items-center">-->
        <!--          <div class="col-1">工作单位</div>-->
        <!--          <div class="col-6">-->
        <!--            <q-input class="input-remarks" v-model="inputUnit" maxlength="50" dense counter/>-->
        <!--          </div>-->
        <!--        </div>-->

      </div>

      <div class="summarize-section">
        <div class="text-h7 text-primary section-title">
          所选参数
        </div>

        <div v-if="isGroup" class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            项目组
          </div>
          <div class="col item-radios">
            <div v-if="radioGroup !== ''">
              {{ $store.state.account.tables.groupTable.byId[radioGroup]?.name }}
            </div>
            <div v-else class="text-red">请选择项目组</div>
          </div>
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
            <div v-if="inputPurpose !== ''"> {{ inputPurpose }}</div>
            <div v-else class="text-red">请填写备注</div>
          </div>
        </div>

        <!--        <div class="row item-row">-->
        <!--          <div class="col-shrink item-title-narrow text-grey">-->
        <!--            工作单位-->
        <!--          </div>-->
        <!--          <div class="col item-radios">-->
        <!--            {{ inputUnit }}-->
        <!--          </div>-->
        <!--        </div>-->

      </div>

      <q-btn color="primary q-mb-xl" @click="applyQuota" label="提交配额申请" unelevated :loading="isCreating"/>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'QuotaApplyCard',
  components: {},
  props: {
    isGroup: {
      type: Boolean,
      required: true
    },
    serviceId: {
      type: String,
      required: false
    },
    groupId: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // dom元素
    const select = ref<HTMLElement>()
    const input = ref<HTMLElement>()

    // radio选项数据
    const dataCenters = computed(() => Object.values($store.state.fed.tables.dataCenterTable.byId))
    // owner/leader权限才能申请配额
    const groups = computed(() => $store.getters['account/getGroupsByMyRole'](['owner', 'leader']))

    /* 传参说明：
*  1. 都不传: 全部默认选择第一项
*  2. 传service/group: 默认选择指定service/group
*  以下4步缺一不可
*/
    // radio 初始状态 (1)
    const radioService = ref('')
    const radioGroup = ref('')
    // radio的默认选择 (2)
    const chooseRadioService = () => {
      if (props.serviceId) {
        radioService.value = props.serviceId
      } else {
        // if ($store.state.fed.tables.serviceTable.isLoaded) {
        radioService.value = $store.state.fed.tables.serviceTable.allIds[0]
        // }
      }
    }
    const chooseRadioGroup = () => {
      if (props.groupId) {
        radioGroup.value = props.groupId
      } else {
        radioGroup.value = groups.value[0]?.id || ''
      }
    }
    // setup时调用一次 (3) 没有传参时要选一次默认值
    chooseRadioService()
    chooseRadioGroup()
    // watch根据table的变化情况，再调用 (4)
    watch($store.state.fed.tables.serviceTable, chooseRadioService)
    watch($store.state.account.tables.groupTable, chooseRadioGroup)

    // slider状态
    const sliderDuration = ref(1)
    const sliderCpu = ref(1)
    const sliderRam = ref(1024)
    const sliderPrivate = ref(0)
    const sliderPublic = ref(0)
    const sliderDisk = ref(0)
    // input状态
    const inputPurpose = ref('')
    // const inputUnit = ref('')

    // 按钮状态
    const isCreating = ref(false)

    const applyQuota = async () => {
      // 如果没有选择ip地址，则弹出通知
      if (props.isGroup && !radioGroup.value) {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请选择项目组',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else if (!sliderPublic.value && !sliderPrivate.value) { // 如果没有选择ip地址，则弹出通知
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'mdi-alert',
          textColor: 'negative',
          message: '请至少选择1个私网或公网IP地址',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
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
        input.value?.focus()
      } else {
        isCreating.value = true
        const selection = props.isGroup ? {
          vo_id: radioGroup.value,
          service_id: radioService.value,
          private_ip: sliderPrivate.value,
          public_ip: sliderPublic.value,
          vcpu: sliderCpu.value,
          ram: sliderRam.value,
          disk_size: sliderDisk.value,
          duration_days: sliderDuration.value,
          purpose: inputPurpose.value,
          company: $store.state.account.items.decoded?.orgName,
          contact: $store.state.account.items.decoded?.email
        } : {
          service_id: radioService.value,
          private_ip: sliderPrivate.value,
          public_ip: sliderPublic.value,
          vcpu: sliderCpu.value,
          ram: sliderRam.value,
          disk_size: sliderDisk.value,
          duration_days: sliderDuration.value,
          purpose: inputPurpose.value,
          company: $store.state.account.items.decoded?.orgName,
          contact: $store.state.account.items.decoded?.email
        }
        // 提交quota申请
        await $store.dispatch('server/submitApplyQuota', selection)

        // 改变按钮状态，不管响应结果如何，得到响应之后就恢复按钮状态
        isCreating.value = false
      }
    }

    return {
      select,
      input,
      locale,
      groups,
      dataCenters,
      radioGroup,
      radioService,
      sliderDuration,
      sliderCpu,
      sliderRam,
      sliderPrivate,
      sliderPublic,
      sliderDisk,
      inputPurpose,
      // inputUnit,
      isCreating,
      applyQuota
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaApplyCard {
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
