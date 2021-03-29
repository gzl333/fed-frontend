<template>
  <div class="Main q-pa-xl">
    <div class="gt-sm">
      <div class="row justify-between">
        <!--       <todo-list :todo="todo" @update-unpaid="updateUnpaid" />-->
        <!-- <todo-list :todo="todo" />-->
        <div class="col">
          <warning-list />
        </div>

        <div class="col">
          <quick-entry />
        </div>
      </div>

      <div class="row justify-around q-pt-md">
        <div class="col"><vm-list /></div>
        <div class="col">
          <quota-list />
        </div>
      </div>

      <!-- <div class="row items-center q-gutter-lg q-pt-lg">
        <div class="col">
          <obs-list />
        </div>
        <div :ratio="8 / 3.5" class="col">
          <cost-details />
        </div>
        <div :ratio="8 / 3.5" class="col">
           <group-list />
        </div>
      </div> -->
    </div>
    <div class="lt-md column justify-around">
      <div class="col">
        <warning-list />
      </div>
      <div class="col">
        <quick-entry />
      </div>
      <div class="col q-pt-md">
        <vm-list />
      </div>
      <div class="col q-pt-md">
        <quota-list />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VmList from 'src/components/main/VmList.vue'
// import TodoList, { ToDoProp } from 'src/components/main/TodoList.vue'
import WarningList from 'src/components/main/WarningList.vue'
import QuickEntry from 'src/components/main/QuickEntry.vue'
// import ObsList from 'src/components/main/ObsList.vue'
import QuotaList from 'components/main/QuotaList.vue'
// import CostDetails from 'src/components/main/CostDetails.vue'
// import GroupList from 'src/components/main/GroupList.vue'

import { useStore } from 'vuex'
import { StateInterface } from '../store'

export default defineComponent({
  name: 'Main',
  components: {
    VmList,
    // TodoList,
    WarningList,
    QuickEntry,
    // ObsList,
    QuotaList
    // CostDetails,
    // GroupList
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.user.cstTrueName
    // MainTodo
    // const todoList: ToDoProp = reactive({
    //   unpaid: 1,
    //   tosolved: 2,
    //   quota: 1,
    //   toconfirmed: 1
    // })
    // const todo = toRefs(todoList)
    // const updateUnpaid = (unpaid: number) => {
    //   todoList.unpaid = unpaid
    // }

    return {
      // todo,
      // updateUnpaid,
      // updateMonth,
      currentUser

    }
  }
})
</script>

<style lang="scss" scoped>
.Main {
}

.title {
  height: 100%;
  max-height: 200px;
}
</style>
