<template>
  <div class="Configuration">
    <div class="column items-center justify-center">
      <div>
        <div class="col title-area q-pb-lg">
          <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
                 @click="goBack"/>
          配置资源 - 测试服务1
        </div>

        <div class="col">

          <q-tabs
            dense
            v-model="tab"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab class="q-px-none q-mr-md" name="share" label="共享资源"/>
            <q-tab class="q-px-none q-mr-md" name="private" label="私有资源"/>
          </q-tabs>

                    <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="share">

              <div class="row q-py-md">
                <div class="col-1">
                  CPU
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="cpuShare"
                    :min="1"
                    :max="300"
                    :step="1"
                    label
                    :label-value="cpuShare + '核'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="cpuShare"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  内存
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="ramShare"
                    :min="1"
                    :max="500"
                    :step="1"
                    label
                    :label-value="`${ramShare}GB`"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="ramShare"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  私网IP
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="privateIpShare"
                    :min="0"
                    :max="100"
                    :step="1"
                    label
                    :label-value="privateIpShare + '个'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="privateIpShare"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  公网IP
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="publicIpShare"
                    :min="0"
                    :max="100"
                    :step="1"
                    label
                    :label-value="publicIpShare + '个'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="publicIpShare"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  云硬盘
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="diskShare"
                    :min="0"
                    :max="102400"
                    :step="100"
                    label
                    :label-value="diskShare + 'GB'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="diskShare"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

            </q-tab-panel>

            <q-tab-panel name="private">
              <div class="row q-py-md">
                <div class="col-1">
                  CPU
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="cpu"
                    :min="1"
                    :max="300"
                    :step="1"
                    label
                    :label-value="cpu + '核'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="cpu"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  内存
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="ram"
                    :min="1"
                    :max="500"
                    :step="1"
                    label
                    :label-value="`${ram}GB`"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="ram"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  私网IP
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="privateIp"
                    :min="0"
                    :max="100"
                    :step="1"
                    label
                    :label-value="privateIp + '个'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="privateIp"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  公网IP
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="publicIp"
                    :min="0"
                    :max="100"
                    :step="1"
                    label
                    :label-value="publicIp + '个'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="publicIp"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>

              <div class="row q-py-md">
                <div class="col-1">
                  云硬盘
                </div>
                <div class="col-8 q-pr-lg">
                  <q-slider
                    v-model="disk"
                    :min="0"
                    :max="102400"
                    :step="100"
                    label
                    :label-value="disk + 'GB'"
                    label-always
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    dense
                    v-model.number="disk"
                    type="number"
                    outlined
                    style="max-width: 100px"
                  />
                </div>
              </div>
            </q-tab-panel>

          </q-tab-panels>

          <q-btn class="q-mr-lg" unelevated color="primary" label="保存修改"/>
          <q-btn outline color="primary" label="放弃修改"/>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'
import { useRouter } from 'vue-router'
// import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Configuration',
  components: {},
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
    const $router = useRouter()
    // const $q = useQuasar()

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }

    const tab = ref('share')

    const cpuShare = ref(1)
    const ramShare = ref(1)
    const privateIpShare = ref(0)
    const publicIpShare = ref(0)
    const diskShare = ref(0)

    const cpu = ref(1)
    const ram = ref(1)
    const privateIp = ref(0)
    const publicIp = ref(0)
    const disk = ref(0)

    return {
      goBack,
      tab,
      cpuShare,
      ramShare,
      privateIpShare,
      publicIpShare,
      diskShare,
      cpu,
      ram,
      privateIp,
      publicIp,
      disk
    }
  }
})
</script>

<style lang="scss" scoped>
.Configuration {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.section {
  margin-bottom: 30px;
  padding: 10px 20px;
  border: 1px solid $grey-4;
  //border-radius: 5px;
}
</style>
