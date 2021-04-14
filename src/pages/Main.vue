<template>
  <div class="Main">
    <div class="column">

      <div class="col-auto">
        <div class="row justify-center">
          <global-header class="content-fixed-width"/>
        </div>
      </div>

      <q-separator/>

      <div class="col-auto">
        <div class="row justify-center">
          <div class="content-fixed-width">

              <div class="col">
                <warning-list/>
              </div>

              <div class="col">
                <quick-entry/>
              </div>

              <div class="col">
                <quota-list/>
              </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../store'

import GlobalHeader from 'components/GlobalHeader.vue'
import WarningList from 'src/components/main/WarningList.vue'
import QuickEntry from 'src/components/main/QuickEntry.vue'
import QuotaList from 'components/main/QuotaList.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalHeader,
    // VmList,
    WarningList,
    QuickEntry,
    QuotaList
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.account.cstTrueName
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
