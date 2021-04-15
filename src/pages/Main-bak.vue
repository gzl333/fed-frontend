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

            <q-separator size="5px"/>

              <div class="col">
                <quick-entry/>
              </div>
            <q-separator size="5px"/>
              <div class="col">
                <vm-list/>
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
import VmList from 'components/main/VmList.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalHeader,
    WarningList,
    QuickEntry,
    VmList
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.account.cstTrueName

    return {
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
