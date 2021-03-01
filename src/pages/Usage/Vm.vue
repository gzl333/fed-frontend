<template>
  <div class="Vm">
    this is Vm
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from '../../store'

export default defineComponent({
  name: 'Vm',
  components: {
  },
  props: {
  },
  setup () {
    const $store = useStore<StateInterface>()
    const currentUser = $store.state.user
    const logJWT = () => $store.dispatch('user/retainToken')
    return {
      currentUser,
      logJWT
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}
</style>
