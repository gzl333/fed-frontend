<template>
  <div class="Obs">
    this is Obs.
    <div>
      showing Dog:
      <h1 v-if="loading"> loading...</h1>
      <img v-if="loaded" :src="result.message" alt="cat">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useURLLoader from '@/hooks/useURLLoader'

type DogResult = {
  message: string;
  status: string;
}

export default defineComponent({
  name: 'Obs',
  components: {},
  props: {},
  setup () {
    const {
      result,
      loading,
      loaded
    } = useURLLoader<DogResult>('https://dog.ceo/api/breeds/image/random')
    return {
      result,
      loading,
      loaded
    }
  }
})
</script>

<style scoped>
.Obs {
}
</style>
