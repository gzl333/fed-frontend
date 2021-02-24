<template>
  <div class="UsageList">
    <q-card flat bordered class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-weight-bold">用户资源配额</div>
          </div>
          <div class="col-auto">
            <q-btn flat label="全部资源"> </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row items-center wrap q-gutter-sm">
          <div class="col" v-for="index in List" :key="index">
            <q-circular-progress
              show-value
              font-size="12px"
              :value="index"
              size="75px"
              :thickness="0.22"
              color="teal"
              track-color="grey-3"
              class="q-ma-md"
            >
              {{ index }}%
            </q-circular-progress>
          </div>
        </div>
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
  name: 'UsageList',
  components: {
  },
  props: {
  },
  setup () {
    const List = [20, 30, 40, 50, 60]
    return {
      List
    }
  }
})
</script>

<style lang="scss" scoped>
.UsageList {
}
.my-card {
  width: 100%;
}
</style>
