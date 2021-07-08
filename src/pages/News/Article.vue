<template>
  <div class="Article">
    this is Article
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
    console.log($route.params)
    return {}
  }
})
</script>

<style lang="scss" scoped>
.Article {
  height: 2000px;
  background-color: #000;
}
</style>
