<template>
  <div class="Usage">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/usage"/>
        </el-scrollbar>
      </el-aside>
      <el-main >
        <el-scrollbar>
          <global-breadcrumb/>
          <usage-nav/>
            <router-view/>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'
import UsageNav from '@/components/Usage/UsageNav.vue'
import GlobalBreadcrumb from '@/components/GlobalBreadcrumb.vue'

export default defineComponent({
  name: 'Usage',
  components: {
    GlobalNav,
    GlobalBreadcrumb,
    UsageNav
  },
  props: {},
  setup () {
    return {}
  }
})
</script>

<style scoped>
.Usage {
}
.el-container {
  height: calc(100vh - 60px);
}
.el-main {
  background-color: #fff;
  padding: 0;
  margin: 0;
  line-height: 100px;
}
</style>
