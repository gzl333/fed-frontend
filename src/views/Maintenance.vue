<template>
  <div class="Maintenance">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/maintenance"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Maintenance</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'maintenance',
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
.Maintenance {
}
</style>
