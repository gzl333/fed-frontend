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
            title="数据中心与网络类型"
            icon="settings"
            :done="done1"
          >
            <div class="column">
              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  1 - 选择云主机所在的数据中心
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

              <div class="col section">
                <div class="text-h7 text-primary section-title">
                  2 - 选择云主机的网络类型
                </div>
                <div class="row item-row">
                  <div class="col-shrink item-title text-bold">
                    公网IP
                  </div>
                  <div class="col item-radios">
                    <q-radio v-for="network in networks.public" dense v-model="radioNetwork" :val="network.id"
                             :label="network.name" :key="network.id" class="radio"/>
                  </div>
                </div>
                <div class="row item-row">
                  <div class="col-shrink item-title text-bold">
                    私网IP
                  </div>
                  <div class="col item-radios">
                    <q-radio v-for="network in networks.private" dense v-model="radioNetwork" :val="network.id"
                             :label="network.name" :key="network.id" class="radio"/>
                  </div>
                </div>
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn @click="() => { done1 = true; step = 2 }" color="primary" label="Continue"/>
            </q-stepper-navigation>
            <q-btn label="log" @click="log"/>
          </q-step>

          <q-step
            :name="2"
            title="云主机配置"
            icon="create_new_folder"
            :done="done2"
          >
            An ad group contains one or more ads which target a shared set of keywords.

            <q-stepper-navigation>
              <q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="Continue"/>
              <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm"/>
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="3"
            title="填写备注"
            caption="(可选)"
            icon="add_comment"
            :done="done3"
          >
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with
            your ads, find out how to tell if they're running and how to resolve approval issues.

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
        <pre>{{ networks }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { DataPointNetworkInterface } from 'src/store/usage/state'

export default defineComponent({
  name: 'VmCreate',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    onMounted(async () => {
      void await $store.dispatch('usage/buildServiceList')
    })
    // 选项数据
    const dataPointTree = computed(() => $store.state.usage.dataPointTree)
    const networks: { public: DataPointNetworkInterface[]; private: DataPointNetworkInterface[] } = reactive({
      public: [],
      private: []
    })
    // 页面选项的状态
    const radioDataPoint = ref('')
    const radioNetwork = ref('')
    // 数据中心选择变化时，清空网络类型的选择
    watch(radioDataPoint, () => {
      radioNetwork.value = ''
      // console.log($store.state.usage.serviceList) todo fix: networks not working in tags
      for (const service of $store.state.usage.serviceList) {
        if (service.serviceId === radioDataPoint.value) {
          networks.public = service.networks.public
          networks.private = service.networks.private
        }
      }
    })
    const log = () => {
      console.log(networks)
    }

    // 选择结果
    const selection = computed(() => {
      return {
        service_id: radioDataPoint.value,
        image_id: radioNetwork.value,
        flavor_id: '',
        network_id: '',
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
      dataPointTree,
      networks,
      log
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
