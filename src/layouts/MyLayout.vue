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
    void $store.dispatch('usage/updateUsageTable')
    /* my内页所有table加载起始点 */

    const currentUser = $store.state.user
    const rightDrawerOpen = ref(false)
    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }
    const toLogout = () => {
      void $store.dispatch('user/logoutCstUser')
    }
    const log = async () => {
      const result = await $store.dispatch('user/fetchCstNewToken', $store.state.user.token!.refresh)
      console.log(result)
    }
    return {
      rightDrawerOpen,
      toggleRightDrawer,
      currentUser,
      toLogout,
      log
    }
  }
})
</script>

<style lang="scss" scoped>
.logo {
  height: 50px;
}

.dropdown-content {
  min-width: 200px;
  background-image: url(https://cdn.quasar.dev/img/material.png);
  background-size: 150% auto;
}

.dropdown-items {
  text-align: center;
}
</style>
