<template>
  <div class="Statistics">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/statistics"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Statistics</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Statistics',
  components: {
    GlobalNav
  },
  props: {},
  setup () {
    return {}
  }
})
</script>

<style scoped>
.Statistics {
}
</style>
