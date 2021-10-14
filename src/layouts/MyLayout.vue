<template>
  <q-layout view="hHh lpR lFr">

    <global-leftdrawer/>

    <q-drawer v-model="isRightDrawerOpen" side="right" :width="500" bordered>
      <global-rightdrawer/>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="column full-height">

            <q-scroll-area class="col" visible>
              <router-view/>
            </q-scroll-area>

          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer
      v-model="isFooterOpen"
      elevated
    >
      <div id="layout-footer" class="bg-white text-black">
        footer
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../store'
import GlobalRightdrawer from 'components/GlobalRightdrawer.vue'
import GlobalLeftdrawer from 'components/GlobalLeftdrawer.vue'

export default defineComponent({
  name: 'MyLayout.vue',
  components: {
    GlobalLeftdrawer,
    GlobalRightdrawer
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    /* my内页所有table加载起始点 */
    console.log('$store:', $store.state)
    void $store.dispatch('fed/loadAllTables')
    /* my内页所有table加载起始点 */

    const currentUser = $store.state.account
    const isRightDrawerOpen = computed(() => $store.state.account.data.isRightDrawerOpen)
    const isFooterOpen = computed(() => $store.state.account.data.isFooterOpen)

    const toLogout = () => {
      void $store.dispatch('account/cstLogout')
    }
    return {
      isRightDrawerOpen,
      isFooterOpen,
      currentUser,
      toLogout
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
