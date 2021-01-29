<template>
  <div class="App">
    <el-container>
      <el-header >
        <global-header />
      </el-header>
      <el-main >
          <router-view />
      </el-main>
    </el-container>
  </div>
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

<style scoped>
.App{
}
.el-container {
  height: 100vh;
}
.el-header {
  padding: 0
}
.el-main {
  padding: 0
}

.el-main {
  /*margin-top: 0px;*/
  /*background-color: #409eff;*/
  /*color: #333;*/
  /*text-align: center;*/
  /*line-height: 160px;*/
  /*min-height: 100%;*/
  /*overflow: hidden;*/
}
</style>
