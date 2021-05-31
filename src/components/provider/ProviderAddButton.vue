<template>
  <div class="ProviderAddButton">
    <q-fab
      class="btn-add"
      v-model="fabButton"
      vertical-actions-align="right"
      color="primary"
      icon="add"
      direction="down"
    >
      <q-fab-action label="申请加入联邦" unelevated color="primary" icon="computer" :to="{ path: '/my/provider/join_federation' }"/>
      <q-fab-action label="新建数据中心" unelevated color="primary" icon="computer" :to="{ path: '/my/provider/create_datacenter' }"/>
    </q-fab>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ProviderAddButton',
  components: {},
  props: {},
  setup () {
    return {
      fabButton: ref(false)
    }
  }
})
</script>

<style lang="scss" scoped>
.ProviderAddButton {
}

.btn-add {
  float: right;
  transform: translate(0, 65%);
}
</style>
