<template>
  <div class="WarningList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-secondary text-nord6">
        <div class="text-h6 text-weight-bold">资源到期预警</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center no-wrap q-gutter-md q-pt-sm">
          <div class="col">
            <div class="row">
              <q-badge color="secondary" class="text-subtitle2 q-ml-xl">
                配额
              </q-badge>
            </div>
            <div class="row q-pt-md no-wrap">
              <div class="col">
                <q-badge color="secondary" class="text-subtitle2 q-ml-lg">
                  {{ warningList[0] }}
                </q-badge>
                <q-btn
                  class="text-h5 q-ml-xl text-secondary"
                  flat
                  :label="`${quotaLessOneWeek[0].lessOneWeekNum}`"
                >
                  <q-tooltip class="bg-nord14" :offset="[5, 10]"
                    >1、{{ quotaLessOneWeek[0].quotaName[0] }}; 2、{{
                      quotaLessOneWeek[0].quotaName[1]
                    }}
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="col">
                <q-badge color="secondary" class="text-subtitle2 q-ml-lg">
                  {{ warningList[1] }}
                </q-badge>
                <q-btn
                  class="text-h5 q-ml-xl text-secondary"
                  flat
                  :label="`${quotaLessOneMonth[0].lessOneMonthNum}`"
                >
                  <q-tooltip class="bg-nord14" :offset="[5, 10]"
                    >1、{{ quotaLessOneMonth[0].quotaName[0] }}; 2、{{
                      quotaLessOneMonth[0].quotaName[1]
                    }}
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
          <div class="col">
            <q-badge color="secondary" class="text-subtitle2"> server </q-badge>
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
}
</style>
