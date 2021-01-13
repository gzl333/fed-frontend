<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>当前位置：首页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(position, index) in currentPosition"
      :key="index"
    >
      {{ position }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'GlobalBreadcrum',
  components: {
  },
  props: {
    currentPosition: {
      type: Array as PropType<string[]>,
      require: true
    }
  },
  setup () {
    return {
    }
  }
})
</script>

<style>
</style>
