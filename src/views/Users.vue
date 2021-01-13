<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <global-nav currentView="/users" />
    </el-aside>
    <el-main>Users</el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Users',
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
