<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="header" reveal>

      <div class="row items-center justify-between no-wrap">
        <div class="col-xs-6 col-sm-6 col-md-4 text-right">
          <q-btn flat :ripple="false" padding="none" size="xs" unelevated dense>
            <img src="logo.png" class="logo">
          </q-btn>
        </div>

        <div class="col-xs-6 col-sm-6 col-md-4 text-left q-px-xl q-gutter-sm">
          <q-btn class="gt-xs" outline :ripple="false" color="white" label="注 册" type="a"
                 href="https://passport.escience.cn/regist.jsp"
                 target="_blank"/>
          <q-btn unelevated :ripple="false" color="primary" label="登 录" @click="cstLogin"/>

        </div>
      </div>

    </q-header>

    <q-page-container>
      <q-page class="non-selectable">
        <q-scroll-area class="home-scroll-area">

              <!--如果进入/news，则显示newslist组件-->
              <news-list v-if="$route.path.endsWith('/news') ||$route.path.endsWith('/news/')"
              class=""/>

              <!--否则用router-view接住导航页面,并传入article id-->
              <router-view v-else/>

        </q-scroll-area>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import NewsList from 'components/News/NewsList.vue'

export default defineComponent({
  name: 'NewsLayout',
  components: { NewsList },
  props: {},
  setup () {
    const $route = useRoute()
    console.log($route.path)
    return {
      $route
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100px;
  line-height: 100px;
  //background: transparentize(white, .7);
  background: linear-gradient(90deg ,#021048,#1e38a3);
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

.part1 {
  padding-top: 80px;
  user-select: none;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -10;
  width: 100%;
  background: linear-gradient(90deg, $nord10, $nord7);

  h3 {
    text-align: center;
    margin-top: 40vh;
  }
}

.part2 {
  .q-parallax {
    opacity: .9;
  }
}

.part3 {
}

.home-footer {
  color: $nord6;
  text-align: center;
  height: 50px;
  line-height: 50px;
  background-color: $nord0;
}
</style>
