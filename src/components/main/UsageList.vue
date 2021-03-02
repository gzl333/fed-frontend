<template>
  <div class="UsageList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">用户资源配额</div>
          </div>
          <div class="col-auto">
            <q-btn flat label="全部资源"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center wrap q-gutter-sm q-mt-sm">
          <div><span class="text-weight-bold">vCPU </span>总额50，剩余20</div>
          <q-linear-progress
            class="q-mt-sm q-ml-xl q-mr-md"
            size="25px"
            :value="vCPUusage"
            color="teal"
          >
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="teal" :label="vCPULabel" />
            </div>
          </q-linear-progress>
          <div class="q-mt-md">
            <span class="text-weight-bold">RAM</span> 总额512000，剩余256000
          </div>
          <q-linear-progress
            size="25px"
            :value="RAMusage"
            color="teal"
            class="q-mt-sm q-ml-xl q-mr-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="teal" :label="RAMLabel" />
            </div>
          </q-linear-progress>
          <div class="q-mt-md">
            <span class="text-weight-bold">vDISK</span> 总额100，剩余100
          </div>
          <q-linear-progress
            size="25px"
            :value="vDISKusage"
            color="teal"
            class="q-mt-sm q-ml-xl q-mr-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="teal" :label="vDISKLabel" />
            </div>
          </q-linear-progress>
          <div class="q-mt-md">
            <span class="text-weight-bold">Public-IP</span> 总额10，剩余5
          </div>
          <q-linear-progress
            size="25px"
            :value="publibIPusage"
            color="teal"
            class="q-mt-sm q-ml-xl q-mr-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="teal" :label="publibIPLabel" />
            </div>
          </q-linear-progress>
          <div class="q-mt-md">
            <span class="text-weight-bold">Private-IP</span> 总额10，剩余6
          </div>
          <q-linear-progress
            size="25px"
            :value="privateIPusage"
            color="teal"
            class="q-mt-sm q-ml-xl q-mr-md"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="teal"
                :label="privateIPLabel"
              />
            </div>
          </q-linear-progress>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { QuotaInterface } from 'src/store/quota/state'

export default defineComponent({
  name: 'UsageList',
  components: {
  },
  props: {
  },
  setup () {
    onBeforeMount(() => {
      const $store = useStore<StateInterface>()
      try {
        void (async () => {
          void await $store.dispatch('quota/fetchQuota')
        })()
      } catch (error) {
        console.log(error)
      }
    })
    const $store = useStore<StateInterface>()
    const currentQuota: QuotaInterface = $store.state.quota
    console.log(currentQuota)
    let vCPUusage
    let vCPULabel
    if (currentQuota.userQuota.providers) {
      const providerQuota = currentQuota.userQuota.providers[0]
      vCPUusage = computed(() => providerQuota.vCpuUsed / providerQuota.vCpuTotal)
      vCPULabel = computed(() => ((providerQuota.vCpuUsed / providerQuota.vCpuTotal * 100).toFixed(2) + '%'))
    }

    // const vCPUusage = ref(0.2)
    // const vCPULabel = computed(() =>
    //   ((vCPUusage.value * 100).toFixed(2) + '%')
    // )
    const RAMusage = ref(0.3)
    const RAMLabel = computed(() =>
      ((RAMusage.value * 100).toFixed(2) + '%')
    )
    const vDISKusage = ref(0.4)
    const vDISKLabel = computed(() =>
      ((RAMusage.value * 100).toFixed(2) + '%')
    )
    const publibIPusage = ref(0.5)
    const publibIPLabel = computed(() =>
      ((publibIPusage.value * 100).toFixed(2) + '%')
    )
    const privateIPusage = ref(0.6)
    const privateIPLabel = computed(() =>
      ((privateIPusage.value * 100).toFixed(2) + '%')
    )
    return {
      vCPUusage,
      vCPULabel,
      RAMusage,
      RAMLabel,
      vDISKusage,
      vDISKLabel,
      publibIPusage,
      publibIPLabel,
      privateIPusage,
      privateIPLabel
    }
  }
})
</script>

<style lang="scss" scoped>
.UsageList {
}
.my-card {
  width: 100%;
}
</style>
