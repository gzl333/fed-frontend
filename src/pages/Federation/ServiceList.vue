<template>
  <div class="ServiceList">
<!--    this is ServiceList-->
    {{ $t('message.test') }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'ServiceList',
  components: {},
  props: {},
  setup () {
    const $q = useQuasar()
    console.log($q.lang.getLocale()) // returns a string
    return {}
  }
})
</script>

<style lang="scss" scoped>
.ServiceList {
}
</style>
