<template>
  <el-container>
    <el-aside width="200px">
      <global-nav currentView="/usage" />
    </el-aside>
    <el-main class="main">
      <global-breadcrum class="breadcrum" />
      <usage-nav />
      <router-view></router-view>
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
