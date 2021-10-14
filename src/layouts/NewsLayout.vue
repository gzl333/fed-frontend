<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="header row justify-center" :style="dynamicBackground">
      <div class="row justify-between items-center no-wrap content-fixed-width">
        <div class="col-auto">
          <q-btn flat :ripple="false" padding="none" size="xs" unelevated dense>
            <img src="logo.png" class="logo" @click="$router.push({path: '/'})">
            <q-tooltip>首页</q-tooltip>
          </q-btn>
        </div>

        <HeaderDropdown v-if="currentUser.isLogin"/>

        <div v-else class="col-auto q-gutter-sm">
          <q-btn class="gt-xs" outline :ripple="false" color="white" label="注 册" type="a"
                 href="https://passport.escience.cn/regist.jsp" target="_blank"/>
          <q-btn unelevated :ripple="false" color="primary" label="登 录" @click="$store.dispatch('account/cstAskUrl')"/>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <q-page class="non-selectable">
        <q-scroll-area class="home-scroll-area">
          <q-scroll-observer @scroll="onScroll"/>

          <!--如果进入/news，则显示newslist组件-->
          <news-list v-if="$route.path.endsWith('/news') ||$route.path.endsWith('/news/')"/>

          <!--否则用router-view接住导航页面,并传入article id-->
          <router-view v-else/>

          <div class="footer">
            <div>©CNIC 2021</div>
          </div>

        </q-scroll-area>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import NewsList from 'components/News/NewsList.vue'
import HeaderDropdown from 'components/GlobalHeader/HeaderDropdown.vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

// import useCstLogin from 'src/hooks/useCstLogin'

export default defineComponent({
  name: 'NewsLayout',
  components: {
    HeaderDropdown,
    NewsList
  },
  props: {},
  setup () {
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore<StateInterface>()
    console.log($route.path)

    // /* news layout内页所有table加载起始点 */ todo ??? 为何在此加载
    // void $store.dispatch('vm_obsolete/updateVmTable').then(() => {
    //   console.log('$STORE-vm_obsolete:', $store.state.vm_obsolete)
    // })
    // void $store.dispatch('applyQuota_obsolete/updateQuotaApplicationTable').then(() => {
    //   console.log('$STORE-applyQuota_obsolete:', $store.state.applyQuota_obsolete)
    // })
    /* news layout内页所有table加载起始点 */

    const currentUser = computed(() => $store.state.account.data)

    // scroll info
    const scrollTop = ref(0)
    const onScroll = (info: Record<string, Record<string, number>>) => {
      scrollTop.value = info.position.top
    }
    const scrollRatio = computed(() => scrollTop.value > 400 ? 0.4 : scrollTop.value / 400 * 0.4)
    const dynamicBackground = computed(() => {
      return {
        background: `rgb(0,0,0, ${scrollRatio.value})`
      }
    })

    // // cstlogin
    // const cstLogin = useCstLogin()

    return {
      $route,
      $router,
      onScroll,
      scrollRatio,
      dynamicBackground,
      currentUser
      // cstLogin
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100px;
  line-height: 100px;
  //background: transparentize(white, .7);
  //background: linear-gradient(90deg ,#021048,#1e38a3);
}

.header-content {
  width: $general-width;
}

.logo {
  height: 50px;
}

.q-page-container {
  padding-top: 0 !important;
}

.home-scroll-area {
  height: 100vh;
  min-width: 300px;
}

.footer {
  color: white;
  text-align: center;
  height: $global-footer-height;
  line-height: $global-footer-height;
  background-color: $nord0;
}
</style>
