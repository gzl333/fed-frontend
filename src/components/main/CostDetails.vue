<template>
  <div class="CostDetails">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">费用概览</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn flat>Action 1</q-btn>
        <q-btn flat>Action 2</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CostDetails',
  components: {
  },
  props: {
  },
  setup () {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.CostDetails {
}
.my-card {
  width: 100%;
}
</style>
