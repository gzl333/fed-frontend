<template>
  <el-scrollbar>
    <el-container>
      <el-header style="padding: 0">
        <global-header />
      </el-header>
      <el-main style="padding: 0">
        <router-view />
      </el-main>
    </el-container>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalHeader from '@/components/GlobalHeader.vue'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader
  },
  setup () {
    return {
    }
  }
})
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-header {
  padding: 0;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
}

.el-main {
  margin-top: 0px;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  min-height: 100%;
  overflow: hidden;
}

.el-container {
  height: calc(100vh - 60px);
  background-color: #e9eef3;
}
</style>
