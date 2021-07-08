<template>
  <div class="NewsList">
    <div class="column items-center">
      <div class="col-auto text-center">
        <div class="text-white text-h3">新闻动态</div>
        <div class="text-grey-5 text-h6">有何新鲜事？</div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewsList',
  components: {},
  props: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.NewsList {
  background-color: $c-blue-1;
  height: 2000px;
  padding-top: 150px; // 正文到顶部的距离
}
</style>
