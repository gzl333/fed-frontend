<template>
  <div class="QuotaCard">

    <q-card flat bordered>
      <q-card-section class="q-pa-sm">
        <div class="text-center">
          有效期至{{ props.quota.expiration_time }}
        </div>
      </q-card-section>

      <!--                        <q-separator/>-->

      <q-card-section class="q-pa-sm">

        <q-circular-progress
          show-value
          font-size="12px"
          :value="props.quota.vcpu_total && ( 1 - props.quota.vcpu_used / props.quota.vcpu_total) * 100 "
          size="120px"
          :thickness="0.22"
          color="light-green"
          track-color="grey-3"
          class="q-ma-sm"
        >
          <div v-if="props.quota.vcpu_total===props.quota.vcpu_used" class="text-red">
            CPU用尽
          </div>
          <div v-else>
            可用CPU{{ props.quota.vcpu_total - props.quota.vcpu_used }}核
          </div>
        </q-circular-progress>

        <q-circular-progress
          show-value
          font-size="12px"
          :value="props.quota.ram_total && (1 - props.quota.ram_used / props.quota.ram_total) * 100 "
          size="120px"
          :thickness="0.22"
          color="light-green"
          track-color="grey-3"
          class="q-ma-sm"
        >
          <div v-if="props.quota.ram_total===props.quota.ram_used" class="text-red">
            内存用尽
          </div>
          <div v-else>
            可用内存{{ props.quota.ram_total - props.quota.ram_used }}MB
          </div>
        </q-circular-progress>

        <q-circular-progress
          show-value
          font-size="12px"
          :value="props.quota.private_ip_total && (1 -props.quota.private_ip_used / props.quota.private_ip_total) * 100 "
          size="120px"
          :thickness="0.22"
          color="light-green"
          track-color="grey-3"
          class="q-ma-sm"
        >
          <div v-if="props.quota.private_ip_total===props.quota.private_ip_used" class="text-red">
            私网IP用尽
          </div>
          <div v-else>
            可用私网IP{{ props.quota.private_ip_total - props.quota.private_ip_used }}个
          </div>
        </q-circular-progress>

        <q-circular-progress
          show-value
          font-size="12px"
          :value="props.quota.public_ip_total && (1 - props.quota.public_ip_used/ props.quota.public_ip_total) * 100 "
          size="120px"
          :thickness="0.22"
          color="light-green"
          track-color="grey-3"
          class="q-ma-sm"
        >
          <div v-if="props.quota.public_ip_total===props.quota.public_ip_used" class="text-red">
            公网IP用尽
          </div>
          <div v-else>
            可用公网IP{{ props.quota.public_ip_total - props.quota.public_ip_used }}个
          </div>
        </q-circular-progress>

      </q-card-section>
    </q-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { QuotaInterface } from 'src/store/vm/state'

export default defineComponent({
  name: 'QuotaCard',
  components: {},
  props: {
    quota: {
      type: Object as PropType<QuotaInterface>,
      required: true
    }
  },
  setup (props) {
    return {
      props
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaCard {
}
</style>
