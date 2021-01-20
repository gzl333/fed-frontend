<template>
  <el-menu
    :default-active="1"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">
      <router-link :to="{ name: 'vm' }">云服务器</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link :to="{ name: 'disk' }">云硬盘</router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link :to="{ name: 'obs' }">对象存储</router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <router-link :to="{ name: 'discovery' }">资源智能发现</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UsageNav',
  components: {
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
</style>
