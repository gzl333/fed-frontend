<template>
  <el-container>
    <el-aside width="200px" style="height: 100%">
      <global-nav currentItem="/monitor" />
    </el-aside>
    <el-main>Monitor</el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Monitor',
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
