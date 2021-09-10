<template>
  <div class="VmCreate">
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
          新建云主机
        </div>

        <div class="col">

<!--          <div class="column">-->

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
                       v-for="service in dataCenter.globalServices.map((serviceId) => $store.state.vm.tables.globalServiceTable.byId[serviceId])"
                       :key="service.id">
                    <q-radio :disable="!dataCenter.userServices.includes(service.id)"
                             dense v-model="radioService" :val="service.id" :label="service.name"
                             class="col-auto"/>
                    <div class="col-auto" v-if="!dataCenter.userServices.includes(service.id)">
                      (
                      <q-btn label="申请云主机配额" flat padding="none" color="primary"
                             :to="{path: '/my/personal/quota_apply', query: {service: service.id}}"/>
                      后可用)
                    </div>
                  </div>

                </div>

              </div>
            </div>

<!--          </div>-->

          <div class="col section">
            <div class="text-h7 text-primary section-title">
              云主机配额
            </div>
            <div v-if="quotas.length > 0" class="row item-row">
              <div class="col item-radios">
                <q-radio v-for="quota in quotas" dense v-model="radioQuota" :val="quota.id"
                         :key="quota.id" class="radio"
                         :disable="quota.expired || quota.exhausted">
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
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { StateInterface } from 'src/store'
import { useQuasar } from 'quasar'
import { QuotaInterface } from 'src/store/vm/state'
import QuotaCard from 'components/Personal/PersonalQuotaCard.vue'

export default defineComponent({
  name: 'VmCreate',
  components: { QuotaCard },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()
    const $route = useRoute()

    // 强制更新全部vmtable
    void $store.dispatch('vm/forceUpdateVmTable')

    // radio选项数据，根据所选择serviceId建立
    // //全局数据
    const dataCenters = computed(() => Object.values($store.state.vm.tables.globalDataCenterTable.byId))
    // //radioService的选项数据根据dataCenters动态生成
    const flavors = computed(() => Object.values($store.state.vm.tables.globalFlavorTable.byId))
    // //依赖radioService Id选择值的数据
    const quotas = computed(() => $store.getters['vm/getQuotasByServiceId'](radioService.value))
    const publicNetworks = computed(() => $store.getters['vm/getPublicNetworksByServiceId'](radioService.value))
    const privateNetworks = computed(() => $store.getters['vm/getPrivateNetworksByServicedId'](radioService.value))
    const images = computed(() => $store.getters['vm/getImagesByServiceId'](radioService.value))

    // radio的选择状态
    const radioService = ref('')
    // //radioDataCenter不对应实体radio按钮，而是根据radioService选择结果自动更新对应的dataCenterId
    const radioDataCenter = computed(() => {
      // console.log($store.state.vm.tables.userServiceTable.byId[radioService.value].data_center === $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.userServiceTable.byId[radioService.value].data_center].id)
      return $store.state.vm.tables.globalServiceTable.byId[radioService.value]?.data_center || ''
    })
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const radioQuota = ref('')
    const inputRemarks = ref('')

    // radioService选择变化时，更新后面所有radio的默认选择。
    watch([radioService, $store.state.vm.tables.userQuotaTable], () => {
      radioNetwork.value = privateNetworks.value.length > 0 ? privateNetworks.value[0]?.id : publicNetworks.value[0]?.id
      radioImage.value = images.value[0]?.id
      radioFlavor.value = flavors.value[0]?.id
      // 选择有余量、没过期的配额里的第一项
      radioQuota.value = quotas.value.filter((quota: QuotaInterface) => !quota.exhausted && !quota.expired)[0]?.id
    })

    // 获取url所传参数.
    /* 传参说明：
    * 1. 都不传: 全部默认选择第一项
    * 2. 只传quota: service根据quota算出，quota选择指定值
    * 3. 只传service：service选择指定值，quota选择第一项
    * 4. 同时传quota和service：则service被忽略
    * */
    let serviceDesignated = computed(() => '')
    let quotaDesignated = ''
    if ($route.query.quota) {
      quotaDesignated = $route.query.quota as string
      serviceDesignated = computed(() => $store.state.vm.tables.userQuotaTable.byId[quotaDesignated]?.service)
    } else {
      if ($route.query.service) {
        serviceDesignated = computed(() => $route.query.service as string)
      }
    }

    // radioService的默认选择
    // // tables已经全部加载时，radioService选择第一项
    const chooseRadioService = () => {
      if (
        $store.state.vm.tables.userServiceTable.isLoaded &&
        $store.state.vm.tables.userNetworkTable.isLoaded &&
        $store.state.vm.tables.userImageTable.isLoaded &&
        $store.state.vm.tables.globalFlavorTable.isLoaded &&
        $store.state.vm.tables.userQuotaTable.isLoaded
      ) {
        // 如果有指定service则默认选取指定值，没有则选择第一项
        radioService.value = serviceDesignated.value ? serviceDesignated.value : $store.state.vm.tables.userServiceTable.allIds[0]
        // 如果有指定的quota则默认选取指定值，没有则不变
        radioQuota.value = quotaDesignated || radioQuota.value
      }
    }

    // // setup时调用一次
    chooseRadioService()
    // // watch根据tables的变化情况，再调用
    watch($store.state.vm.tables, chooseRadioService)

    // 创建云主机按钮状态
    const isCreating = ref(false)
    // 创建云主机
    const createVM = async () => {
      // 如果radio没有选择全，则弹出通知
      if (!radioService.value || !radioNetwork.value || !radioImage.value || !radioFlavor.value || !radioQuota.value) {
        $q.notify({
          classes: 'notification-negative shadow-15',
          icon: 'error',
          textColor: 'negative',
          message: '请选择正确的云主机配置',
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      } else {
        isCreating.value = true
        const selection = {
          service_id: radioService.value,
          // service_id: '', // dev
          network_id: radioNetwork.value,
          image_id: radioImage.value,
          flavor_id: radioFlavor.value,
          quota_id: radioQuota.value,
          remarks: inputRemarks.value
        }
        try {
          const respCreateVM = await $store.dispatch('vm/createServer', selection)
          // 更新userServerTable,根据返回的serverId获取该server的全部信息，存入table
          void await $store.dispatch('vm/updateUserServerTableSingleServer', respCreateVM.data.id)
          // 显示通知
          $q.notify({
            classes: 'notification-positive shadow-15',
            icon: 'check_circle',
            textColor: 'positive',
            message: `成功创建云主机: ${$store.state.vm.tables.userServerTable.byId[respCreateVM.data.id].ipv4}`,
            position: 'bottom',
            closeBtn: true,
            timeout: 15000,
            multiLine: false
          })
          // 改变按钮状态
          isCreating.value = false
          // 跳转
          void $router.push({ path: '/my/personal/vm' })
        } catch (error) {
          // 创建vm失败，将按钮状态改回
          isCreating.value = false
          // 提示错误
          $q.notify({
            classes: 'notification-negative shadow-15',
            icon: 'error',
            textColor: 'negative',
            message: '创建云主机失败，请重试。',
            caption: `${error.response.status as string}: ${error.response.data.message as string}`, // 应告诉ts取到的值为string
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
        }
      }
    }
    // 刷新本页
    const refresh = () => {
      $router.go(0)
    }
    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    return {
      dataCenters,
      publicNetworks,
      privateNetworks,
      images,
      quotas,
      flavors,
      radioService,
      radioDataCenter,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioQuota,
      inputRemarks,
      createVM,
      refresh,
      goBack,
      isCreating
    }
  }
})
</script>

<style lang="scss" scoped>
.VmCreate {
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

.input-remarks {
  width: 500px;
}

.jumper {
  text-align: center;
}
</style>
