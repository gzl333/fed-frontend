<template>
  <div class="Monitor">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/monitor"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Monitor</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Monitor',
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
.Monitor {
}
</style>
