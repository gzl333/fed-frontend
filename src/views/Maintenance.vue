<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <global-nav currentView="/maintenance" />
    </el-aside>
    <el-main>Maintenance</el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'maintenance',
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
