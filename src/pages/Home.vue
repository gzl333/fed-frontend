<template>
  <div class="Home">
    <q-scroll-area style="height: 100vh; min-width: 300px;">
    <div class="part1 q-pt-lg ">
      <div class="header  row justify-center">

          <q-btn flat class="q-mr-xl ">
            <img src="logo.png" class="logo">
          </q-btn>
        <q-btn flat class="text-nord6 q-ma-sm">
          资源与服务
        </q-btn>
        <q-btn flat class="text-nord6 q-ma-sm">
          资源提供者
        </q-btn>
        <q-btn flat class="text-nord6 q-ma-sm">
          开发者
        </q-btn>
        <q-btn color="nord3" label="登 录" class="q-ma-sm"/>

      </div>
    </div>
    <div class="part2">
      this part2
    </div>
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {},
  props: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.Home {
  background-color: $nord6;
}
.part1 {
  user-select: none;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -10;
  width: 100%;
  background: linear-gradient(90deg, $nord10, $nord7);
}
.header {
  height: 50px;
}
.logo {
  height: 50px;
}
</style>
