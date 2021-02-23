<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'src/store'

export default defineComponent({
  name: 'App',
  setup () {
    const $store = useStore<StateInterface>()
    void $store.dispatch('user/reloadToken')
  }
})
</script>
