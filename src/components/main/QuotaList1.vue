<template>
  <div class="QuotaList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">资源配额使用情况</div>
          </div>
          <div class="col-auto">
            <router-link :to="`/my/usage/vm`" class="flat text-white q-ml-md"
              >全部资源</router-link
            >
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-tabs
              v-model="innertab"
              inline-label
              vertical
              class="text-teal"
              v-for="(itemName, index) in serviceName"
              :key="index"
            >
              <q-tab
                :name="index"
                :label="itemName"
                icon="img:main/ev5-01.png"
              />
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs
                  v-model="innertab"
                  inline-label
                  vertical
                  class="text-teal"
                  v-for="(itemType, index) in type"
                  :key="index"
                >
                  <q-tab
                    :name="index"
                    :label="itemType"
                    icon="img:main/ev5-01.png"
                  />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels
                  v-model="innertab"
                  animated
                  swipeable
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                  v-for="(itemType, i) in type"
                  :key="i"
                >
                  <q-tab-panel :name="i">
                    <div>
                      <q-badge color="orange" class="text-caption">{{
                        itemType[index]
                      }}</q-badge>
                    </div>
                    <div class="text-weight-bold text-h6">
                      {{ itemName }}
                    </div>
                    <div class="row items-center wrap q-gutter-sm q-mt-sm">
                      <div v-if="vCpuTotal[index] != 0">
                        <span class="text-weight-bold">vCPU </span>总额{{
                          vCpuTotal[index]
                        }}，剩余{{ vCpuTotal[index] - vCpuUsed[index] }}，已用{{
                          vCpuUsed[index]
                        }}
                      </div>
                      <q-linear-progress
                        class="q-mt-sm q-ml-xl q-mr-xs"
                        size="25px"
                        :value="vCpuPercentage[index]"
                        color="teal"
                        v-if="vCpuTotal[index] != 0"
                      >
                        <div class="absolute-full flex flex-center">
                          <q-badge
                            color="white"
                            text-color="teal"
                            :label="`${vCpuLabel[index]}%`"
                          />
                        </div>
                      </q-linear-progress>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </template>
        </q-splitter>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'QuotaList',
  components: {
  },
  props: {
  },
  setup () {
    const $store = useStore<StateInterface>()

    onMounted(() => {
      void $store.dispatch('quota/fetchQuota')
    })

    const serviceName = computed(() => $store.getters['quota/serviceName'])
    const tabServiceName = computed(() => $store.getters['quota/tabServiceName'])
    const type = computed(() => $store.getters['quota/servicetype'])
    console.log('type:', type)

    const vCpuUsed = computed(() => $store.getters['quota/vCpuUsed'])
    const vCpuTotal = computed(() => $store.getters['quota/vCpuTotal'])
    const vCpuPercentage = computed(() => $store.getters['quota/vCpuPercentage'])
    const vCpuLabel = computed(() => $store.getters['quota/vCpuLabel'])

    const ramUsed = computed(() => $store.getters['quota/ramUsed'])
    const ramTotal = computed(() => $store.getters['quota/ramTotal'])
    const ramPercentage = computed(() => $store.getters['quota/ramPercentage'])
    const ramLabel = computed(() => $store.getters['quota/ramLabel'])

    const diskUsed = computed(() => $store.getters['quota/diskUsed'])
    const diskTotal = computed(() => $store.getters['quota/diskTotal'])
    const diskPercentage = computed(() => $store.getters['quota/diskPercentage'])
    const diskLabel = computed(() => $store.getters['quota/diskLabel'])

    const publicIpUsed = computed(() => $store.getters['quota/publicIpUsed'])
    const publicIpTotal = computed(() => $store.getters['quota/publicIpTotal'])
    const publicIpPercentage = computed(() => $store.getters['quota/publicIpPercentage'])
    const publicIpLabel = computed(() => $store.getters['quota/publicIpLabel'])

    const privateIpUsed = computed(() => $store.getters['quota/privateIpUsed'])
    const privateIpTotal = computed(() => $store.getters['quota/privateIpTotal'])
    const privateIpPercentage = computed(() => $store.getters['quota/privateIpPercentage'])
    const privateIpLabel = computed(() => $store.getters['quota/privateIpLabel'])

    const expirationTime = computed(() => $store.getters['quota/expirationTime'])

    return {
      serviceName,
      tabServiceName,
      type,
      vCpuUsed,
      vCpuTotal,
      vCpuPercentage,
      vCpuLabel,
      ramUsed,
      ramTotal,
      ramPercentage,
      ramLabel,
      diskUsed,
      diskTotal,
      diskPercentage,
      diskLabel,
      publicIpUsed,
      publicIpTotal,
      publicIpPercentage,
      publicIpLabel,
      privateIpUsed,
      privateIpTotal,
      privateIpPercentage,
      privateIpLabel,
      expirationTime,
      leftTab: ref(0),
      innertab: ref(0),
      tab: ref('HR_204机房'),
      splitterModel: ref(25)
    }
  }
}
)
</script>

<style lang="scss" scoped>
.QuotaList {
}
.my-card {
  width: 100%;
}
</style>
