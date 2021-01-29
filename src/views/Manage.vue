<template>
  <div class="Manage">
  <el-container>
    <el-aside width="150px">
      <el-scrollbar>
        <global-nav currentView="/manage" />
      </el-scrollbar>
    </el-aside>
    <el-main>
      <el-scrollbar>Manage </el-scrollbar>
    </el-main>
  </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Manage',
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

<style scoped>
.Manage {
}
</style>
