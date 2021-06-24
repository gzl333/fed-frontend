<template>
  <div class="GlobalAddButton">

    <q-fab
      class="btn-add"
      v-model="fabButton"
      vertical-actions-align="right"
      color="primary"
      icon="add"
      direction="down"
    >
      <q-fab-action :label="$t('新建云主机')" unelevated color="primary" icon="computer" :to="{ path: '/my/personal/vmcreate' }"/>
      <q-fab-action :label="$t('申请个人配额')" unelevated color="primary" icon="description" :to="{ path: '/my/personal/quota_apply' }"/>
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
  transform: translate(0, 65%);
}
</style>
