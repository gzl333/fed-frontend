<template>
  <div class="Main">
    <div class="q-pt-md q-pl-xl q-pr-xl">
      <div class="row items-center q-gutter-lg">
        <!--   <q-responsive :ratio="8 / 3" class="col"> -->
        <!--       <todo-list :todo="todo" @update-unpaid="updateUnpaid" />-->
        <!-- <todo-list :todo="todo" />
        </q-responsive>-->
        <div class="col">
          <warning-list />
        </div>
        <div class="col">
          <quick-entry />
        </div>
      </div>

      <div class="row items-center q-gutter-lg q-mt-md">
        <div class="col"><vm-list /></div>
        <div class="col">
          <quota-list />
        </div>
      </div>
      <!-- <div class="row items-center q-gutter-lg q-pt-lg">
        <q-responsive :ratio="8 / 5" class="col">
          <obs-list />
        </q-responsive>
        <q-responsive :ratio="8 / 3.5" class="col">
          <cost-details />
        </q-responsive>
        <q-responsive :ratio="8 / 3.5" class="col">
           <group-list />
        </q-responsive>
      </div> -->
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
