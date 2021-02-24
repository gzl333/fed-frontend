<template>
  <div class="ObsList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">对象存储</div>
          </div>
          <div class="col-auto">
            <q-btn flat label="全部存储桶"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        Lorem ipsum
        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</q-card-section
      >
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
  name: 'ObsList',
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
.ObsList {
}
.my-card {
  width: 100%;
}
</style>
