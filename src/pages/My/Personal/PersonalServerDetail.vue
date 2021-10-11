<template>
  <div class="VmDetail">

    <server-detail-card :server-id="serverId" :is-group="false"/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import ServerDetailCard from 'components/Server/ServerDetailCard.vue'

export default defineComponent({
  name: 'VmDetail',
  components: { ServerDetailCard },
  props: {},
  setup () {
    const $route = useRoute()
    // 从route对象中读取id参数
    const serverId = $route.params.serverId as string

    return {
      serverId
    }
  }
})
</script>

<style lang="scss" scoped>
.VmDetail {
}
</style>
