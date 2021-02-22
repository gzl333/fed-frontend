<template>
  <div class="Vm">this is Vm
  <pre>{{currentUser}}</pre></div>
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
    return {
      currentUser
    }
  }
})
</script>

<style lang="scss" scoped>
.Vm {
}
</style>
