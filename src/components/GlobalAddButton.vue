<template>
  <div class="GlobalAddButton">

    <q-fab
      class="btn-add shadow-10"
      v-model="fabButton"
      vertical-actions-align="right"
      color="primary"
      icon="add"
      direction="down"
    >
      <q-fab-action color="primary" icon="computer" label="新建云主机" :to="{ path: '/my/usage/vmcreate' }"/>
      <q-fab-action color="primary" icon="description" label="申请新配额" :to="{ path: '/my/quota/apply' }"/>
    </q-fab>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GlobalAddButton',
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
.GlobalAddButton {
}

.btn-add {
  float: right;
  top: 33px;
  right: 20px;
}
</style>
