<template>
  <el-container>
    <el-aside width="150px">
      <el-scrollbar>
        <global-nav currentView="/main" />
      </el-scrollbar>
    </el-aside>
    <el-main class="main">
      <el-scrollbar>
        <global-breadcrumb class="breadcrumb" />
        <div>您好，用户{{ user.name }}</div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'
import GlobalNav from '@/components/GlobalNav.vue'
import GlobalBreadcrumb from '@/components/GlobalBreadcrumb.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalNav,
    GlobalBreadcrumb
  },
  props: {
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const user = store.state.user
    return {
      user
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
.breadcrumb {
  padding: 15px;
  background-color: #f5f5f5;
}

.el-main {
  line-height: 100px;
}
</style>
