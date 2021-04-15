<template>
  <div class="WarningList">
    <div class="text-h6 q-pt-lg q-px-none q-pb-sm">到期预警</div>
    <q-separator/>
    <div v-if="!vmLessOneWeek || !vmLessOneMonth || !userQuota">
      正在加载，请稍候或刷新页面
    </div>
    <div v-else>
      <div class="row q-mt-md q-mb-sm">
        <div class="col-2">
          <div align="center" class="q-mx-md q-mt-md">
            <q-icon size="md" name="settings">
            </q-icon>
          </div>
          <div align="center" class="q-mx-sm">资源配额</div>
        </div>
        <div class="col">
          <div class="row">
            <div class="q-ml-md text-subtitle1 q-mb-sm">您有{{ userQuota.length }}个资源配额已申请成功,请尽快使用！</div>
            <div class="col-2" align="center">
              <q-btn
                color="nord8"
                label="去使用，创建云主机"
                dense
                unelevated
                flat
                class="q-ml-md"
                :to="{ path: '/my/usage/vmcreate' }"
              />
            </div>
          </div>
          <q-separator/>
          <div class="row q-mt-md" v-for="(item,index) in userQuota" :key="index">
            <div align="center" class="col-1  text-subtitle1 text-nord11">{{Math.ceil((Math.abs(new Date(item.expiration_time).getTime() - new Date().getTime())) / (1000 * 3600 * 24))}}天过期</div>
            <div class="col">
              <div class="row q-ml-lg">{{item.display}}</div>
              <div class="row">
                <div class="col q-ml-sm" >
                  <q-circular-progress
                    v-if="item.vcpu_total"
                    show-value
                    class="text-light-blue q-ma-lg"
                    :value="item.vcpu_used"
                    size="50px"
                    color="light-blue"
                  />
                  <q-circular-progress
                    v-if="item.ram_total"
                    show-value
                    class="text-light-blue q-ma-lg"
                    :value="item.ram_used"
                    size="50px"
                    color="light-blue"
                  />
                  <q-circular-progress
                    v-if="item.disk_size_total"
                    show-value
                    class="text-light-blue q-ma-lg"
                    :value="item.disk_size_used"
                    size="50px"
                    color="light-blue"
                  />
                  <q-circular-progress
                    v-if="item.public_ip_total"
                    show-value
                    class="text-light-blue q-ma-lg"
                    :value="item.public_ip_used"
                    size="50px"
                    color="light-blue"
                  />
                  <q-circular-progress
                    v-if="item.private_ip_total"
                    show-value
                    class="text-light-blue q-ma-lg"
                    :value="item.private_ip_used"
                    size="50px"
                    color="light-blue"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <q-separator/>

      <div class="row q-mt-sm q-mb-md">
        <div class="col-2">
          <div align="center" class="q-mx-md q-mt-md">
            <q-icon size="md" name="computer">
            </q-icon>
          </div>
          <div align="center" class="q-mx-sm">云主机</div>
        </div>
        <div class="col">
          <div class="row">
            <div class="col">

            </div>
            <div class="col">11</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'WarningList',
  components: {},
  props: {},
  emits: [],
  setup () {
    const $store = useStore<StateInterface>()

    const userQuota = Object.values($store.state.vm.tables.userQuotaTable.byId).filter(quota => {
      // 已过期的返回false
      if (quota.expiration_time && (new Date(quota.expiration_time).getTime() < new Date().getTime())) {
        return false
      } else {
        // 未过期的返回true
        return true
      }
    })
    console.log('userQuota:', userQuota)

    const vmLessOneWeek = Object.values($store.state.vm.tables.userServerTable.byId).filter(server => {
      if (server.expiration_time) {
        const diff = Math.abs(new Date(server.expiration_time).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
        const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
        if (days > 0 && days <= 7) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })

    const vmLessOneMonth = Object.values($store.state.vm.tables.userServerTable.byId).filter(server => {
      if (server.expiration_time) {
        const diff = Math.abs(new Date(server.expiration_time).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
        const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
        if (days > 0 && days <= 30) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })

    return {
      vmLessOneWeek,
      vmLessOneMonth,
      userQuota
    }
  }
})
</script>

<style lang="scss" scoped>
.WarningList {
}

.my-card {
  width: 100%;
  // height: calc(100vh - 114px - 67vh);
  width: 41.666666667vw;
  // width: calc(0.41666667 * 100vw);
  height: 216px;
  // font-size: 1vw;
}

.inner-card {
  width: 90%;
  // width: calc(100vw - 165px - 82vw);
  // height: calc(100vh - 114px - 77vh);
  width: 8.85416667vw;
  height: 110px;
  font-size: 0.833333333vw;
}

</style>
