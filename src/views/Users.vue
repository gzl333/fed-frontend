<template>
  <el-container>
    <el-aside width="150px">
      <el-scrollbar>
        <global-nav currentView="/users" />
      </el-scrollbar>
    </el-aside>
    <el-main> <el-scrollbar>Users </el-scrollbar></el-main>
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
