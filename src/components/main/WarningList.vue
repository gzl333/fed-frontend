<template>
  <div class="WarningList">
    <div v-if="!vmLessOneWeek ">
      正在加载，请稍候或刷新页面
    </div>
    <div v-else class="my-card-big">
      <q-card-section>
        <div class="text-h6 text-weight-bold">资源到期预警</div>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="row items-center no-warp">
          <div class="col">
            <q-card class="inner-card-big" bordered="false" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                  ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>本周到期</div>
                  <q-badge align="top"> 配额</q-badge>
                  <div style="font-size: 1.5em" class="q-my-xs q-ml-md">
                    {{
                      vmLessOneWeek.length
                    }}
                    <q-tooltip
                      :offset="[5, 10]"
                      v-if="vmLessOneWeek.length"
                    >
                      {{ vmLessOneWeek[0].ipv4 }}
                    </q-tooltip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>

          <div class="col">
            <q-card class="inner-card-big" bordered="false" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                  ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>本月到期</div>
                  <q-badge align="top" color="nord14"> 配额</q-badge>
                  <div class="q-my-xs q-ml-md" style="font-size: 1.5em">
                    {{
                      quotaLessOneMonth.length
                    }}
                    <q-tooltip
                      :offset="[5, 10]"
                      v-if="quotaLessOneMonth.length"
                    >{{ quotaLessOneMonth[0].quotaName }}
                    </q-tooltip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
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

    const vmLessOneWeek = Object.values($store.state.vm.tables.userServerTable.byId).filter(server => {
      if (server.expiration_time) {
        const diff = Math.abs(new Date(server.expiration_time).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
        const days = Math.ceil(diff / (1000 * 3600 * 24)) // 差换算成天数
        // console.log('in getter days:', it.type, '+', it.expirationTime, '+', days)
        if (days > 0 && days <= 7) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })

    const quotaLessOneMonth = Object.values($store.state.vm.tables.userQuotaTable.byId).filter(quota => {
      if (!quota.expiration_time && !quota.deleted) {
        const diff = Math.abs(new Date(quota.expiration_time).getTime() - new Date().getTime()) // 差=过期时间 - 当前时间
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
      quotaLessOneMonth
    }
  }
})
</script>

<style lang="scss" scoped>
.WarningList {
}

.my-card-big {
  width: 100%;
  // height: calc(100vh - 114px - 67vh);
  width: 41.666666667vw;
  // width: calc(0.41666667 * 100vw);
  height: 216px;
  // font-size: 1vw;
}

.inner-card-big {
  width: 90%;
  // width: calc(100vw - 165px - 82vw);
  // height: calc(100vh - 114px - 77vh);
  width: 8.85416667vw;
  height: 110px;
  font-size: 0.833333333vw;
}

.my-card-small {
  width: 100%;
}

.inner-card-small {
  width: 100%;
}
</style>
