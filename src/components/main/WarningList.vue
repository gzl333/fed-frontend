<template>
  <div class="WarningList">
    <div class="my-card">
      <q-card-section>
        <div class="text-h6 text-weight-bold">资源到期预警</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- 适配大屏：尺寸大于sm（1023）-->
        <div class="row gt-sm items-center no-warp">
          <div class="col">
            <q-card class="inner-card" bordered flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                    ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>{{ warningList[0] }}</div>
                  <q-badge align="top" color="nord10"> 配额 </q-badge>
                  <div style="font-size: 1.5em" class="q-my-xs q-ml-md">
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
            <q-card class="inner-card" bordered flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                    ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>{{ warningList[1] }}</div>
                  <q-badge align="top" color="nord14"> 配额 </q-badge>
                  <div class="q-my-xs q-ml-md" style="font-size: 1.5em">
                    {{ quotaLessOneWeek[0].lessOneWeekNum
                    }}<q-tooltip class="bg-nord10" :offset="[5, 10]"
                      >{{ quotaLessOneWeek[0].quotaName }}
                    </q-tooltip>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>

          <!-- style="visibility: hidden" -->
          <div class="col">
            <q-card class="inner-card" bordered flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                    ><i class="fas fa-desktop"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>{{ warningList[0] }}</div>
                  <q-badge align="top" color="nord11"> 虚拟机 </q-badge>
                  <div style="font-size: 1.5em" class="q-my-xs q-ml-md">xx</div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
          <!--  style="visibility: hidden" -->
          <div class="col">
            <q-card class="inner-card" bordered flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em"
                    ><i class="fas fa-desktop"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="q-pt-md q-pb-xs q-px-xs">
                  <div>{{ warningList[1] }}</div>
                  <q-badge align="top" color="nord13">虚拟机</q-badge>
                  <div style="font-size: 1.5em" class="q-my-xs q-ml-md">xx</div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- 适配手机 -->
        <!-- <div class="row lt-md items-center no-warp q-pa-xs">
          <div class="col">
            <q-card class="inner-card bg-nord11" flat>
              <q-card-section horizontal>
                <q-card-section class="col-5 flex flex-center">
                  <q-icon style="font-size: 2em" class="text-white"
                    ><i class="fas fa-exclamation-triangle"></i
                  ></q-icon>
                </q-card-section>
                <q-card-section class="text-white q-pt-md q-pb-xs q-px-xs">
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
        </div> -->
      </q-card-section>
    </div>
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
  // height: calc(100vh - 114px - 67vh);
  width: 41.666666667vw;
  // width: calc(0.41666667 * 100vw);
  height: 216px;
  font-size: 1vw;
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
