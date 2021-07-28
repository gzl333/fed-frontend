<template>
  <div class="ClosedBeta">
    <div class="column items-center">
      <div class="col-auto title-area text-center">
        <div class="text-white text-h3">内测公告</div>
      </div>

      <div class="col-auto card-area">

        <q-card class="q-my-xl shadow-24">
          <!--        <img src="https://cdn.quasar.dev/img/mountains.jpg">-->
          <q-card-section>
            <div class="text-h7">中国科技云联邦将开启内部使用测试，用户可领取测试配额，并使用配额创建云主机实例。</div>
          </q-card-section>
          <q-card-section class="q-pt-none">

            <div class="text-h7">1. 点击以下按钮，获取云主机配额</div>

            <div v-if="quotaActivities.length > 0">
              <div class="row items-center justify-center">
                <div class="col-auto q-pa-md" v-for="activity in quotaActivities" :key="activity.id">
                  <q-card class="activity-card bg-secondary text-white ">
                    <q-card-section>
                      <div class="text-h6 text-center">{{ activity.name }}</div>
                      <div class="text-h7 text-center text-grey-4">
                        {{ new Date(activity.start_time).toLocaleString() }} -
                        {{ new Date(activity.end_time).toLocaleString() }}
                      </div>
                    </q-card-section>

                    <q-card-section>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">所属机构</div>
                        <div class="col"> {{
                            $store.state.vm.tables.globalDataCenterTable.byId[$store.state.vm.tables.globalServiceTable.byId[activity.service]?.data_center]?.name
                          }}
                        </div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">所属服务</div>
                        <div class="col"> {{
                            $store.state.vm.tables.globalServiceTable.byId[activity.service]?.name
                          }}
                        </div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">配额规格</div>
                        <div class="col">
                          CPU {{ activity.cpus }}核 / 内存 {{ activity.ram / 1024 }}GB / 私网IP {{ activity.private_ip }}个 /
                          公网IP
                          {{ activity.public_ip }}个
                        </div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">配额过期</div>
                        <div class="col"> {{ new Date(activity.expiration_time).toLocaleString() }}</div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">发布总量</div>
                        <div class="col"> 总共{{ activity.count }}个</div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">用户限量</div>
                        <div class="col"> 每位用户可领{{ activity.times_per_user }}次</div>
                      </div>

                      <div class="row q-pb-xs">
                        <div class="col-3 text-grey-4">云主机时长</div>
                        <div class="col"> {{ activity.duration_days }}天</div>
                      </div>

                    </q-card-section>

                    <q-separator dark/>

                    <q-card-actions align="between">
                      <q-btn outline label="领取配额" :disable="activity.count === activity.got_count"
                             @click="$store.dispatch('applyQuota/getActivityQuotaAndUpdateGlobalQuotaActivityTable', activity.id)"/>
                      <div class="text-h7">活动剩余：{{ activity.count - activity.got_count }}个</div>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="text-red">
                抱歉，当前暂无配额赠送活动。请咨询云联邦管理员。
              </div>
            </div>

            <div class="text-h7">2. 使用配额
              <q-btn class="text-h7" flat color="primary" size="md" padding="none" :to="{path:'/my/personal/vmcreate'}">
                创建云主机
              </q-btn>
            </div>
            <div class="text-h7">3. 根据需要使用云主机，具体使用方法请参考<q-btn flat padding="none" color="primary" @click="gotoManual">用户手册</q-btn></div>

            <!--            <pre>{{ quotaActivities }}</pre>-->
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
  name: 'ClosedBeta',
  components: {},
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const quotaActivities = computed(() => Object.values($store.state.applyQuota.tables.globalQuotaActivityTable.byId))

    const gotoManual = () => {
      // 中文访问/manual 英文访问/manual/en
      const url = location.origin + '/manual/personal/'
      window.open(url)
    }

    return {
      $store,
      quotaActivities,
      gotoManual
    }
  }
})
</script>

<style lang="scss" scoped>
.ClosedBeta {
  width: 100vw;
  background: linear-gradient(90deg, #191654, #43C6AC);
  min-height: calc(100vh - #{$global-footer-height});
}

.title-area {
  padding-top: 150px;
}

.card-area {
  width: 1000px;
}

.activity-card {
  width: 420px;
}
</style>
