<template>
  <div class="WarningList">
    <q-card flat bordered class="my-card q-mt-md">
      <q-card-section class="bg-nord8 text-white">
        <div class="text-h6 text-weight-bold">资源到期预警</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-xs items-center">
          <div class="col">
            <q-card class="inner-card bg-nord11" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em" class="text-white"
                    ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs text-white">
                  <div class="text-subtitle1">{{ warningList[0] }}</div>
                  <q-badge align="top" color="nord10"> 配额 </q-badge>
                  <div class="text-h5 q-my-xs q-ml-md">
                    {{ quotaLessOneWeek[0].lessOneWeekNum
                    }}<q-tooltip class="bg-nord10" :offset="[5, 10]"
                      >{{ quotaLessOneWeek[0].quotaName }}
                    </q-tooltip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <div class="col">
            <q-card class="inner-card bg-nord13 text-white" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em" class="text-white"
                    ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs text-white">
                  <div class="text-subtitle1">{{ warningList[1] }}</div>
                  <q-badge align="top" color="nord14"> 配额 </q-badge>
                  <div class="text-h5 q-my-xs q-ml-md">
                    {{ quotaLessOneWeek[0].lessOneWeekNum
                    }}<q-tooltip class="bg-nord10" :offset="[5, 10]"
                      >{{ quotaLessOneWeek[0].quotaName }}
                    </q-tooltip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <div class="col" style="visibility: hidden">
            <q-card class="inner-card bg-nord10 text-white" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em" class="text-white"
                    ><i class="fas fa-desktop"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs text-white">
                  <div class="text-subtitle1">{{ warningList[0] }}</div>
                  <q-badge align="top" color="nord11"> 虚拟机 </q-badge>
                  <div class="text-h5 q-my-xs q-ml-md">xx</div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <div class="col" style="visibility: hidden">
            <q-card class="inner-card bg-nord14 text-white" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em" class="text-white"
                    ><i class="fas fa-desktop"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs text-white">
                  <div class="text-subtitle1">{{ warningList[1] }}</div>
                  <q-badge align="top" color="nord13">虚拟机</q-badge>
                  <div class="text-h5 q-my-xs q-ml-md">xx</div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'WarningList',
  components: {
  },
  props: {
  },
  emits: [
  ],
  setup () {
    const $store = useStore<StateInterface>()
    const quotaLessOneWeek = ref([{ quotaName: [''], lessOneWeekNum: 0 }])
    const quotaLessOneMonth = ref([{ quotaName: [''], lessOneMonthNum: 0 }])
    onMounted(() => {
      void $store.dispatch('quota/updateQuota').then(() => {
        quotaLessOneWeek.value = $store.getters['quota/lessOneWeek']
        quotaLessOneMonth.value = $store.getters['quota/lessOneMonth']
      })
    })
    // console.log('quotaLessOneWeek:', quotaLessOneWeek)
    // console.log('quotaLessOneMonth:', quotaLessOneMonth)
    const warningList = ['本周到期', '一个月到期']
    return {
      warningList,
      quotaLessOneWeek,
      quotaLessOneMonth
    }
  }
})
</script>

<style lang="scss" scoped>
.WarningList {
}
.my-card {
  width: 100%;
  height: calc(100vh - 114px - 67vh);
  width: calc(100vw - 165px - 49vw);
}
.inner-card {
  width: 90%;
  width: calc(100vw - 165px - 82vw);
  height: calc(100vh - 114px - 77vh);
}
</style>
