<template>
  <div class="VmCreate">
    <div class="column items-center justify-center">

      <div class="col">
        <div v-if="!isShowJumper" class="title-area">
          <div>
            新建云主机
            <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense
                   @click="goBack"/>
          </div>
          <!--        <q-btn @click="quickJump" label="quickjump"/>-->
        </div>
      </div>

      <div class="col">
        <div v-if="!isShowJumper" class="stepper-area">
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
                    1 - 服务节点
                  </div>
                  <div>
                    <q-inner-loading :showing="!Boolean(dataCenters)">
                      <q-spinner size="50px" color="primary"/>
                    </q-inner-loading>
                  </div>

                  <div v-for="dataCenter in dataCenters" :key="dataCenter.id" class="row item-row">
                    <div class="col-shrink item-title text-bold">
                      {{ dataCenter.name }}
                    </div>
                    <div class="col item-radios">
                      <q-radio
                        v-for="service in dataCenter.services.map((serviceId) => $store.state.usage.tables.userServiceTable.byId[serviceId])"
                        dense v-model="radioService"
                        :val="service.id" :label="service.name" :key="service.id" class="radio"/>
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
              title="云主机配置"
              icon="create_new_folder"
              :done="done2"
            >
              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  2 - 网络类型
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
                  3 - 系统镜像
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
                  4 - CPU/内存
                </div>
                <div v-if="flavors.length > 0" class="row item-row">
                  <div class="col item-radios">
                    <q-radio v-for="flavor in flavors" dense v-model="radioFlavor" :val="flavor.id"
                             :label="`${flavor.vcpus}核/${flavor.ram}MB`" :key="flavor.id" class="radio"/>
                  </div>
                </div>
                <div v-else>该服务节点暂无可用配置，请选择其它服务节点</div>
              </div>

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  5 - 配额
                </div>
                <div v-if="quotas.length > 0" class="row item-row">
                  <!--                  <div class="col-shrink item-title-narrow text-bold">-->
                  <!--                    通用配额-->
                  <!--                  </div>-->
                  <div class="col item-radios">
                    <q-radio v-for="quota in quotas" dense v-model="radioQuota" :val="quota.id"
                             :key="quota.id" class="radio"
                             :disable="quota.vcpu_used===quota.vcpu_total ||
                                       quota.ram_used===quota.ram_total ||
                                       quota.private_ip_used===quota.private_ip_total ||
                                       quota.public_ip_used===quota.public_ip_total">
                      <quota-card :quota="quota"/>
                    </q-radio>
                  </div>
                </div>
                <div v-if="quotas.length === 0" class="row item-row">
                  <div class="col-shrink item-title">
                    该服务节点暂无可用资源配额，请选择其它服务节点。
                    或者申请配额。
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
                  所选配置
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    服务中心
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.usage.tables.globalDataCenterTable.byId[radioDataCenter] && $store.state.usage.tables.userServiceTable.byId[radioService] ?
                        `${$store.state.usage.tables.globalDataCenterTable.byId[radioDataCenter].name} - ${$store.state.usage.tables.userServiceTable.byId[radioService].name}` : '尚未选择服务中心'
                    }}
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    网络类型
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.usage.tables.userNetworkTable.byLocalId[`${radioService}-${radioNetwork}`]?.name || '尚未选择网络类型'
                    }}
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    系统镜像
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.usage.tables.userImageTable.byLocalId[`${radioService}-${radioImage}`]?.name || '尚未选择系统镜像'
                    }}
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    CPU/内存
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.usage.tables.globalFlavorTable.byId[radioFlavor] ?
                        `${$store.state.usage.tables.globalFlavorTable.byId[radioFlavor].vcpus}核/${$store.state.usage.tables.globalFlavorTable.byId[radioFlavor].ram}MB` :
                        '尚未选择配置'
                    }}
                  </div>
                </div>

                <div class="row item-row">
                  <div class="col-shrink item-title-narrow text-bold">
                    配额
                  </div>
                  <div class="col item-radios">
                    {{
                      $store.state.usage.tables.userQuotaTable.byId[radioQuota]?.display || '尚未选择配额'
                    }}
                  </div>
                </div>

              </div>

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  备注(可选)
                </div>
                <div class="row item-row">
                  <div class="col">
                    <q-input class="input-remarks" v-model="inputRemarks" maxlength="15" dense counter></q-input>
                  </div>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn color="primary" @click="createVM" label="创建云主机" unelevated :loading="isCreating"/>
                <q-btn flat @click="step = 2" color="primary" label="返回" class="q-ml-sm"/>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>

        </div>

        <div v-else class="jumper">
          <div class="q-pa-lg">
            已成功创建IP地址为{{ newIP }}的云主机
          </div>
          <div class="q-pa-lg">
            3秒后跳转至详情页面
          </div>
          <q-btn label="继续创建云主机" @click="refresh" color="primary" unelevated/>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { StateInterface } from 'src/store'
import { useQuasar } from 'quasar'
import { QuotaInterface } from 'src/store/usage/state'

import QuotaCard from 'components/usage/QuotaCard.vue'

export default defineComponent({
  name: 'VmCreate',
  components: { QuotaCard },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()

    // 从url直接进入此页面时，加载tables
    // void $store.dispatch('usage/updateUsageTable')

    // radio选项数据，根据所选择serviceId建立
    // //全局数据
    const dataCenters = computed(() => Object.values($store.state.usage.tables.globalDataCenterTable.byId))
    // //radioService的选项数据根据dataCenters动态生成
    const flavors = computed(() => Object.values($store.state.usage.tables.globalFlavorTable.byId))
    // //依赖radioService Id选择值的数据
    const publicNetworks = computed(() => $store.getters['usage/getPublicNetworksByServiceId'])
    const privateNetworks = computed(() => $store.getters['usage/getPrivateNetworksByServicedId'])
    const images = computed(() => $store.getters['usage/getImagesByServiceId'])
    const quotas = computed(() => $store.getters['usage/getQuotasByServiceId'])

    // radio的选择状态
    const radioService = computed({
      get: () => $store.state.usage.pages.vmCreate.serviceId,
      set: (value) => $store.commit('usage/storeVmCreatePageServiceId', value)
    })
    // //radioDataCenter不对应实体radio按钮，而是根据radioService选择结果自动更新对应的dataCenterId
    const radioDataCenter = computed(() => {
      // console.log($store.state.usage.tables.userServiceTable.byId[radioService.value].data_center === $store.state.usage.tables.globalDataCenterTable.byId[$store.state.usage.tables.userServiceTable.byId[radioService.value].data_center].id)
      return $store.state.usage.tables.userServiceTable.byId[radioService.value].data_center
    })
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const radioQuota = ref('')
    const inputRemarks = ref('')

    // radioService选择变化时，更新后面所有radio的默认选择。
    watch(radioService, () => {
      radioNetwork.value = privateNetworks.value.length > 0 ? privateNetworks.value[0]?.id : publicNetworks.value[0]?.id
      radioImage.value = images.value[0]?.id
      radioFlavor.value = flavors.value[0]?.id
      // 选择有余量的配额里的第一项
      radioQuota.value = quotas.value.filter((quota: QuotaInterface) => {
        if (quota.vcpu_used === quota.vcpu_total ||
          quota.ram_used === quota.ram_total ||
          quota.private_ip_used === quota.private_ip_total ||
          quota.public_ip_used === quota.public_ip_total) {
          return false
        } else {
          return true
        }
      })[0].id
    })

    // radioService的默认选择
    // // tables已经全部加载时，radioService选择第一项
    const chooseRadioService = () => {
      if (
        $store.state.usage.tables.userServiceTable.isLoaded &&
        $store.state.usage.tables.userNetworkTable.isLoaded &&
        $store.state.usage.tables.userImageTable.isLoaded &&
        $store.state.usage.tables.globalFlavorTable.isLoaded &&
        $store.state.usage.tables.userQuotaTable.isLoaded
      ) {
        radioService.value = $store.state.usage.tables.userServiceTable.allIds[0]
      }
    }
    // // setup时调用一次
    chooseRadioService()
    // // watch根据tables的变化情况，再调用
    watch($store.state.usage.tables, () => {
      chooseRadioService()
    })

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
    // jumper 创建后跳转
    const isShowJumper = ref(false)
    const newIP = ref('')

    // 创建云主机按钮状态
    const isCreating = ref(false)
    // 创建云主机
    const createVM = async () => {
      // 如果radio没有选择全，则弹出通知
      if (!radioService.value || !radioNetwork.value || !radioImage.value || !radioFlavor.value || !radioQuota.value) {
        $q.notify({
          color: 'red',
          message: '请选择正确的云主机配置',
          position: 'center',
          closeBtn: false,
          timeout: 3000
        })
      } else {
        isCreating.value = true
        done3.value = true
        const selection = {
          service_id: radioService.value,
          network_id: radioNetwork.value,
          image_id: radioImage.value,
          flavor_id: radioFlavor.value,
          quota_id: radioQuota.value,
          remarks: inputRemarks.value
        }
        const respCreateVM = await $store.dispatch('usage/createServer', selection)
        // 更新userServerTable,根据返回的serverId获取该server的全部信息，存入table
        void await $store.dispatch('usage/updateUserServerTableSingleServer', respCreateVM.data.id)

        newIP.value = $store.state.usage.tables.userServerTable.byId[respCreateVM.data.id].ipv4
        $q.notify({
          color: 'nord14',
          message: `成功创建id为${newIP.value}的云主机`,
          position: 'bottom-right',
          closeBtn: false,
          timeout: 15000
        })
        isCreating.value = false
        isShowJumper.value = true

        console.log($store.state.usage)
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          void $router.push(`/my/usage/vmdetail/${respCreateVM.data.id}`)
        }, 3000)
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
    // dev
    const quickJump = () => {
      isShowJumper.value = true
    }
    return {
      dataCenters,
      publicNetworks,
      privateNetworks,
      images,
      quotas,
      flavors,
      step,
      done1,
      done2,
      done3,
      reset,
      radioService,
      radioDataCenter,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioQuota,
      inputRemarks,
      createVM,
      isShowJumper,
      refresh,
      goBack,
      quickJump,
      newIP,
      isCreating
    }
  }
})
</script>

<style lang="scss" scoped>
.VmCreate {
}

.title-area {
  width: 1280px; // prod
  //width: 800px; //dev
  //margin-bottom: calc((100vh - 114px) / 24);
  //line-height: calc((100vh - 114px) / 10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  //border-bottom: $primary 2px solid;
}

.back-btn {
  left: -130px;
}

.stepper-area {
  //width: 1100px;
  //width: calc(100vw - 200px);
  //width: 66vw;
}

.stepper {
  width: 1330px; // prod
  //width: 800px; //dev
  //min-height: 500px;
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
