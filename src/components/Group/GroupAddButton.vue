<template>
  <div class="GroupAddButton">

    <q-fab
      class="btn-add"
      v-model="fabButton"
      vertical-actions-align="right"
      color="primary"
      icon="add"
      :label="$t('新建')"
      direction="down"
    >
      <q-fab-action :label="$t('新建组')" unelevated color="primary" icon="computer"
                    :to="{ path: '/my/personal/vmcreate' }"/>
      <q-fab-action :label="$t('新建组云主机')" unelevated color="primary" icon="computer"
                    :to="{ path: '/my/personal/vmcreate' }"/>
      <q-fab-action :label="$t('申请组云主机配额')" unelevated color="primary" icon="description"
                    :to="{ path: '/my/personal/quota_apply' }"/>
    </q-fab>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GroupAddButton',
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
.GroupAddButton {
}

.btn-add {
  float: right;
  transform: translate(0, 65%);
}
</style>
