<template>
  <div class="VmCreate">
    <div class="row routerview-area">
      <div class="col-1"></div>
      <div class="col">
        <div class="column items-center justify-center ">

          <div v-if="!isShowJumper" class="col-1 self-start title-area">
            <div>
              新建云主机
              <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense
                     :to="{path: '/my/usage/'}"/>
            </div>
            <!--        <q-btn @click="quickJump" label="quickjump"/>-->

          </div>

          <!--          <pre>{{ publicNetworks }}</pre>-->
          <!--          <pre>{{ privateNetworks }}</pre>-->
          <!--          <pre>{{ quotas }}</pre>-->
          <!--          <pre>{{ images }}</pre>-->
          <!--          <pre>{{ flavors }}</pre>-->

          <div v-if="!isShowJumper" class="col content-area">
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
                title="数据中心"
                icon="settings"
                :done="done1"
              >
                <div class="column">
                  <div class="col section">
                    <div class="text-h7 text-primary section-title">
                      1 - 数据中心
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
                  <div v-if="publicNetworks.length > 0" class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      公网IP
                    </div>
                    <div class="col item-radios">
                      <q-radio v-for="network in publicNetworks" dense v-model="radioNetwork" :val="network.id"
                               :label="network.name" :key="network.id" class="radio"/>
                    </div>
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
                  <div v-if="publicNetworks.length === 0 && privateNetworks.length === 0" class="row item-row">
                    <div class="col-shrink item-title">
                      该数据中心暂无可用网络类型，请选择其它数据中心
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
                  <div v-else>该数据中心暂无可用镜像，请选择其它数据中心</div>
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
                  <div v-else>该数据中心暂无可用配置，请选择其它数据中心</div>
                </div>

                <div class="col section">
                  <div class="text-h7 text-primary section-title">
                    5 - 配额
                  </div>
                  <div v-if="quotas.length > 0" class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      通用配额
                    </div>
                    <div class="col item-radios">
                      <q-radio v-for="quota in quotas" dense v-model="radioUserQuota" :val="quota.id"
                               :key="quota.id" class="radio">
                        {{ quota.display }}
                      </q-radio>
                    </div>
                  </div>
                  <!--              <div v-if="options.pquota.length > 0" class="row item-row">-->
                  <!--                <div class="col-shrink item-title text-bold">-->
                  <!--                  专有配额-->
                  <!--                </div>-->
                  <!--                <div class="col item-radios">-->
                  <!--                  <q-radio v-for="pquota in options.pquota" dense v-model="radioPquota" :val="pquota.id"-->
                  <!--                           :label="pquota.name" :key="pquota.id" class="radio"/>-->
                  <!--                </div>-->
                  <!--              </div>-->
                  <div v-if="quotas.length === 0" class="row item-row">
                    <div class="col-shrink item-title">
                      该数据中心暂无可用资源配额，请选择其它数据中心
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
                      数据中心
                    </div>
                    <div class="col item-radios">
                      {{ selectionName.serviceName }}
                    </div>
                  </div>

                  <div class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      网络类型
                    </div>
                    <div class="col item-radios">
                      {{ selectionName.networkName }}
                    </div>
                  </div>

                  <div class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      系统镜像
                    </div>
                    <div class="col item-radios">
                      {{ selectionName.imageName }}
                    </div>
                  </div>

                  <div class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      CPU/内存
                    </div>
                    <div class="col item-radios">
                      {{ selectionName.flavorName }}
                    </div>
                  </div>

                  <div class="row item-row">
                    <div class="col-shrink item-title-narrow text-bold">
                      配额
                    </div>
                    <div class="col item-radios">
                      {{ selectionName.quotaName }}
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
              已成功创建id为{{ newIP }}的云主机
            </div>
            <div class="q-pa-lg">
              3秒后跳转至详情页面
            </div>
            <q-btn label="继续创建云主机" @click="refresh" color="primary" unelevated/>
          </div>
        </div>
      </div>
      <div class="col-2"></div>
    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref /* watch, reactive */ } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { StateInterface } from 'src/store'
// import { DataPointNetworkInterface, ImageInterface_old, FlavorInterface_old } from 'src/store/usage/state'
import { useQuasar } from 'quasar'
// import { TypeInterface } from 'src/store/quota/state'

export default defineComponent({
  name: 'VmCreate',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()

    onMounted(() => {
      // 页面加载后，默认选择第一个数据中心 todo 直接进vmcreate时，选不上默认项
      const firstServiceId = $store.state.usage.tables.userServiceTable.allIds[0]
      console.log(firstServiceId)
      radioService.value = firstServiceId
      // radioNetwork.value = firstService.networks.public[0].id || firstService.networks.private[0].id
      // radioImage.value = firstService.images[0].id
      // radioFlavor.value = firstService.flavors[0].id
      //
      // for (const service of $store.state.quota.userQuota.services) {
      //   if (service.id === firstService.serviceId) {
      //     radioUserQuota.value = service.serviceTypes[0].id
      //   } else {
      //     radioUserQuota.value = ''
      //   }
      // }
    })

    // 选项数据，根据所选择serviceId建立
    // 全局数据
    const dataCenters = computed(() => Object.values($store.state.usage.tables.globalDataCenterTable.byId))
    const flavors = computed(() => Object.values($store.state.usage.tables.globalFlavorTable.byId))
    // 依赖radioService Id选择值的数据
    // const services = computed(() => Object.values($store.state.usage.tables.userServiceTable.byId))
    const publicNetworks = computed(() => $store.getters['usage/getPublicNetworksByServiceId'])
    const privateNetworks = computed(() => $store.getters['usage/getPrivateNetworksByServicedId'])
    const images = computed(() => $store.getters['usage/getImagesByServiceId'])
    const quotas = computed(() => $store.getters['usage/getQuotasByServiceId'])

    // const dataPointTree = computed(() => $store.state.usage.dataPointTree)
    // options是radio的选项集合
    // const options: { serviceId: string; serviceName: string; public: DataPointNetworkInterface[]; private: DataPointNetworkInterface[]; images: ImageInterface_old[]; flavors: FlavorInterface_old[]; uquota: TypeInterface[]; /* pquota?: Record<string, any>[] */ } = reactive({
    //   serviceId: '',
    //   serviceName: '',
    //   public: [],
    //   private: [],
    //   images: [],
    //   flavors: [],
    //   uquota: [] // 通用配额
    // })
    // 页面选项的状态
    const radioService = computed({
      get: () => $store.state.usage.ui.vmCreate.serviceId,
      set: (value) => $store.commit('usage/storeVmCreateServiceId', value)
    })
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const radioUserQuota = ref('')
    const inputRemarks = ref('')

    // watch(radioService, () => {
    //   // serviceId选择变化时，重新建立options对象
    //   options.serviceId = radioService.value
    //   for (const service of $store.state.usage.serviceList) {
    //     if (service.serviceId === radioService.value) {
    //       options.serviceName = service.serviceName
    //     }
    //   }
    //   for (const service of $store.state.usage.serviceList) {
    //     if (service.serviceId === radioService.value) {
    //       options.public = service.networks.public
    //       options.private = service.networks.private
    //       options.images = service.images
    //       options.flavors = service.flavors
    //     }
    //   }
    //   for (const service of $store.state.quota.userQuota.services) {
    //     if (service.id === radioService.value) {
    //       options.uquota = service.serviceTypes
    //     }
    //   }
    //   // 页面各项均重新选择为新options中的
    //   radioNetwork.value = options.public[0] ? options.public[0].id : options.private[0] ? options.private[0].id : ''
    //   radioImage.value = options.images[0] ? options.images[0].id : ''
    //   radioFlavor.value = options.flavors[0] ? options.flavors[0].id : ''
    //   radioUserQuota.value = options.uquota[0] ? options.uquota[0].id : ''
    // })

    // 选择结果
    const selectionId = computed(() => {
      return {
        service_id: radioService.value,
        network_id: radioNetwork.value,
        image_id: radioImage.value,
        flavor_id: radioFlavor.value,
        quota_id: radioUserQuota.value,
        remarks: inputRemarks.value
      }
    })
    // const selectionName = computed(() => {
    //   const serviceName = options.serviceName
    //   let networkName = ''
    //   for (const privateNetwork of options.private) {
    //     if (privateNetwork.id === radioNetwork.value) {
    //       networkName = '私网IP - ' + privateNetwork.name
    //     }
    //   }
    //   for (const publicNetwork of options.public) {
    //     if (publicNetwork.id === radioNetwork.value) {
    //       networkName = '公网IP - ' + publicNetwork.name
    //     }
    //   }
    //   let imageName = ''
    //   for (const image of options.images) {
    //     if (image.id === radioImage.value) {
    //       imageName = image.name
    //     }
    //   }
    //   let flavorName = ''
    //   for (const flavor of options.flavors) {
    //     if (flavor.id === radioFlavor.value) {
    //       flavorName = `${flavor.vcpus}核/${flavor.ram}MB`
    //     }
    //   }
    //   let quotaName = ''
    //   for (const quota of options.uquota) {
    //     if (quota.id === radioUserQuota.value) {
    //       quotaName = quota.display
    //     }
    //   }
    //   return {
    //     serviceName,
    //     networkName,
    //     imageName,
    //     flavorName,
    //     quotaName
    //   }
    // })
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
      isCreating.value = true
      done3.value = true
      const respCreateVM = await $store.dispatch('usage/createServer', selectionId.value)
      const respFetchServerInfo = await $store.dispatch('usage/fetchServerInfo', respCreateVM.data.id)
      // console.log(respFetchServerInfo)
      newIP.value = respFetchServerInfo.data.server.ipv4
      $q.notify({
        color: 'nord14',
        message: `成功创建id为${newIP.value}的云主机`,
        position: 'bottom-right',
        closeBtn: false,
        timeout: 15000
      })
      isCreating.value = false
      isShowJumper.value = true

      // 进入vmdetai页面前，更新server实例信息
      void await $store.dispatch('usage/updateServerInfo', respFetchServerInfo.data.server.id)
      // 更新vpn 信息

      void await $store.dispatch('usage/updateVpn', {
        serviceId: respFetchServerInfo.data.server.service.id,
        serviceName: respFetchServerInfo.data.server.service.name
      })

      setTimeout(() => {
        void $router.push('/my/usage/vmdetail')
      }, 3000)
    }
    // 刷新本页
    const refresh = () => {
      $router.go(0)
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
      selectionId,
      // selectionName,
      radioService,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioUserQuota,
      inputRemarks,
      // options,
      createVM,
      isShowJumper,
      refresh,
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

.routerview-area {
  //height: calc(100vh - 115px);
  width: calc(100vw - 165px);
}

.title-area {
  width: 300px;
  margin-left: 140px;
  margin-bottom: calc((100vh - 114px) / 24);
  line-height: calc((100vh - 114px) / 10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  //border-bottom: $primary 2px solid;
}

.back-btn {
  left: -150px;
}

.content-area {
  //width: calc(100vw - 200px);
  width: 66vw;
}

.stepper {
  padding: 0 100px;
  min-height: 500px;
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
  padding: 0 10px;
}

.input-remarks {
  width: 500px;
}

.jumper {
  text-align: center;
}
</style>
