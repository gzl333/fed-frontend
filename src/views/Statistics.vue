<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <global-nav currentView="/statistics" />
    </el-aside>
    <el-main>Statistics</el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Statistics',
  components: {
    GlobalNav
  },
  props: {
  },
  setup () {
    return {
    }
  }
})
</script>

<style>
</style>
