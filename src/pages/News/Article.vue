<template>
  <div class="Article">
    <div class="column items-center">

      <div class="col-auto title-area text-center">
        <div class="text-white text-h3">中国科技云联邦内测公告</div>
      </div>

      <div class="col-auto card-area">

        <q-card class="q-my-xl shadow-24" square>
          <img src="https://cdn.quasar.dev/img/mountains.jpg">
          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">{{ $route.params.name }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

          </q-card-section>
        </q-card>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Article',
  components: {},
  props: {},
  setup () {
    const $route = useRoute()

    return {
      $route
    }
  }
})
</script>

<style lang="scss" scoped>
.Article {
  width: 100vw;
  background: linear-gradient(90deg, #021048, #1e38a3);
  min-height: 100vh;
}

.title-area {
  padding-top: 150px;
}

.card-area {
  width: 1000px;
}
</style>
