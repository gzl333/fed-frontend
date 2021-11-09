<template>

  <q-scroll-area style="height: 100vh; width: 100vw;" visible>

    <q-layout view="lhh LpR lff">

      <!--保证header在drawer下。因为框架限制drawer的z-index为1000，且无法更改。只能降低header的z-index。默认2000改为1000-->
      <q-header class="bg-white" bordered style="min-width: 800px; z-index: 1000;">
        <div class="row no-wrap justify-center">
          <global-header-content class="content-fixed-width"/>
        </div>
      </q-header>

      <q-drawer
        class="z-max"
        v-model="isLeftDrawerOpen"
        side="left"
        :width="120"
      >
        <global-left-drawer-content/>
      </q-drawer>

      <q-drawer
        v-model="isRightDrawerOpen"
        side="right"
        :width="300"
        overlay
        elevated
      >
        <global-right-drawer-content/>
      </q-drawer>

      <q-page-container>
        <q-page>
          <router-view/>
        </q-page>
      </q-page-container>

      <!--    <q-page-container>-->
      <!--      <q-page class="row no-wrap">-->
      <!--        <div class="col">-->
      <!--          <div class="column full-height">-->
      <!--            <q-scroll-area class="col" visible>-->
      <!--              <router-view/>-->
      <!--            </q-scroll-area>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </q-page>-->
      <!--    </q-page-container>-->

      <q-footer
        v-model="isFooterOpen"
        elevated
      >
        <div id="layout-footer" class="bg-white text-black">
          footer
        </div>
      </q-footer>

    </q-layout>

  </q-scroll-area>

</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../store'
import GlobalHeaderContent from 'components/Layout/GlobalHeaderContent.vue'
import GlobalRightDrawerContent from 'components/Layout/GlobalRightDrawerContent.vue'
import GlobalLeftDrawerContent from 'components/Layout/GlobalLeftDrawerContent.vue'

export default defineComponent({
  name: 'MyLayout.vue',
  components: {
    GlobalHeaderContent,
    GlobalLeftDrawerContent,
    GlobalRightDrawerContent
  },
  props: {},
  setup () {
    const $store = useStore<StateInterface>()

    /* my内页所有table加载起始点 */
    console.log('$store:', $store.state)
    void $store.dispatch('fed/loadAllTables')
    /* my内页所有table加载起始点 */

    /* 本页需加载的table */
    // dataCenterTable
    // serviceTable
    /* 本页需加载的table */

    const isLeftDrawerOpen = computed(() => $store.state.account.items.isLeftDrawerOpen)
    const isRightDrawerOpen = computed(() => $store.state.account.items.isRightDrawerOpen)
    const isFooterOpen = computed(() => $store.state.account.items.isFooterOpen)

    return {
      isLeftDrawerOpen,
      isRightDrawerOpen,
      isFooterOpen
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
