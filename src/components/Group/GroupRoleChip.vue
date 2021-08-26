<template>
  <div class="GroupRoleChip">

    <q-chip v-if="props.role === 'owner'"
            square label="组长" color="light-green" text-color="white" icon="mdi-account-tie"/>
    <q-chip v-if="props.role === 'leader'"
            square label="管理员" color="teal" text-color="white" icon="mdi-account-star"/>
    <q-chip v-if="props.role === 'member'"
            square label="成员" color="blue-grey" text-color="white" icon="mdi-account"/>

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
</style>
