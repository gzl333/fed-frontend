<template>
  <el-container>
    <el-aside width="150px">
      <el-scrollbar>
        <global-nav currentView="/main" />
      </el-scrollbar>
    </el-aside>
    <el-main class="main">
      <el-scrollbar>
        <global-breadcrum class="breadcrum" />
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
import GlobalBreadcrum from '@/components/GlobalBreadcrum.vue'

export default defineComponent({
  name: 'Main',
  components: {
    GlobalNav,
    GlobalBreadcrum
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
.breadcrum {
  padding: 15px;
  background-color: #f5f5f5;
}

.el-main {
  line-height: 100px;
}
</style>
