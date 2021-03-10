<template>
  <div class="WarningList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="text-h6 text-weight-bold">资源到期预警</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center no-wrap q-gutter-md q-pt-sm">
          <div class="col">
            <div class="text-center text-subtitle1">{{ warningList[0] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ warning.week.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ warningList[1] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ warning.month.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ warningList[2] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ warning.sixMonth.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ warningList[3] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ warning.unpaidWhenDue.value }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface WarningProp{
  week: number;
  month: number;
  sixMonth: number;
  unpaidWhenDue: number;
}
export default defineComponent({
  name: 'WarningList',
  components: {
  },
  props: {
    warning: {
      type: Array as PropType<WarningProp[]>
    }
  },
  emits: [
    'update-month'
  ],
  setup (props, context) {
    const warningList = ['本周到期', '一个月到期', '半年到期', '到期未支付']
    setTimeout(() => {
      context.emit('update-month', 77)
    }, 5000)
    return {
      warningList
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
