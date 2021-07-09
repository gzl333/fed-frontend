<template>
  <div class="NewsList">
    <div class="column items-center">

      <div class="col-auto title-area text-center">
        <div class="text-white text-h3">新闻动态</div>
        <div class="text-grey-5 text-h6">有何新鲜事？</div>
      </div>

      <div class="col-auto card-area">

        <q-card class="q-my-xl shadow-24 q-hoverable cursor-pointer" square v-ripple
                @click="$router.push({path: '/news/article/18'})">
          <!--https://stackoverflow.com/questions/64890882/how-to-create-a-clickable-q-card-with-hover-effect-->
          <span class="q-focus-helper">test</span>
          <img src="https://cdn.quasar.dev/img/mountains.jpg">
          <q-card-section>
            <div class="text-h5" >内侧公告</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ lorem }}
          </q-card-section>
        </q-card>

        <q-card class="q-my-xl shadow-24" square>
          <img src="https://cdn.quasar.dev/img/mountains.jpg">
          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ lorem }}
          </q-card-section>
        </q-card>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NewsList',
  components: {},
  props: {},
  setup () {
    const $router = useRouter()
    return {
      $router
    }
  }
})
</script>

<style lang="scss" scoped>
.NewsList {
  width: 100vw;
  background: linear-gradient(90deg, #021048, #1e38a3);
}

.title-area {
  padding-top: 150px;
}

.card-area {
  width: 1000px;
}

</style>
