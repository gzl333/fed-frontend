<template>
  <div class="Data">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/data"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Data</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Data',
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
.Data {
}
</style>
