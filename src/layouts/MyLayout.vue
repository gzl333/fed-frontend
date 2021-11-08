<template>

  <!--todo add a total scroll area to layout -->

  <!--  <div class="row no-wrap">-->
  <!--    <div class="col">-->
  <!--      <div class="column full-height" style="height: 800px;">-->
  <!--        <q-scroll-area class="col" visible>-->

  <q-layout view="lhh LpR lff">

    <q-header class="bg-white" bordered>
      <div class="row no-wrap justify-center" style="min-width: 1290px;">
        <global-header-content class="content-fixed-width"/>
      </div>
    </q-header>

    <q-drawer
      v-model="isLeftDrawerOpen"
      side="left"
      behavior="desktop"
      :width="120"
      :breakpoint="0"
      class="bg-c-blue1 text-white"
    >
      <global-left-drawer-content/>
    </q-drawer>

    <q-drawer
      v-model="isRightDrawerOpen"
      side="right"
      :width="500" overlay bordered
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

  <!--        </q-scroll-area>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

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
