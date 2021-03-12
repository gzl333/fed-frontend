<template>
  <div class="VmCreate">
    <div class="row items-center routerview-area">
      <div class="col-9 select-area ">
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
                <div class="col-shrink item-title text-bold">
                  公网IP
                </div>
                <div class="col item-radios">
                  <q-radio v-for="network in options.public" dense v-model="radioNetwork" :val="network.id"
                           :label="network.name" :key="network.id" class="radio"/>
                </div>
              </div>
              <div v-if="options.private.length > 0" class="row item-row">
                <div class="col-shrink item-title text-bold">
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
                5 - 使用配额
              </div>
              <div v-if="options.public.length > 0" class="row item-row">
                <div class="col-shrink item-title text-bold">
                  使用用户所属数据中心的公有配额
                </div>
                <div class="col item-radios">
                  <q-radio v-for="network in options.public" dense v-model="radioNetwork" :val="network.id"
                           :label="network.name" :key="network.id" class="radio"/>
                </div>
              </div>
              <div v-if="options.private.length > 0" class="row item-row">
                <div class="col-shrink item-title text-bold">
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
                当前所选配置
              </div>
              <div class="row item-row">
                <div class="col">
                  {{ selection }}}
                </div>
              </div>
            </div>
            <div class="col section">
              <div class="text-h7 text-primary section-title">
                备注(可选)
              </div>
              <div class="row item-row">
                <div class="col">
                  <q-input></q-input>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn color="primary" @click="done3 = true" label="Finish"/>
              <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm"/>
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
      <div class="col-3 summary-area">
        current selection
        <pre>{{ selection }}</pre>
        <pre>{{ userQuota }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { DataPointNetworkInterface, ImageInterface, FlavorInterface } from 'src/store/usage/state'

export default defineComponent({
  name: 'VmCreate',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    onMounted(async () => {
      // 当前加载策略：挂载页面后建立全部dataPoint(service)的serviceList，以后可以改成根据serviceId的逐步选择，逐步建立serviceList
      void await $store.dispatch('usage/buildServiceList')
      void await $store.dispatch('quota/updateQuota')
      // 页面加载后，默认选择第一个数据中心
      const firstService = $store.state.usage.serviceList[0]
      radioDataPoint.value = firstService.serviceId
      radioNetwork.value = firstService.networks.public[0].id || firstService.networks.private[0].id
      radioImage.value = firstService.images[0].id
      radioFlavor.value = firstService.flavors[0].id
    })
    // 选项数据，其中options根据所选择serviceId建立
    const dataPointTree = computed(() => $store.state.usage.dataPointTree)
    const options: { public: DataPointNetworkInterface[]; private: DataPointNetworkInterface[]; images: ImageInterface[]; flavors: FlavorInterface[] } = reactive({
      public: [],
      private: [],
      images: [],
      flavors: []
    })
    // quota
    const userQuota = computed(() => $store.state.quota.userQuota)
    // 页面选项的状态
    const radioDataPoint = ref('')
    const radioNetwork = ref('')
    const radioImage = ref('')
    const radioFlavor = ref('')

    watch(radioDataPoint, () => {
      // 数据中心选择变化时，重新建立options对象
      for (const service of $store.state.usage.serviceList) {
        if (service.serviceId === radioDataPoint.value) {
          options.public = service.networks.public
          options.private = service.networks.private
          options.images = service.images
          options.flavors = service.flavors
        }
      }
      // 页面各项均重新选择为新options中的
      radioNetwork.value = options.public[0] ? options.public[0].id : options.private[0] ? options.private[0].id : ''
      radioImage.value = options.images[0] ? options.images[0].id : ''
      radioFlavor.value = options.flavors[0] ? options.flavors[0].id : ''
    })
    // 选择结果
    const selection = computed(() => {
      return {
        service_id: radioDataPoint.value,
        network_id: radioNetwork.value,
        image_id: radioImage.value,
        flavor_id: radioFlavor.value,
        quota_id: '',
        privateQuota_id: '',
        remarks: ''
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

    return {
      step,
      done1,
      done2,
      done3,
      reset,
      selection,
      radioDataPoint,
      radioNetwork,
      radioImage,
      radioFlavor,
      dataPointTree,
      options,
      userQuota
    }
  }
})
</script>

<style lang="scss" scoped>
.VmCreate {
}

.routerview-area {
  height: calc(100vh - 114px);
  width: calc(100vw - 165px);
}

.select-area {
}

.summary-area {
  background-color: $nord6;
}

.stepper {
  padding: 0 100px;
  min-height: 600px;
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
  text-align: right;
  padding-right: 50px;
}

.radio {
  padding: 0 10px;
}
</style>
