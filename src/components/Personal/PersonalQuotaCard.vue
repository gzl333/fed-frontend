<template>
  <div class="QuotaCard">

    <q-card flat square class="bg-grey-1">
      <q-card-section class="q-pa-sm">

        <div class="row justify-end text-center">

          <div class="col-8 text-left">

            <span class="text-grey q-px-sm">云主机时长<q-tooltip>云主机创建后可用的时间</q-tooltip></span>
            <span>{{ props.quota.duration_days }}天</span>
          </div>

          <div class="col text-right q-px-sm ">
            <q-btn label="配额详情" flat dense padding="none" color="primary"
                   :to="{path: `/my/personal/quota/detail/${props.quota.id}`}"/>
          </div>

        </div>

        <div class="row justify-end text-center">

          <div class="col-8 text-left">
            <span class="text-grey q-px-sm">配额过期时间</span>
            <span v-if="props.quota.expiration_time">{{ new Date(props.quota.expiration_time).toLocaleString() }}</span>
            <span v-else>长期有效</span>
          </div>
          <div class="col text-right q-px-sm">
            <span v-if="props.quota.expired" class="text-red">已过期 </span>
            <span v-if="props.quota.exhausted" class="text-red">已用尽</span>
          </div>
        </div>

      </q-card-section>

      <q-separator color="white"/>
      <q-separator color="white"/>

      <q-card-section class="q-pa-sm">
        <div class="row">

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="props.quota.vcpu_total && ( 1 - props.quota.vcpu_used / props.quota.vcpu_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - props.quota.vcpu_used/ props.quota.vcpu_total)>=.4 ? 'light-green' : (1 - props.quota.vcpu_used/ props.quota.vcpu_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="props.quota.vcpu_total === 0">无</div>
                    <div v-else-if="props.quota.vcpu_total===props.quota.vcpu_used" class="text-grey">
                      {{ props.quota.vcpu_total }}核用尽
                    </div>
                    <div v-else>{{ props.quota.vcpu_total - props.quota.vcpu_used }}/{{ props.quota.vcpu_total }}核</div>
                  </q-circular-progress>
                </div>
              </div>

              <div class="col-2 text-grey">
                CPU
              </div>
            </div>
          </div>

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="props.quota.ram_total && (1 - props.quota.ram_used / props.quota.ram_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - props.quota.ram_used/ props.quota.ram_total)>=.4 ? 'light-green' : (1 - props.quota.ram_used/ props.quota.ram_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="props.quota.ram_total === 0">无</div>
                    <div v-else-if="props.quota.ram_total===props.quota.ram_used" class="text-grey">
                      {{ props.quota.ram_total / 1024 }}GB用尽
                    </div>
                    <div v-else>
                      {{ (props.quota.ram_total - props.quota.ram_used) / 1024 }}/{{ props.quota.ram_total / 1024 }}GB
                    </div>
                  </q-circular-progress>
                </div>
              </div>

              <div class="col-2 text-grey">
                内存
              </div>
            </div>
          </div>

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="props.quota.private_ip_total && (1 -props.quota.private_ip_used / props.quota.private_ip_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - props.quota.private_ip_used/ props.quota.private_ip_total)>=.4 ? 'light-green' : (1 - props.quota.private_ip_used/ props.quota.private_ip_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="props.quota.private_ip_total === 0">无</div>
                    <div v-else-if="props.quota.private_ip_total===props.quota.private_ip_used" class="text-grey">
                      {{ props.quota.private_ip_total }}个用尽
                    </div>
                    <div v-else>{{ props.quota.private_ip_total - props.quota.private_ip_used }}/{{
                        props.quota.private_ip_total
                      }}个
                    </div>
                  </q-circular-progress>
                </div>
              </div>

              <div class="col-2 text-grey">
                私网IP
              </div>
            </div>
          </div>

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="props.quota.public_ip_total && (1 - props.quota.public_ip_used/ props.quota.public_ip_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - props.quota.public_ip_used/ props.quota.public_ip_total)>=.4 ? 'light-green' : (1 - props.quota.public_ip_used/ props.quota.public_ip_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="props.quota.public_ip_total === 0">无</div>
                    <div v-else-if="props.quota.public_ip_total===props.quota.public_ip_used" class="text-grey">
                      {{ props.quota.public_ip_total }}个用尽
                    </div>
                    <div v-else>{{ props.quota.public_ip_total - props.quota.public_ip_used }}/{{
                        props.quota.public_ip_total
                      }}个
                    </div>
                  </q-circular-progress>
                </div>
              </div>

              <div class="col-2 text-grey">
                公网IP
              </div>
            </div>
          </div>

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="props.quota.disk_size_total && (1 - props.quota.disk_size_used/ props.quota.disk_size_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - props.quota.disk_size_used/ props.quota.disk_size_total)>=.4 ? 'light-green' : (1 - props.quota.disk_size_used/ props.quota.disk_size_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="props.quota.disk_size_total === 0">无</div>
                    <div v-else-if="props.quota.disk_size_total===props.quota.disk_size_used" class="text-grey">
                      {{ props.quota.disk_size_total }}GB用尽
                    </div>
                    <div v-else>{{ props.quota.disk_size_total - props.quota.disk_size_used }}/{{
                        props.quota.disk_size_total
                      }}GB
                    </div>
                  </q-circular-progress>
                </div>
              </div>

              <div class="col-2 text-grey">
                云硬盘
              </div>
            </div>
          </div>

        </div>

      </q-card-section>
    </q-card>

  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { QuotaInterface } from 'src/store/server/state'

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
