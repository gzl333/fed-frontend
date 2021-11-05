<template>
  <div class="GroupRoleChip">

    <q-chip v-if="props.role === 'owner'"
            square color="light-green" text-color="white" icon="mdi-account-star">
      <div style=" width: 45px;text-align: center">
        {{ $t('组长') }}
      </div>
    </q-chip>

    <q-chip v-if="props.role === 'leader'"
            square color="teal" text-color="white" icon="mdi-account-tie">
      <div style=" width: 45px;text-align: center">
        {{ $t('管理员') }}
      </div>
    </q-chip>

    <q-chip v-if="props.role === 'member'"
            square color="blue-grey" text-color="white" icon="mdi-account">
      <div style=" width: 45px;text-align: center">
        {{ $t('组员') }}
      </div>
    </q-chip>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GroupRoleChip',
  components: {},
  props: {
    role: {
      type: String,
      required: true
    }
  },
  setup (props) {
    return {
      props
    }
  }
})
</script>

<style lang="scss" scoped>
.GroupRoleChip {
}

.chip {
  width: 100px;
  //text-align: center;
}
</style>
