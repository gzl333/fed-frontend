<template>
  <div class="GlobalBreadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>当前位置：首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store/index.ts'

export default defineComponent({
  name: 'GlobalBreadcrumb',
  components: {},
  props: {},
  setup () {
    const store = useStore<GlobalDataProps>()
    const position = computed(() => store.state.position)
    return {
      breadcrumb: position
    }
  }
})
</script>

<style scoped>
.GlobalBreadcrumb {
  padding: 15px;
  background-color: #f5f5f5;
}
</style>
