<template>
  <div class="QuotaDetail">
    <div class="column items-center justify-center">
      <div class="col q-pa-none">

        <div class="row title-area">
          <div class="col">
            <q-btn icon="arrow_back_ios_new" color="primary" flat unelevated dense
                   @click="goBack"/>
            配额详情
          </div>
        </div>

        <!--直接从url进入本页面时，tables尚未载入，应显示loading界面。对取属性进行缓冲，不出现undefined错误-->
        <div class="row content-area">
          <div v-if="!quota || !vms" class="col">
            正在加载，请稍候
          </div>

          <div v-else class="col ">
            <!--            配额详情开始-->
            <div class="row items-center justify-evenly quota-area">

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    服务节点
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">

                      <div>{{
                          $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.userServiceTable.byId[quota.service]?.data_center]?.name
                        }}
                      </div>
                      <div>{{ $store.state.vm.tables.userServiceTable.byId[quota.service]?.name }}</div>

                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    资源有效期
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      {{ quota.duration_days }}天
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    CPU
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      <div v-if="quota.vcpu_total === 0">无</div>
                      <q-circular-progress v-else
                                           show-value
                                           font-size="12px"
                                           :value=" quota.vcpu_total && (1 - quota.vcpu_used/ quota.vcpu_total) * 100 "
                                           size="80px"
                                           :thickness="0.22"
                                           color="light-green"
                                           track-color="grey-3"
                                           class="q-ma-sm"
                      >
                        <div v-if="quota.vcpu_total===quota.vcpu_used" class="text-red">
                          共{{ quota.vcpu_total }}核用尽
                        </div>
                        <div v-else>{{ quota.vcpu_total - quota.vcpu_used }}/{{ quota.vcpu_total }}核</div>
                      </q-circular-progress>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    内存
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      <div v-if="quota.ram_total === 0">无</div>
                      <q-circular-progress v-else
                                           show-value
                                           font-size="12px"
                                           :value=" quota.ram_total && (1 - quota.ram_used/ quota.ram_total) * 100 "
                                           size="80px"
                                           :thickness="0.22"
                                           color="light-green"
                                           track-color="grey-3"
                                           class="q-ma-sm"
                      >
                        <div v-if="quota.ram_total===quota.ram_used" class="text-red">
                          共{{ quota.ram_total / 1024 }}GB用尽
                        </div>
                        <div v-else>
                          {{ (quota.ram_total - quota.ram_used) / 1024 }}/{{ quota.ram_total / 1024 }}GB
                        </div>
                      </q-circular-progress>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    私网IP
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      <div v-if="quota.private_ip_total === 0">无</div>
                      <q-circular-progress v-else
                                           show-value
                                           font-size="12px"
                                           :value=" quota.private_ip_total && (1 - quota.private_ip_used/ quota.private_ip_total) * 100 "
                                           size="80px"
                                           :thickness="0.22"
                                           color="light-green"
                                           track-color="grey-3"
                                           class="q-ma-sm"
                      >
                        <div v-if="quota.private_ip_total===quota.private_ip_used" class="text-red">
                          共{{ quota.private_ip_total }}个用尽
                        </div>
                        <div v-else>
                          {{ quota.private_ip_total - quota.private_ip_used }}/{{ quota.private_ip_total }}个
                        </div>
                      </q-circular-progress>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    公网IP
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      <div v-if="quota.public_ip_total === 0">无</div>
                      <q-circular-progress v-else
                                           show-value
                                           font-size="12px"
                                           :value=" quota.public_ip_total && (1 - quota.public_ip_used/ quota.public_ip_total) * 100 "
                                           size="80px"
                                           :thickness="0.22"
                                           color="light-green"
                                           track-color="grey-3"
                                           class="q-ma-sm"
                      >
                        <div v-if="quota.public_ip_total===quota.public_ip_used" class="text-red">
                          共{{ quota.public_ip_total }}个用尽
                        </div>
                        <div v-else>
                          {{ quota.public_ip_total - quota.public_ip_used }}/{{ quota.public_ip_total }}个
                        </div>
                      </q-circular-progress>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    云硬盘
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      <div v-if="quota.disk_size_total === 0">无</div>
                      <q-circular-progress v-else
                                           show-value
                                           font-size="12px"
                                           :value=" quota.disk_size_total && (1 - quota.disk_size_used/ quota.disk_size_total) * 100 "
                                           size="80px"
                                           :thickness="0.22"
                                           color="light-green"
                                           track-color="grey-3"
                                           class="q-ma-sm"
                      >
                        <div v-if="quota.disk_size_total===quota.disk_size_used" class="text-red">
                          共{{ quota.disk_size_total }}GB用尽
                        </div>
                        <div v-else>
                          {{ quota.disk_size_total - quota.disk_size_used }}/{{ quota.disk_size_total }}GB
                        </div>
                      </q-circular-progress>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-auto ">
                <div class="column justify-start items-center" style="height: 120px">
                  <div class="col-2 text-grey">
                    配额创建时间
                  </div>
                  <div class="col-10">
                    <div class="column justify-center items-center" style="height: 100px">
                      {{ new Date(quota.expiration_time).toLocaleString() }}
                      <div v-if="(new Date(quota.expiration_time).getTime() - new Date().getTime()) < 0"
                           class="text-red">
                        已过期
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <!--            配额详情结束-->

            <!--            云主机列表开始-->
            <div class="row">
              <div class="col">

                <div class="q-pa-md text-grey">
                  配额关联资源
                </div>

                <vm-table :vms="vms"/>
              </div>
            </div>
            <!--            云主机列表结束-->
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'
import { useRoute, useRouter } from 'vue-router'

import VmTable from 'components/usage/VmTable.vue'

export default defineComponent({
  name: 'QuotaDetail',
  components: { VmTable },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const $router = useRouter()
    const $route = useRoute()

    // 进入本页面强制更新vm/userQuotaTable,数据更新来自后台，进入页面后应强制更新table,刷新quota状态
    void $store.dispatch('vm/updateUserQuotaTable')

    // 从route对象中读取id参数
    const quotaId = $route.params.id as string
    // 获取quota对象
    const quota = computed(() => $store.state.vm.tables.userQuotaTable.byId[quotaId])
    // 根据quota.servers获取server对象数组
    const vms = computed(() => quota.value.servers?.map((serverId) => $store.state.vm.tables.userServerTable.byId[serverId]))

    // 返回上一页
    const goBack = () => {
      $router.go(-1)
    }
    return {
      goBack,
      quota,
      vms: vms,
      $store
    }
  }
})
</script>

<style lang="scss" scoped>
.QuotaDetail {
}

.title-area {
  width: $general-width-no-padding;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}

.content-area {
  width: $general-width-no-padding;
}

.quota-area {
  border: $grey-4 1px solid;
  margin-top: 10px;
  padding: 15px 0;
  height: 150px;
}

.quota-column {
  height: 120px;
}

</style>
