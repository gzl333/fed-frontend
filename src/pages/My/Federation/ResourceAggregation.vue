<template>
  <div class="ResourceAggregation">
    <div class="q-pa-md row items-start q-gutter-md">
      <div>
        <div class="text-center text-subtitle1 text-weight-bold">服务私有配额</div>
        <q-card class="my-card text-subtitle2 text-weight-bold q-mt-md q-pa-md">
          <q-card-section>
            <span>公共IP总量：{{privateNum.public_ip_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>公共IP使用量：{{privateNum.public_ip_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>私有IP总量：{{privateNum.private_ip_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>私有IP使用量：{{privateNum.private_ip_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>CPU总量：{{privateNum.vcpu_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>CPU使用量：{{privateNum.vcpu_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>内存总量：{{privateNum.ram_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>内存使用量：{{privateNum.ram_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘总量：{{privateNum.disk_size_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘使用量：{{privateNum.disk_size_used}}</span>
          </q-card-section>
        </q-card>
      </div>
      <div>
        <div class="text-center text-subtitle1 text-weight-bold">服务共享配额</div>
        <q-card class="my-card text-subtitle2 text-weight-bold q-mt-md q-pa-md">
          <q-card-section>
            <span>公共IP总量：{{shareNum.public_ip_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>公共IP使用量：{{shareNum.public_ip_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>私有IP总量：{{shareNum.private_ip_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>私有IP使用量：{{shareNum.private_ip_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>CPU总量：{{shareNum.vcpu_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>CPU使用量：{{shareNum.vcpu_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>内存总量：{{shareNum.ram_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>内存使用量：{{shareNum.ram_used}}</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘总量：{{shareNum.disk_size_total}}</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘使用量：{{shareNum.disk_size_used}}</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
export default defineComponent({
  name: 'ResourceAggregation',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    // const ids = computed(() => $store.getters['vm/getAllIds']())
    const privateNum = computed(() => $store.getters['vm/getPrivateNum']())
    const shareNum = computed(() => $store.getters['vm/getShareNum']())
    return {
      // ids,
      privateNum,
      shareNum
    }
  }
})
</script>

<style lang="scss" scoped>
.ResourceAggregation {
}
</style>
