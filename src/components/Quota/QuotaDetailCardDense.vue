<template>
  <div class="QuotaDetailCardIntense">

    <q-card flat square class="bg-grey-1">
      <q-card-section class="q-pa-sm">

        <div class="row justify-between text-center">

          <div class="col-auto text-left">
            <span class="text-grey q-px-sm">云主机时长<q-tooltip>云主机创建后可用的时间</q-tooltip></span>
            <span>{{ quota.duration_days }}天</span>
          </div>

          <div class="col-auto text-right q-px-sm ">
            <q-btn label="配额详情" flat dense padding="none" color="primary"
                   :to="isGroup ? {path: `/my/group/quota/detail/${quota.id}`} : {path: `/my/personal/quota/detail/${quota.id}`}"/>
          </div>

        </div>

        <div class="row justify-between items-center text-center">

          <div class="col-auto text-left">
            <span class="text-grey q-px-sm">配额过期时间</span>
            <span v-if="quota.expiration_time">{{ new Date(quota.expiration_time).toLocaleString() }}</span>
            <span v-else>长期有效</span>
          </div>

          <div class="col-auto text-right q-px-sm">

            <div v-if="!quota.expired && !quota.exhausted" class="row justify-end items-center text-light-green">
              <q-icon name="check_circle_outline" size="sm"/>
              <div>可用</div>
            </div>

            <div v-else class="row justify-end items-center text-red">
              <q-icon name="highlight_off" size="sm"/>
              <span>不可用:</span>
              <span v-if="quota.expired" class="text-red">已过期</span>
              <span v-if="quota.exhausted" class="text-red">,已用尽</span>
            </div>

          </div>
        </div>

      </q-card-section>

      <q-separator color="white" size="2px"/>

      <q-card-section class="q-pa-sm">
        <div class="row justify-evenly items-center">

          <div class="col-auto">
            <div class="column justify-start items-center" style="height: 120px">

              <div class="col-10">
                <div class="column justify-center items-center" style="height: 100px">

                  <q-circular-progress
                    show-value
                    font-size="12px"
                    :value="quota.vcpu_total && ( 1 - quota.vcpu_used / quota.vcpu_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - quota.vcpu_used/ quota.vcpu_total)>=.4 ? 'light-green' : (1 - quota.vcpu_used/ quota.vcpu_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="quota.vcpu_total === 0">无</div>
                    <div v-else-if="quota.vcpu_total===quota.vcpu_used" class="text-grey">
                      {{ quota.vcpu_total }}核用尽
                    </div>
                    <div v-else>{{ quota.vcpu_total - quota.vcpu_used }}/{{ quota.vcpu_total }}核</div>
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
                    :value="quota.ram_total && (1 - quota.ram_used / quota.ram_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - quota.ram_used/ quota.ram_total)>=.4 ? 'light-green' : (1 - quota.ram_used/ quota.ram_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="quota.ram_total === 0">无</div>
                    <div v-else-if="quota.ram_total===quota.ram_used" class="text-grey">
                      {{ quota.ram_total / 1024 }}GB用尽
                    </div>
                    <div v-else>
                      {{ (quota.ram_total - quota.ram_used) / 1024 }}/{{ quota.ram_total / 1024 }}GB
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
                    :value="quota.private_ip_total && (1 -quota.private_ip_used / quota.private_ip_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - quota.private_ip_used/ quota.private_ip_total)>=.4 ? 'light-green' : (1 - quota.private_ip_used/ quota.private_ip_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="quota.private_ip_total === 0">无</div>
                    <div v-else-if="quota.private_ip_total===quota.private_ip_used" class="text-grey">
                      {{ quota.private_ip_total }}个用尽
                    </div>
                    <div v-else>{{ quota.private_ip_total - quota.private_ip_used }}/{{
                        quota.private_ip_total
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
                    :value="quota.public_ip_total && (1 - quota.public_ip_used/ quota.public_ip_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - quota.public_ip_used/ quota.public_ip_total)>=.4 ? 'light-green' : (1 - quota.public_ip_used/ quota.public_ip_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="quota.public_ip_total === 0">无</div>
                    <div v-else-if="quota.public_ip_total===quota.public_ip_used" class="text-grey">
                      {{ quota.public_ip_total }}个用尽
                    </div>
                    <div v-else>{{ quota.public_ip_total - quota.public_ip_used }}/{{
                        quota.public_ip_total
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
                    :value="quota.disk_size_total && (1 - quota.disk_size_used/ quota.disk_size_total) * 100 "
                    size="80px"
                    :thickness="0.22"
                    :color="(1 - quota.disk_size_used/ quota.disk_size_total)>=.4 ? 'light-green' : (1 - quota.disk_size_used/ quota.disk_size_total)>=.2 ? 'orange' : 'red' "
                    track-color="grey-3"
                    class="q-ma-sm"
                  >
                    <div v-if="quota.disk_size_total === 0">无</div>
                    <div v-else-if="quota.disk_size_total===quota.disk_size_used" class="text-grey">
                      {{ quota.disk_size_total }}GB用尽
                    </div>
                    <div v-else>{{ quota.disk_size_total - quota.disk_size_used }}/{{
                        quota.disk_size_total
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
    },
    isGroup: {
      type: Boolean,
      required: false
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.QuotaDetailCardIntense {
}
</style>
