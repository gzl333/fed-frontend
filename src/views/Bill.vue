<template>
  <div class="Bill">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/bill"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>Bill</el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'

export default defineComponent({
  name: 'Bill',
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
.Bill {
}
</style>
