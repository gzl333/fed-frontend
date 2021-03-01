<template>
  <q-layout view="hHh lpR fFf">
    <q-header :elevated="scrollRatio===0.4" class="home-header column justify-center" :style="dynamicBackground">
      <q-toolbar>
        <q-toolbar-title class="col-4">
          <q-btn flat :ripple="false" unelevated>
            <img src="logo.png" class="logo">
          </q-btn>
        </q-toolbar-title>
<!--        <q-btn label="LOG" @click="logJWT"/>-->
        <!--        <pre class="q-ma-none container">{{ scrollTop }}, {{scrollRatio}}</pre>-->
        <q-space/>
        <!--        <q-separator vertical v-if="scrollRatio===0.6"/>-->
        <div class="q-px-xl q-gutter-xl">
          <q-btn flat :ripple="false" color="nord6" label="资源与服务" @click="scrollToElement($refs['part1'])"/>
          <q-btn flat :ripple="false" color="nord6" label="资源提供者" @click="scrollToElement($refs['part2'])"/>
          <q-btn flat :ripple="false" color="nord6" label="开发者" @click="scrollToElement($refs['part3'])"/>
        </div>
        <!--        <q-separator vertical v-if="scrollRatio===0.6"/>-->
        <div class="q-px-xl q-gutter-sm">
          <q-btn unelevated :ripple="false" color="nord10" label="登 录" @click="isShowLogin = true"/>
          <q-btn outline :ripple="false" color="nord6" label="注 册" type="a" href="https://passport.escience.cn/regist.jsp"
                 target="_blank"/>

          <q-dialog v-model="isShowLogin">
            <login-card/>
          </q-dialog>
        </div>

      </q-toolbar>
    </q-header>

    <q-page-container >
      <q-page class="non-selectable">
        <q-scroll-area class="home-scroll-area">
          <q-scroll-observer @scroll="onScroll"/>

          <div class="part1" ref="part1">
            <div class="q-pa-lg">
              <h3 class="text-white">资源与服务</h3>
            </div>

          </div>
          <div class="part2" ref="part2">
            <q-parallax :height="900" src="img/cloud1.png">
              <h3 class="text-white">资源提供者</h3>
            </q-parallax>
          </div>

          <div class="part3" ref="part3">
            <q-parallax :height="900">
              <template v-slot:media>
                <video width="1440" height="1080" poster="https://cdn.quasar.dev/img/polina.jpg" autoplay loop muted>
                  <source type="video/webm" src="https://cdn.quasar.dev/img/polina.webm">
                  <source type="video/mp4" src="https://cdn.quasar.dev/img/polina.mp4">
                </video>
              </template>
              <h3 class="text-white">开发者</h3>
            </q-parallax>
          </div>
          <div class="home-footer">
            <div>©CNIC 2021</div>
          </div>
        </q-scroll-area>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { scroll } from 'quasar'
import LoginCard from 'components/LoginCard.vue'

// import { useStore } from 'vuex'
// import { StateInterface } from 'src/store'

const {
  getScrollTarget,
  setVerticalScrollPosition
} = scroll
export default defineComponent({
  name: 'HomeLayout.vue',
  components: {
    LoginCard
  },
  props: {},
  setup () {
    // const $store = useStore<StateInterface>()
    // const logJWT = () => {
    //   void $store.dispatch('retainToken')
    // }

    // jump within the page
    function scrollToElement (el: HTMLElement) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 700
      setVerticalScrollPosition(target, offset, duration)
    }

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
    return {
      isShowLogin: ref('false'),
      scrollTop,
      onScroll,
      scrollRatio,
      dynamicBackground,
      scrollToElement
    }
  }
})
</script>

<style lang="scss" scoped>
.HomeLayout {
  background-color: $nord6;
}

.home-header {
  //background: transparentize(black, .6);
  height: 100px;
  line-height: 100px;
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
