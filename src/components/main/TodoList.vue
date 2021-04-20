<template>
  <div class="TodoList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="text-h6 text-weight-bold">待办事项</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center no-wrap q-gutter-md q-pt-sm">
          <div class="col">
            <div class="text-center text-subtitle1">{{ todoList[0] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ todo.unpaid.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ todoList[1] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ todo.tosolved.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ todoList[2] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ todo.quota.value }}
            </div>
          </div>
          <div class="col">
            <div class="text-center text-subtitle1">{{ todoList[3] }}</div>
            <div class="text-center text-h5 q-pt-sm">
              {{ todo.toconfirmed.value }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export interface ToDoProp {
  unpaid: number;
  tosolved: number;
  quota: number;
  toconfirmed: number;
}
export default defineComponent({
  name: 'TodoList',
  components: {
  },
  props: {
    todo: {
      type: Object as PropType<ToDoProp>
      // default: ''
    }
  },
  emits: [
    'update-unpaid'
  ],
  setup (props, context) {
    const todoList = [
      '待支付订单',
      '待办工单',
      '配额调整申请',
      '待确认组'
    ]
    setTimeout(() => {
      context.emit('update-unpaid', 22)
    }, 2000)
    return {
      todoList
    }
  }
})
</script>

<style lang="scss" scoped>
.TodoList {
}
.my-card {
  width: 100%;
}
</style>
