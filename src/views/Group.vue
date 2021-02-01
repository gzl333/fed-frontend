<template>
  <div class="Group">
    <el-container>
      <el-aside width="150px">
        <el-scrollbar>
          <global-nav currentView="/group"/>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-scrollbar>
          <global-breadcrumb/>
          Group
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalNav from '@/components/GlobalNav.vue'
import GlobalBreadcrumb from '@/components/GlobalBreadcrumb.vue'

export default defineComponent({
  name: 'Group',
  components: {
    GlobalNav,
    GlobalBreadcrumb
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
