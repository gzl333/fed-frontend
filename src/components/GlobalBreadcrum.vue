<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>当前位置：首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrum" :key="index">
      {{ item }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

export default defineComponent({
  name: 'GlobalBreadcrum',
  components: {
  },
  props: {
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const breadcrum = computed(() => store.state.position.breadcrum)
    return {
      breadcrum
    }
  }
})
</script>

<style>
</style>
