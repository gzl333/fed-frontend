<template>
  <el-menu
    router="true"
    :default-active="currentView"
    class="el-menu-vertical"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/main">
      <i class="el-icon-menu"></i>
      <template #title>首页</template>
    </el-menu-item>
    <el-menu-item index="/usage">
      <i class="el-icon-document"></i>
      <template #title>在用资源</template>
    </el-menu-item>
    <el-menu-item index="/group">
      <i class="el-icon-setting"></i>
      <template #title>我的小组</template>
    </el-menu-item>
    <el-menu-item index="/bill">
      <i class="el-icon-setting"></i>
      <template #title>计费中心</template>
    </el-menu-item>
    <el-menu-item index="/ticket">
      <i class="el-icon-setting"></i>
      <template #title>工单中心</template>
    </el-menu-item>
    <el-menu-item index="/manage">
      <i class="el-icon-setting"></i>
      <template #title>资源管理</template>
    </el-menu-item>
    <el-menu-item index="/monitor">
      <i class="el-icon-setting"></i>
      <template #title>监测中心</template>
    </el-menu-item>
    <el-menu-item index="/data">
      <i class="el-icon-setting"></i>
      <template #title>数据中心</template>
    </el-menu-item>
    <el-menu-item index="/maintenance">
      <i class="el-icon-setting"></i>
      <template #title>联邦维护</template>
    </el-menu-item>
    <el-menu-item index="/statistics">
      <i class="el-icon-setting"></i>
      <template #title>统计报表</template>
    </el-menu-item>
    <el-menu-item index="/provide">
      <i class="el-icon-setting"></i>
      <template #title>已供资源</template>
    </el-menu-item>
    <el-menu-item index="/users">
      <i class="el-icon-setting"></i>
      <template #title>用户管理</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GlobalNav',
  components: {
  },
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  setup () {
    return {
    }
  }
})
</script>

<style>
.el-menu-vertical {
  /* min-height应该用一个计算值 */
}
</style>
