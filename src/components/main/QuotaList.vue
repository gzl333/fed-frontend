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
              v-model="tab"
              vertical
              class="text-teal"
              v-for="(item, index) in serviceName"
              :key="index"
            >
              <q-tab :name="index" :label="item" icon="img:main/ev5-01.png" />
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
              v-for="(name, index) in serviceName"
              :key="index"
            >
              <q-tab-panel :name="index">
                <div class="text-weight-bold text-h6">
                  {{ name }}
                  <q-badge color="orange" class="text-caption">{{
                    type[index]
                  }}</q-badge>

                  <q-spinner-ball
                    color="primary"
                    size="1.5em"
                    class="float-right"
                  />
                  <q-tooltip :offset="[5, 8]">QSpinnerBall</q-tooltip>

                  <div v-if="expirationTime[index] != null">
                    <span class="text-subtitle2 text-red"
                      >于{{ expirationTime[index] }}到期
                    </span>
                  </div>
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

                  <div class="q-mt-md" v-if="ramTotal[index] != 0">
                    <span class="text-weight-bold">RAM</span> 总额{{
                      ramTotal[index]
                    }}MB，剩余{{ ramTotal[index] - ramUsed[index] }}MB，已用{{
                      ramUsed[index]
                    }}MB
                  </div>
                  <q-linear-progress
                    size="25px"
                    :value="ramPercentage[index]"
                    color="teal"
                    class="q-mt-sm q-ml-xl q-mr-xs"
                    v-if="ramTotal[index] != 0"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="teal"
                        :label="`${ramLabel[index]}%`"
                      />
                    </div>
                  </q-linear-progress>
                  <div class="q-mt-md" v-if="diskTotal[index] != 0">
                    <span class="text-weight-bold">vDISK</span> 总额{{
                      diskTotal[index]
                    }}GB，剩余{{ diskTotal[index] - diskUsed[index] }}GB，已用{{
                      diskUsed[index]
                    }}GB
                  </div>
                  <q-linear-progress
                    size="25px"
                    :value="diskPercentage[index]"
                    color="teal"
                    class="q-mt-sm q-ml-xl q-mr-xs"
                    v-if="diskTotal[index] != 0"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="teal"
                        :label="`${diskLabel[index]}%`"
                      />
                    </div>
                  </q-linear-progress>

                  <div class="q-mt-md" v-if="publicIpTotal[index] != 0">
                    <span class="text-weight-bold">Public-IP</span> 总额{{
                      publicIpTotal[index]
                    }}，剩余{{
                      publicIpTotal[index] - publicIpUsed[index]
                    }}，已用{{ publicIpUsed[index] }}
                  </div>
                  <q-linear-progress
                    size="25px"
                    :value="publicIpPercentage[index]"
                    color="teal"
                    class="q-mt-sm q-ml-xl q-mr-xs"
                    v-if="publicIpTotal[index] != 0"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="teal"
                        :label="`${publicIpLabel[index]}%`"
                      />
                    </div>
                  </q-linear-progress>
                  <div class="q-mt-md" v-if="privateIpTotal[index] != 0">
                    <span class="text-weight-bold">Private-IP</span> 总额{{
                      privateIpTotal[index]
                    }}，剩余{{
                      privateIpTotal[index] - privateIpUsed[index]
                    }}
                    ，已用{{ privateIpUsed[index] }}
                  </div>
                  <q-linear-progress
                    size="25px"
                    :value="privateIpPercentage[index]"
                    color="teal"
                    class="q-mt-sm q-ml-xl q-mr-xs"
                    v-if="privateIpTotal[index] != 0"
                  >
                    <div class="absolute-full flex flex-center">
                      <q-badge
                        color="white"
                        text-color="teal"
                        :label="`${privateIpLabel[index]}%`"
                      />
                    </div>
                  </q-linear-progress>
                </div>
              </q-tab-panel>
            </q-tab-panels>
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
    const type = computed(() => $store.getters['quota/servicetype'])

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
      tab: ref(0),
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
