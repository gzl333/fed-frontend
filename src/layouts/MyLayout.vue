<template>
  <q-layout view="hHh lpR fFf">

    <global-leftdrawer/>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered :width="300">
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    void $store.dispatch('vm/updateVmTable')
    /* my内页所有table加载起始点 */

    const currentUser = $store.state.account
    const rightDrawerOpen = ref(false)
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
    const toLogout = () => {
      void $store.dispatch('account/logoutCstUser')
    }
    return {
      rightDrawerOpen,
      toggleRightDrawer,
      currentUser,
      toLogout
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
