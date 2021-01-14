<template>
  <el-container>
    <el-aside width="200px">
      <global-nav currentView="/usage" />
    </el-aside>
    <el-main class="main">
      <div class="breadcrum">
        <global-breadcrum :currentPosition="['在用资源', '云服务器']" />
      </div>
      <div>
        <el-tabs type="border-card" value="云服务器">
          <el-tab-pane label="云服务器">
            <vm-manager />
          </el-tab-pane>
          <el-tab-pane label="云硬盘">云硬盘</el-tab-pane>
          <el-tab-pane label="对象存储">对象存储</el-tab-pane>
          <el-tab-pane label="资源智能发现">资源智能发现</el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'
import GlobalBreadcrum from '@/components/GlobalBreadcrum.vue'
import VmManager from '@/components/Usage/VmManager.vue'

export default defineComponent({
  name: 'Usage',
  components: {
    GlobalNav,
    GlobalBreadcrum,
    VmManager
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
.main {
  background-color: #fff;
  padding: 0;
  margin: 0;
}
.breadcrum {
  padding: 15px;
  background-color: #f5f5f5;
}
.el-tabs__nav {
  height: 40px;
  line-height: 40px;
}
.el-tabs__item {
  min-width: 200px;
}
.el-main {
  line-height: 100px;
}
</style>
