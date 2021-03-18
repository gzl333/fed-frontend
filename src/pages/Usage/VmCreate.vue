<template>
  <div class="VmCreate">

    <div class="column items-center justify-center routerview-area">

      <div v-if="!isShowJumper" class="col-1 self-start title-area">
        <div>
          新建云主机
          <q-btn class="back-btn" icon="arrow_back_ios_new" color="primary" flat unelevated dense :to="{path: '/my/usage/'}"/>
        </div>
        <!--        <q-btn @click="quickJump" label="quickjump"/>-->
      </div>

      <div v-if="!isShowJumper" class="col content-area">
        <q-stepper
          class="stepper"
          v-model="step"
          header-nav
          ref="stepper"
          color="primary"
          animated
          flat
        >
          <q-step
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
                  <q-inner-loading :showing="!Boolean(dataPointTree[0].children[0])">
                    <q-spinner size="50px" color="primary"/>
                  </q-inner-loading>
                </div>

                <div v-for="dataCenter in dataPointTree[0].children" :key="dataCenter.key" class="row item-row">
                  <div class="col-shrink item-title text-bold">
                    {{ dataCenter.label }}
                  </div>
                  <div class="col item-radios">
                    <q-radio v-for="dataPoint in dataCenter.children" dense v-model="radioDataPoint"
                             :val="dataPoint.key" :label="dataPoint.label" :key="dataPoint.key" class="radio"/>
                  </div>
                </div>

              </div>

            </div>
            <q-stepper-navigation>
              <q-btn @click="() => { done1 = true; step = 2 }" unelevated color="primary" label="继续"/>
            </q-stepper-navigation>

          </q-step>

          <q-step
            :name="2"
            title="云主机配置"
            icon="create_new_folder"
            :done="done2"
          >
            <div class="col section">
              <div class="text-h7 text-primary section-title">
                2 - 网络类型
              </div>
              <div v-if="options.public.length > 0" class="row item-row">
                <div class="col-shrink item-title-narrow text-bold">
                  公网IP
                </div>
                <div class="col item-radios">
                  <q-radio v-for="network in options.public" dense v-model="radioNetwork" :val="network.id"
                           :label="network.name" :key="network.id" class="radio"/>
                </div>
              </div>
              <div v-if="options.private.length > 0" class="row item-row">
                <div class="col-shrink item-title-narrow text-bold">
                  私网IP
                </div>
                <div class="col item-radios">
                  <q-radio v-for="network in options.private" dense v-model="radioNetwork" :val="network.id"
                           :label="network.name" :key="network.id" class="radio"/>
                </div>
              </div>
              <div v-if="options.public.length==0 && options.private.length === 0" class="row item-row">
                <div class="col-shrink item-title">
                  该数据中心暂无可用网络类型，请选择其它数据中心
                </div>
              </div>
            </div>

            <div class="col section">
              <div class="text-h7 text-primary section-title">
                3 - 系统镜像
              </div>
              <div v-if="options.images.length > 0" class="row item-row">
                <div class="col item-radios">
                  <q-radio v-for="image in options.images" dense v-model="radioImage" :val="image.id"
                           :label="image.name" :key="image.id" class="radio"/>
                </div>
              </div>
              <div v-else>该数据中心暂无可用镜像，请选择其它数据中心</div>
            </div>

            <div class="col section">
              <div class="text-h7 text-primary section-title">
                4 - CPU/内存
              </div>
              <div v-if="options.flavors.length > 0" class="row item-row">
                <div class="col item-radios">
                  <q-radio v-for="flavor in options.flavors" dense v-model="radioFlavor" :val="flavor.id"
                           :label="`${flavor.vcpus}核/${flavor.ram}MB`" :key="flavor.id" class="radio"/>
                </div>
              </div>
              <div v-else>该数据中心暂无可用配置，请选择其它数据中心</div>
            </div>

            <div class="col section">
              <div class="text-h7 text-primary section-title">
                5 - 配额
              </div>
              <div v-if="options.uquota.length > 0" class="row item-row">
                <div class="col-shrink item-title-narrow text-bold">
                  通用配额
                </div>
                <div class="col item-radios">
                  <q-radio v-for="uquota in options.uquota" dense v-model="radioUquota" :val="uquota.id"
                           :key="uquota.id" class="radio">
                    {{ uquota.display }}
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
              <div v-if="options.public.length === 0 && options.private.length === 0" class="row item-row">
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
              <q-btn color="primary" @click="createVM" label="创建云主机" unelevated/>
              <q-btn flat @click="step = 2" color="primary" label="返回" class="q-ml-sm"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>

      </div>

      <div v-else class="jumper">
        <div>
          已成功创建id为{{ newIP }}的云主机
        </div>
        <div>
          5秒后跳转至云主机列表页面...
        </div>
        <q-btn label="继续创建云主机" @click="refresh" color="primary" unelevated/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { StateInterface } from 'src/store'
import { DataPointNetworkInterface, ImageInterface, FlavorInterface } from 'src/store/usage/state'
import { useQuasar } from 'quasar'
import { TypeInterface } from 'src/store/quota/state'

export default defineComponent({
  name: 'VmCreate',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $q = useQuasar()
    onMounted(async () => {
      // 当前加载策略：挂载页面后建立全部dataPoint(service)的serviceList，以后可以改成根据serviceId的逐步选择，逐步建立serviceList
      void await $store.dispatch('usage/updateServiceList')
      void await $store.dispatch('quota/updateQuota')
      // 页面加载后，默认选择第一个数据中心
      const firstService = $store.state.usage.serviceList[0]
      radioDataPoint.value = firstService.serviceId
      radioNetwork.value = firstService.networks.public[0].id || firstService.networks.private[0].id
      radioImage.value = firstService.images[0].id
      radioFlavor.value = firstService.flavors[0].id

      for (const service of $store.state.quota.userQuota.services) {
        if (service.id === firstService.serviceId) {
          radioUquota.value = service.serviceTypes[0].id
        } else {
          radioUquota.value = ''
        }
      }
    })
    // 选项数据，其中options根据所选择serviceId建立
    const dataPointTree = computed(() => $store.state.usage.dataPointTree)
    const options: { serviceId: string; serviceName: string; public: DataPointNetworkInterface[]; private: DataPointNetworkInterface[]; images: ImageInterface[]; flavors: FlavorInterface[]; uquota: TypeInterface[]; /* pquota?: Record<string, any>[] */ } = reactive({
      serviceId: '',
      serviceName: '',
      public: [],
      private: [],
      images: [],
      flavors: [],
      uquota: [] // 通用配额
      /*      , pquota: [] // 专有配额，预留数据结构 */
    })
    // 页面选项的状态
    const radioDataPoint = ref('')
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')
    const radioUquota = ref('')
    // const radioPquota = ref('')
    const inputRemarks = ref('')

    watch(radioDataPoint, () => {
      // 数据中心选择变化时，重新建立options对象
      options.serviceId = radioDataPoint.value
      for (const service of $store.state.usage.serviceList) {
        if (service.serviceId === radioDataPoint.value) {
          options.serviceName = service.serviceName
        }
      }
      for (const service of $store.state.usage.serviceList) {
        if (service.serviceId === radioDataPoint.value) {
          options.public = service.networks.public
          options.private = service.networks.private
          options.images = service.images
          options.flavors = service.flavors
        }
      }
      for (const service of $store.state.quota.userQuota.services) {
        if (service.id === radioDataPoint.value) {
          options.uquota = service.serviceTypes
        }
      }
      // 页面各项均重新选择为新options中的
      radioNetwork.value = options.public[0] ? options.public[0].id : options.private[0] ? options.private[0].id : ''
      radioImage.value = options.images[0] ? options.images[0].id : ''
      radioFlavor.value = options.flavors[0] ? options.flavors[0].id : ''
      radioUquota.value = options.uquota[0] ? options.uquota[0].id : ''
    })
    // 选择结果
    const selectionId = computed(() => {
      return {
        service_id: radioDataPoint.value,
        network_id: radioNetwork.value,
        image_id: radioImage.value,
        flavor_id: radioFlavor.value,
        quota_id: radioUquota.value,
        // private_quota_id: '',
        remarks: inputRemarks.value
      }
    })
    const selectionName = computed(() => {
      const serviceName = options.serviceName
      let networkName = ''
      for (const privateNetwork of options.private) {
        if (privateNetwork.id === radioNetwork.value) {
          networkName = '私网IP - ' + privateNetwork.name
        }
      }
      for (const publicNetwork of options.public) {
        if (publicNetwork.id === radioNetwork.value) {
          networkName = '公网IP - ' + publicNetwork.name
        }
      }
      let imageName = ''
      for (const image of options.images) {
        if (image.id === radioImage.value) {
          imageName = image.name
        }
      }
      let flavorName = ''
      for (const flavor of options.flavors) {
        if (flavor.id === radioFlavor.value) {
          flavorName = `${flavor.vcpus}核/${flavor.ram}MB`
        }
      }
      let quotaName = ''
      for (const quota of options.uquota) {
        if (quota.id === radioUquota.value) {
          quotaName = quota.display
        }
      }
      return {
        serviceName,
        networkName,
        imageName,
        flavorName,
        quotaName
      }
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

    // 创建云主机
    const createVM = async () => {
      done3.value = true
      const respCreateVM = await $store.dispatch('usage/createServer', selectionId.value)
      const respFetchServerInfo = await $store.dispatch('usage/fetchServerInfo', respCreateVM.data.id)
      console.log(respFetchServerInfo)
      newIP.value = respFetchServerInfo.data.server.ipv4
      $q.notify({
        color: 'nord14',
        message: `已成功创建id为${newIP.value}的云主机`,
        position: 'bottom-right',
        closeBtn: false,
        timeout: 3000
      })
      isShowJumper.value = true
      setTimeout(() => {
        void $router.push('/my/usage')
      }, 5000)
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
      step,
      done1,
      done2,
      done3,
      reset,
      selectionId,
      selectionName,
      radioDataPoint,
      radioNetwork,
      radioImage,
      radioFlavor,
      radioUquota,
      inputRemarks,
      dataPointTree,
      options,
      createVM,
      isShowJumper,
      refresh,
      quickJump,
      newIP
    }
  }
})
</script>

<style lang="scss" scoped>
.VmCreate {
}
.routerview-area {
  height: calc(100vh - 115px);
  width: calc(100vw - 165px);
}
.title-area{
  width: 300px;
  margin-left: 140px;
  margin-bottom: calc((100vh - 114px)/24);
  line-height: calc((100vh - 114px)/10);
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
  border-bottom: $primary 2px solid;
}
.back-btn {
  left: -150px;
}
.content-area {
  width: calc(100vw - 200px);
}
.stepper {
  padding: 0 100px;
  min-height: 500px;
}

.section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1px solid #E0E0E0;
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
