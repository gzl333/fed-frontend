<template>
  <div class="QuotaList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-secondary">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold text-nord6">
              资源配额使用情况
            </div>
          </div>
          <div class="col-auto">
            <router-link :to="`/my/usage/vm`" class="flat q-ml-md text-nord6"
              >全部在用资源</router-link
            >
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center q-gutter-md q-pt-xs">
          <!-- this is top title, use servicName to classify -->
          <q-tabs
            v-model="toptab"
            narrow-indicator
            inline-label
            class="text-secondary"
            align="justify"
            v-for="service in serviceName"
            :key="service.name"
          >
            <q-tab
              :name="service.name"
              :label="service.name"
              :ripple="{ color: 'orange' }"
              icon="img:main/ev5-01.png"
              style="align-self: stretch; position: relative"
            >
              <q-badge color="nord11" text-color="nord6" floating>{{
                service.number
              }}</q-badge>
            </q-tab>
          </q-tabs>
        </div>
        <q-tab-panels
          v-model="toptab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
          v-for="service in serviceName"
          :key="service.name"
        >
          <q-tab-panel :name="service.name">
            <q-splitter
              v-model="splitterModel"
              style="height: 100%; max-height: 480px"
            >
              <!-- this is left title, use servicType to classify -->
              <template v-slot:before>
                <div v-for="(item, index) in type" :key="index">
                  <div v-if="service.name === item.name">
                    <div v-for="(it, i) in item.serviceTypes" :key="i">
                      <div class="row items-center q-gutter-md q-pt-xs">
                        <q-tabs
                          v-model="innertab"
                          narrow-indicator
                          inline-label
                          class="text-secondary"
                          align="justify"
                        >
                          <q-tab
                            :name="i"
                            :label="`${it.type}`"
                            :ripple="{ color: 'nord15' }"
                            style="align-self: stretch; position: relative"
                          />
                        </q-tabs>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- this is content -->
              <template v-slot:after>
                <div v-for="(item, index) in type" :key="index">
                  <div v-if="service.name === item.name">
                    <div v-for="(it, i) in item.serviceTypes" :key="i">
                      <q-tab-panels
                        v-model="innertab"
                        animated
                        swipeable
                        vertical
                        transition-prev="jump-up"
                        transition-next="jump-up"
                      >
                        <q-tab-panel :name="i">
                          <div v-if="it.expirationTime != null">
                            <span class="text-subtitle2 text-nord11"
                              >于{{ it.expirationTime }}到期
                            </span>
                          </div>
                          <div
                            class="row items-center wrap q-gutter-sm q-mt-sm"
                          >
                            <div v-if="it.vCpuTotal != 0">
                              <span class="text-weight-bold">vCPU </span>总额{{
                                it.vCpuTotal
                              }}，剩余{{ it.vCpuTotal - it.vCpuUsed }}，已用{{
                                it.vCpuUsed
                              }}
                            </div>
                            <q-linear-progress
                              class="q-mt-sm q-ml-xl q-mr-xs"
                              size="25px"
                              :value="it.vCpuUsed / it.vCpuTotal"
                              color="secondary"
                              v-if="it.vCpuTotal != 0"
                            >
                              <div class="absolute-full flex flex-center">
                                <q-badge
                                  color="nord6"
                                  text-color="secondary"
                                  :label="`${(
                                    (it.vCpuUsed / it.vCpuTotal) *
                                    100
                                  ).toFixed(2)}%`"
                                />
                              </div>
                            </q-linear-progress>

                            <div class="q-mt-md" v-if="it.ramTotal != 0">
                              <span class="text-weight-bold">RAM</span> 总额{{
                                it.ramTotal
                              }}MB，剩余{{ it.ramTotal - it.ramUsed }}MB，已用{{
                                it.ramUsed
                              }}MB
                            </div>
                            <q-linear-progress
                              size="25px"
                              :value="it.ramUsed / it.ramTotal"
                              color="secondary"
                              class="q-mt-sm q-ml-xl q-mr-xs"
                              v-if="it.ramTotal != 0"
                            >
                              <div class="absolute-full flex flex-center">
                                <q-badge
                                  color="nord6"
                                  text-color="secondary"
                                  :label="`${(
                                    (it.ramUsed / it.ramTotal) *
                                    100
                                  ).toFixed(2)}%`"
                                />
                              </div>
                            </q-linear-progress>
                            <div class="q-mt-md" v-if="it.diskTotal != 0">
                              <span class="text-weight-bold">vDISK</span> 总额{{
                                it.diskTotal
                              }}GB，剩余{{
                                it.diskTotal - it.diskUsed
                              }}GB，已用{{ it.diskUsed }}GB
                            </div>
                            <q-linear-progress
                              size="25px"
                              :value="it.diskUsed / it.diskTotal"
                              color="secondary"
                              class="q-mt-sm q-ml-xl q-mr-xs"
                              v-if="it.diskTotal != 0"
                            >
                              <div class="absolute-full flex flex-center">
                                <q-badge
                                  color="nord6"
                                  text-color="secondary"
                                  :label="`${(
                                    (it.diskUsed / it.diskTotal) *
                                    100
                                  ).toFixed(2)}%`"
                                />
                              </div>
                            </q-linear-progress>

                            <div class="q-mt-md" v-if="it.publicIpTotal != 0">
                              <span class="text-weight-bold">Public-IP</span>
                              总额{{ it.publicIpTotal }}，剩余{{
                                it.publicIpTotal - it.publicIpUsed
                              }}，已用{{ it.publicIpUsed }}
                            </div>
                            <q-linear-progress
                              size="25px"
                              :value="it.publicIpUsed / it.publicIpTotal"
                              color="secondary"
                              class="q-mt-sm q-ml-xl q-mr-xs"
                              v-if="it.publicIpTotal != 0"
                            >
                              <div class="absolute-full flex flex-center">
                                <q-badge
                                  color="nord6"
                                  text-color="secondary"
                                  :label="`${(
                                    (it.publicIpUsed / it.publicIpTotal) *
                                    100
                                  ).toFixed(2)}%`"
                                />
                              </div>
                            </q-linear-progress>
                            <div class="q-mt-md" v-if="it.privateIpTotal != 0">
                              <span class="text-weight-bold">Private-IP</span>
                              总额{{ it.privateIpTotal }}，剩余{{
                                it.privateIpTotal - it.privateIpUsed
                              }}
                              ，已用{{ it.privateIpUsed }}
                            </div>
                            <q-linear-progress
                              size="25px"
                              :value="it.privateIpUsed / it.privateIpTotal"
                              color="secondary"
                              class="q-mt-sm q-ml-xl q-mr-xs"
                              v-if="it.privateIpTotal != 0"
                            >
                              <div class="absolute-full flex flex-center">
                                <q-badge
                                  color="nord6"
                                  text-color="secondary"
                                  :label="`${(
                                    (it.privateIpUsed / it.privateIpTotal) *
                                    100
                                  ).toFixed(2)}%`"
                                />
                              </div>
                            </q-linear-progress>
                          </div>
                        </q-tab-panel>
                      </q-tab-panels>
                    </div>
                  </div>
                </div>
              </template>
            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>
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
    const toptab = ref('')
    onMounted(() => {
      void $store.dispatch('quota/updateQuota').then(() => {
        // console.log('before ref', $store.getters['quota/toptab'])
        toptab.value = $store.getters['quota/toptab']
      })
    })

    const serviceName = computed(() => $store.getters['quota/serviceName'])
    const type = computed(() => $store.getters['quota/servicetype'])

    const innertab = ref(0)
    const splitterModel = ref(20)

    // console.log('toptab:', toptab)
    return {
      serviceName,
      type,
      innertab,
      toptab,
      splitterModel
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
  height: 570px;
}
</style>
