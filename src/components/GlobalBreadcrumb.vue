<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>当前位置：首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
      {{ item }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

export default defineComponent({
  name: 'GlobalBreadcrumb',
  components: {
  },
  props: {
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const breadcrumb = computed(() => store.state.position.breadcrumb)
    return {
      breadcrumb: breadcrumb
    }
  }
})
</script>

<style>
</style>
