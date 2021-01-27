<template>
  <el-container>
    <el-aside width="150px">
      <el-scrollbar>
        <global-nav currentView="/usage" />
      </el-scrollbar>
    </el-aside>

    <el-main class="main">
      <el-scrollbar>
        <global-breadcrum class="breadcrum" />
        <usage-nav />
        <el-scrollbar class="scbar">
          <router-view />
        </el-scrollbar>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'
import GlobalBreadcrum from '@/components/GlobalBreadcrum.vue'
import UsageNav from '@/components/Usage/UsageNav.vue'

export default defineComponent({
  name: 'Usage',
  components: {
    GlobalNav,
    GlobalBreadcrum,
    UsageNav
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

.el-main {
  line-height: 100px;
}
</style>
