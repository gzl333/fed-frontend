<template>
  <div class="${COMPONENT_NAME}">
    this is ${COMPONENT_NAME}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '${COMPONENT_NAME}',
  components: {
  },
  props: {
  },
  setup () {
    return{
    }
  }
})
</script>

<style lang="scss" scoped>
.${COMPONENT_NAME} {
}
</style>
