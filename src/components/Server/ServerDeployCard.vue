<template>
  <div class="ServerDeployCard">

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
          <div class="col-auto">
            {{ $t('云主机所属项目组') }}
          </div>
          <q-select class="col-4" outlined v-model="radioGroup" dense
                    :options="groups" map-options emit-value option-label="name" option-value="id"/>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          服务节点
        </div>
        <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row  item-row">

          <div class="col-auto item-title text-bold">
            {{ dataCenter.name }}
          </div>

          <div class="col item-radios">
            <div class="row items-center q-pb-sm"
                 v-for="service in dataCenter.globalServices.map(id => $store.state.vm.tables.globalServiceTable.byId[id])"
                 :key="service.id">

              <q-radio class="col-auto" dense v-model="radioService" :val="service.id"
                       :label=" locale === 'zh' ? service.name : service.name_en" :key="service.id"/>

            </div>

          </div>

        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          云主机配额
        </div>
        <div v-if="quotas.length > 0" class="row item-row">
          <div class="col item-radios">
            <q-radio v-for="quota in quotas" dense v-model="radioQuota" :val="quota.id"
                     :key="quota.id" class="radio"
                     :disable="quota.expired || quota.exhausted">
              <pre>{{ quota }}</pre>
              <quota-card :quota="quota"/>
            </q-radio>
          </div>
        </div>
        <div v-if="quotas.length === 0" class="row item-row">
          <div class="col-shrink item-title">
            该服务节点暂无可用云主机配额，请选择其它服务节点。 或
            <q-btn label="申请云主机配额" flat
                   padding="none" color="primary"
                   to="/my/personal/quota_apply"/>
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          网络类型
        </div>
        <div v-if="privateNetworks.length > 0" class="row item-row">
          <div class="col-shrink item-title-narrow text-bold">
            私网IP
          </div>
          <div class="col item-radios">
            <q-radio v-for="network in privateNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>
        <div v-if="publicNetworks.length > 0" class="row item-row">
          <div class="col-shrink item-title-narrow text-bold">
            公网IP
          </div>
          <div class="col item-radios">
            <q-radio v-for="network in publicNetworks" dense v-model="radioNetwork" :val="network.id"
                     :label="network.name" :key="network.id" class="radio"/>
          </div>
        </div>
        <div v-if="publicNetworks.length === 0 && privateNetworks.length === 0" class="row item-row">
          <div class="col-shrink item-title">
            该服务节点暂无可用网络类型，请选择其它服务节点
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          系统镜像
        </div>
        <div v-if="images.length > 0" class="row item-row">
          <div class="col item-radios">
            <q-radio v-for="image in images" dense v-model="radioImage" :val="image.id"
                     :label="image.name" :key="image.id" class="radio"/>
          </div>
        </div>
        <div v-else>该服务节点暂无可用镜像，请选择其它服务节点</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          CPU/内存
        </div>
        <div v-if="flavors.length > 0" class="row item-row">
          <div class="col item-radios">
            <q-radio v-for="flavor in flavors" dense v-model="radioFlavor" :val="flavor.id"
                     :label="`${flavor.vcpus}核/${flavor.ram/1024}GB`" :key="flavor.id" class="radio"/>
          </div>
        </div>
        <div v-else>该服务节点暂无可用配置，请选择其它服务节点</div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          备注(可选)
        </div>
        <div class="row item-row">
          <div class="col">
            <q-input class="input-remarks" v-model="inputRemarks" maxlength="30" dense counter></q-input>
          </div>
        </div>
      </div>

      <div class="col section">
        <div class="text-h7 text-primary section-title">
          所选配置
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            服务节点
          </div>
          <div class="col item-radios">
            <div
              v-if="$store.state.vm.tables.globalDataCenterTable.byId[radioDataCenter] && $store.state.vm.tables.userServiceTable.byId[radioService]">
              {{
                `${$store.state.vm.tables.globalDataCenterTable.byId[radioDataCenter].name} - ${$store.state.vm.tables.userServiceTable.byId[radioService].name}`
              }}
            </div>
            <div v-else class="text-red">请选择服务节点</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            云主机配额
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.userQuotaTable.byId[radioQuota]?.display">
              {{ $store.state.vm.tables.userQuotaTable.byId[radioQuota]?.display }}
            </div>
            <div v-else class="text-red">请选择云主机配额</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            网络类型
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.userNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name">
              {{ $store.state.vm.tables.userNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name }}
            </div>
            <div v-else class="text-red">请选择网络类型</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            系统镜像
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.userImageTable.byLocalId[`${radioService}-${radioImage}`]?.name">
              {{ $store.state.vm.tables.userImageTable.byLocalId[`${radioService}-${radioImage}`]?.name }}
            </div>
            <div v-else class="text-red">选择系统镜像</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            CPU/内存
          </div>
          <div class="col item-radios">
            <div v-if="$store.state.vm.tables.globalFlavorTable.byId[radioFlavor]">
              {{
                `${$store.state.vm.tables.globalFlavorTable.byId[radioFlavor].vcpus}核/${$store.state.vm.tables.globalFlavorTable.byId[radioFlavor].ram / 1024}GB`
              }}
            </div>
            <div v-else class="text-red">请选择配置</div>
          </div>
        </div>

        <div class="row item-row">
          <div class="col-shrink item-title-narrow text-grey">
            备注
          </div>
          <div class="col item-radios">
            {{
              inputRemarks
            }}
          </div>
        </div>

      </div>

      <q-btn color="primary" @click="createVM" label="创建云主机" unelevated :loading="isCreating"/>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ServerDeployCard',
  components: {},
  props: {
    isGroup: {
      type: Boolean,
      required: true
    },
    groupId: {
      type: String,
      required: false
    },
    serviceId: {
      type: String,
      required: false
    },
    quotaId: {
      type: String,
      required: false
    }
  },
  setup (props) {
    const $store = useStore<StateInterface>()
    const { locale } = useI18n({ useScope: 'global' })

    // radio选项数据
    // // 全局数据
    // owner/leader权限才能建立云主机， member不能建立
    const groups = computed(() => $store.getters['group/getGroupsByMyRole'](['owner', 'leader']))
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    const flavors = computed(() => Object.values($store.state.vm.tables.globalFlavorTable.byId))
    // radioService的选项数据根据dataCenters动态生成,此处没有
    // //依赖radioService Id选择值的数据
    const publicNetworks = computed(() => $store.getters['vm/getPublicNetworksByServiceId'](radioService.value))
    const privateNetworks = computed(() => $store.getters['vm/getPrivateNetworksByServicedId'](radioService.value))
    const images = computed(() => $store.getters['vm/getImagesByServiceId'](radioService.value))
    const quotas = computed(() => $store.getters['vm/getQuotasByServiceId'](radioService.value, radioGroup.value))

    /* 传参说明：
*
*/
    // radio选项 初始状态 (1)
    const radioGroup = ref('')
    const radioService = ref('')
    const radioDataCenter = computed(() => $store.state.vm.tables.globalServiceTable.byId[radioService.value]?.data_center || '')
    const radioQuota = ref('')
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const inputRemarks = ref('')
    // radio默认选择 (2)
    const chooseRadio = () => {
      if (props.quotaId) {
        radioQuota.value = props.quotaId
        radioGroup.value = $store.state.vm.tables.groupQuotaTable.byId[props.quotaId]?.vo_id as string
        radioService.value = $store.state.vm.tables.groupQuotaTable.byId[props.quotaId]?.service
      } else {
        radioGroup.value = props.groupId || groups.value[0]?.id || ''
        radioService.value = props.serviceId || groups.value[0]?.globalServices[0] || ''
      }
    }
    // setup时调用一次 (3) 没有传参时要选一次默认值
    chooseRadio()
    // watch根据table的变化情况，再调用 (4)
    watch([$store.state.vm.tables.groupQuotaTable, $store.state.vm.tables.groupQuotaTable, $store.state.group.tables.groupTable], chooseRadio)

    /* ServerDeployCard radio初始值传参逻辑
    * quotaId、serviceId、groupId哪个传进来就默认选中
    * 没传的话：
    * 1. groupId默认选第一个
    * 2. serviceId默认选第一个有可用配额的
    * 3. quotaId默认选第一个可用的
    * */

    return {
      $store,
      locale,
      groups,
      dataCenters,
      flavors,
      publicNetworks,
      privateNetworks,
      images,
      quotas,
      radioService,
      radioGroup,
      radioDataCenter,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioQuota,
      inputRemarks
    }
  }
})
</script>

<style lang="scss" scoped>
.ServerDeployCard {
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
