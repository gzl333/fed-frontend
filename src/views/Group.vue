<template>
  <div class="Group">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/group"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Group</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Group',
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
.Group {
}
</style>
