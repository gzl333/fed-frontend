<template>
  <el-row>
    <el-col :span="4">
      <el-button type="primary" icon="el-icon-s-unfold" plain>
        机构树
      </el-button>
    </el-col>
    <el-col :span="16" class="searchbar"> <global-search-bar /></el-col>
    <el-col :span="4">
      <el-button type="success" icon="el-icon-plus"> 创建云主机 </el-button>
    </el-col>
  </el-row>

  <div v-if="currentShow === 'vm'">showing vm</div>
  <div v-if="currentShow === 'orgTree'">showing orgTree</div>
  <div v-if="currentShow === 'advSearch'">showing adv search</div>
  <div v-if="currentShow === 'create'">showing create vm</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GlobalSearchBar from '@/components/GlobalSearchBar.vue'

export default defineComponent({
  name: 'VMManager',
  components: {
    GlobalSearchBar
  },
  props: {
  },
  setup () {
    const currentShow = 'vm'
    return {
      currentShow
    }
  }

})
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.searchbar {
  margin-top: -14px;
}
</style>
