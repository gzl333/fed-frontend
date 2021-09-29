<template>
  <div class="FederationResource">
    <div class="q-pa-md row items-start q-gutter-md">
      <div>
        <div class="text-center text-subtitle1 text-weight-bold">服务自主资源配置</div>
        <q-card class="my-card text-subtitle2 text-weight-bold q-mt-md q-pa-md">
          <q-card-section>
            <span>公网IP总量：{{ privateNum.public_ip_total }}个</span>
          </q-card-section>
          <q-card-section>
            <span>公网IP使用量：{{ privateNum.public_ip_used }}个</span>
          </q-card-section>
          <q-card-section>
            <span>私网IP总量：{{ privateNum.private_ip_total }}个</span>
          </q-card-section>
          <q-card-section>
            <span>私网IP使用量：{{ privateNum.private_ip_used }}个</span>
          </q-card-section>
          <q-card-section>
            <span>CPU核心总量：{{ privateNum.vcpu_total }}核</span>
          </q-card-section>
          <q-card-section>
            <span>CPU核心使用量：{{ privateNum.vcpu_used }}核</span>
          </q-card-section>
          <q-card-section>
            <span>内存总量：{{ privateNum.ram_total / 1024 }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>内存使用量：{{ privateNum.ram_used / 1024 }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘总量：{{ privateNum.disk_size_total }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘使用量：{{ privateNum.disk_size_used }}GB</span>
          </q-card-section>
        </q-card>
      </div>
      <div>
        <div class="text-center text-subtitle1 text-weight-bold">联邦资源配置</div>
        <q-card class="my-card text-subtitle2 text-weight-bold q-mt-md q-pa-md">
          <q-card-section>
            <span>公网IP总量：{{ shareNum.public_ip_total }}个</span>
          </q-card-section>
          <q-card-section>
            <span>公网IP使用量：{{ shareNum.public_ip_used }}个</span>
          </q-card-section>
          <q-card-section>
            <span>私网IP总量：{{ shareNum.private_ip_total }}个</span>
          </q-card-section>
          <q-card-section>
            <span>私网IP使用量：{{ shareNum.private_ip_used }}个</span>
          </q-card-section>
          <q-card-section>
            <span>CPU核心总量：{{ shareNum.vcpu_total }}核</span>
          </q-card-section>
          <q-card-section>
            <span>CPU核心使用量：{{ shareNum.vcpu_used }}核</span>
          </q-card-section>
          <q-card-section>
            <span>内存总量：{{ shareNum.ram_total / 1024 }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>内存使用量：{{ shareNum.ram_used / 1024 }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘总量：{{ shareNum.disk_size_total }}GB</span>
          </q-card-section>
          <q-card-section>
            <span>硬盘使用量：{{ shareNum.disk_size_used }}GB</span>
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
  name: 'FederationResource',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const privateNum = computed(() => $store.getters['fed/getPrivateNum'])
    const shareNum = computed(() => $store.getters['fed/getShareNum'])
    return {
      privateNum,
      shareNum
    }
  }
})
</script>

<style lang="scss" scoped>
.FederationResource {
}
</style>
